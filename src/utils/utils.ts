import moment from "moment";
import { toast } from "react-toastify";
import {
  DB_ForumGroup,
  DB_ForumPost,
  DB_Group,
  DB_UserTypes,
} from "../types/DBService.types";
import { CAMPUS_GROUPS, FORUM_GROUPS } from "./constants";
import { authService, dbService, storageService } from "./firebase";
import {
  query,
  collection,
  addDoc,
  where,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { Query, DocumentData, DocumentReference } from "firebase/firestore";

export const getMinimizedStr = (str: string): string => {
  let result = str;
  if (str.length > 10) {
    result = result.slice(0, 10);
    result += "...";
  }
  return result;
};

export const isLoggedIn = (): boolean => {
  return Boolean(authService.currentUser?.uid);
};

export const getFirestoreQuery = (
  path: string,
  queryCond: string,
  value: string
): Query<DocumentData> => {
  return query(collection(dbService, path), where(queryCond, "==", value));
};

export const getFirestoreDoc = (
  path: string
): DocumentReference<DocumentData> => {
  return doc(dbService, path);
};

export const initGroups = async () => {
  for (const group of CAMPUS_GROUPS) {
    const dbGroup: DB_Group = {
      enName: group.enName,
      korName: group.korName,
      participants: [],
      posts: [],
    };
    await addDoc(collection(dbService, "group"), dbGroup);
  }
};

export const findGroupId = async (group: string): Promise<string> => {
  let result = "";
  try {
    const q = query(
      collection(dbService, "group"),
      where("enName", "==", group)
    );

    const queryResult = await getDocs(q);

    for (const doc of queryResult.docs) {
      if (doc.id) {
        result = doc.id;
      }
    }
  } catch (error) {
    console.log(error);
  }

  return result;
};

export const findForumGroupId = async (group: string): Promise<string> => {
  let result = "";
  try {
    const q = query(
      collection(dbService, "forumGroup"),
      where("enName", "==", group)
    );
    const queryResult = await getDocs(q);

    for (const doc of queryResult.docs) {
      if (doc.id) {
        result = doc.id;
      }
    }
  } catch (error) {
    console.log(error);
  }

  return result;
};

export const getUserFromUid = async (
  uid: string
): Promise<DB_UserTypes | null> => {
  try {
    const q = query(collection(dbService, "user"), where("uid", "==", uid));
    const queryResult = await getDocs(q);

    for (const doc of queryResult.docs) {
      const data = doc.data();
      return {
        displayName: data.displayName,
        email: data.email,
        uid: data.uid,
        msgRoomIds: data.msgRoomIds,
      };
    }
  } catch (error) {
    console.log(error);
  }

  return null;
};

export const timeCalc = (time: number): string => {
  let result = "";

  const date = new Date(time);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  const phrase = `${year}${month < 10 ? `0${month}` : month}${
    day < 10 ? `0${day}` : day
  } ${hours < 10 ? `0${hours}` : hours}${
    minutes < 10 ? `0${minutes}` : minutes
  }`;

  result = moment(phrase, "YYYYMMDD HHmm").fromNow();

  return result;
};

export const deleteImgFromFirebase = async (imgUrl: string) => {
  try {
    const imgRef = ref(storageService, imgUrl);
    console.log(imgRef);
    if (imgRef) {
      await deleteObject(imgRef);
    }
  } catch (error) {
    console.log(error);
  }
};

export const loadGroupIns = async (
  forumGroup: string
): Promise<DB_ForumGroup | null> => {
  try {
    const q = query(
      collection(dbService, "forumGroup"),
      where("enName", "==", forumGroup)
    );
    const result = await getDocs(q);

    for (const doc of result.docs) {
      if (doc.exists()) {
        return {
          enName: doc.data().enName,
          korName: doc.data().korName,
          posts: doc.data().posts,
          views: doc.data().views,
        };
      }
    }
  } catch (error) {
    console.log(error);
  }

  return null;
};

export const handleDeleteForumPost = async (
  post: DB_ForumPost
): Promise<boolean> => {
  if (!isLoggedIn()) {
    return false;
  }

  if (!post || post.creatorId !== authService.currentUser?.uid) {
    toast.error("해당 게시물을 지울 권한이 없습니다.");
    return false;
  }

  try {
    const forumGroupDoc = doc(dbService, `forumGroup/${post.forumGroupId}`);
    const forumGroupQueryResult = await getDoc(forumGroupDoc);
    if (forumGroupQueryResult.exists()) {
      const forumGroupPosts = forumGroupQueryResult.get("posts");
      if (Array.isArray(forumGroupPosts)) {
        const afterPosts = forumGroupPosts.filter(
          (postId) => postId !== post.id
        );
        await updateDoc(forumGroupDoc, {
          posts: [...afterPosts],
        });
      }
    }

    // delete comments
    for (const commentId of post.comments) {
      const commentQuery = query(
        collection(dbService, "forumComment"),
        where("id", "==", commentId)
      );
      const commentQueryResult = await getDocs(commentQuery);
      for (const docRef of commentQueryResult.docs) {
        if (docRef.exists()) {
          // 이미지가 있으면 삭제
          const commentImgList = docRef.get("imgUrlList");
          if (commentImgList && Array.isArray(commentImgList)) {
            for (const imgUrl of commentImgList) {
              await deleteImgFromFirebase(imgUrl);
            }
          }

          await deleteDoc(doc(dbService, `forumComment/${docRef.id}`));
        }
      }
    }
    // delete post
    const postQuery = query(
      collection(dbService, "forumPost"),
      where("id", "==", post.id)
    );
    const postQueryResult = await getDocs(postQuery);

    for (const docRef of postQueryResult.docs) {
      if (docRef.exists()) {
        // 이미지가 있으면 삭제
        const postImgList = docRef.get("imgUrlList");
        if (postImgList && Array.isArray(postImgList)) {
          for (const imgUrl of postImgList) {
            await deleteImgFromFirebase(imgUrl);
          }
        }

        await deleteDoc(doc(dbService, `forumPost/${docRef.id}`));
      }
    }

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
