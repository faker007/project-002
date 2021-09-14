import { faSmile, faThumbsUp } from "@fortawesome/free-regular-svg-icons";
import {
  faCircleNotch,
  faEllipsisV,
  faPlus,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import { useState } from "react";
import { CampusDetailPostTypes } from "../types/CampusDetail.types";
import { DB_COMMENT, DB_UserTypes } from "../types/DBService.types";
import { authService, dbService } from "../utils/firebase";
import {
  deleteImgFromFirebase,
  getUserFromUid,
  isLoggedIn,
  timeCalc,
} from "../utils/utils";
import { Editor } from "./Editor";
import { v4 as uuid } from "uuid";
import { CampusDetailComment } from "./CampusDetailComment";
import { toast } from "react-toastify";
import {
  query,
  where,
  collection,
  getDocs,
  updateDoc,
  doc,
  addDoc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";

export const CampusDetailPost: React.FC<CampusDetailPostTypes> = ({
  post: { groupId, comments: commentIds, createdAt, body, creatorId, id },
  loginMode,
  setLoginMode,
  refetch,
  setRefetch,
}) => {
  const [creator, setCreator] = useState<DB_UserTypes>({
    displayName: null,
    email: null,
    uid: "",
    msgRoomIds: [],
  });
  const [loading, setLoading] = useState(false);
  const [editorMode, setEditorMode] = useState(false);
  const [editorValue, setEditorValue] = useState("");
  const [comments, setComments] = useState<DB_COMMENT[]>([]);
  const [postMenuMode, setPostMenuMode] = useState(false);
  const [refetchComments, setRefetchComments] = useState(false);
  const [commentImgUrlList, setCommentImgUrlList] = useState<string[]>([]);

  const handleCommentSubmit = async () => {
    if (editorValue.length <= 11 || !isLoggedIn()) {
      toast.error("최소 11자 이상 입력해야 합니다.");
      return;
    }

    const comment: DB_COMMENT = {
      body: editorValue,
      createdAt: Date.now(),
      postID: id,
      id: uuid(),
      replyComments: [],
      creatorId: authService.currentUser ? authService.currentUser.uid : "",
      imgUrlList: commentImgUrlList,
    };

    try {
      // const postQuery = dbService
      //   .collection("post")
      //   .where("id", "==", comment.postID);
      const postQuery = query(
        collection(dbService, "post"),
        where("id", "==", comment.postID)
      );
      const queryResult = await getDocs(postQuery);

      for (const docRef of queryResult.docs) {
        if (docRef.exists()) {
          await updateDoc(doc(dbService, `post/${docRef.id}`), {
            comments: [...docRef.data().comments, comment.id],
          });
          // await dbService.doc(`post/${doc.id}`).update({
          //   comments: [...doc.data().comments, comment.id],
          // });
        }
      }

      await addDoc(collection(dbService, "comment"), comment);
      // await dbService.collection("comment").add(comment);

      setRefetchComments(true);
      setCommentImgUrlList([]);
      setEditorMode(false);
      setEditorValue("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditorMode = () => {
    if (!isLoggedIn()) {
      setLoginMode(true);
      setEditorMode(false);
    } else {
      setEditorMode(true);
    }
  };

  const loadCreator = async () => {
    setLoading(true);
    if (creatorId) {
      const creator = await getUserFromUid(creatorId);
      if (creator !== null) {
        setCreator(creator);
      }
    }
  };

  const loadComments = async () => {
    const arr: DB_COMMENT[] = [];
    try {
      // const query = dbService.collection("comment").where("postID", "==", id);
      const q = query(
        collection(dbService, "comment"),
        where("postID", "==", id)
      );
      const queryResult = await getDocs(q);

      for (const docRef of queryResult.docs) {
        const data: DB_COMMENT = {
          body: docRef.data().body,
          createdAt: docRef.data().createdAt,
          creatorId: docRef.data().creatorId,
          id: docRef.data().id,
          postID: docRef.data().postID,
          replyComments: docRef.data().replyComments,
          imgUrlList: docRef.data().imgUrlList,
        };
        arr.push(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      arr.sort((a, b) => b.createdAt - a.createdAt);
      setComments([...arr]);
      setLoading(false);
      setRefetchComments(false);
    }
  };

  const deletePostFromGroup = async () => {
    try {
      const groupQueryResult = await getDoc(doc(dbService, `group/${groupId}`));

      if (groupQueryResult.exists()) {
        const originalPosts = groupQueryResult.data()?.posts || [];
        if (Array.isArray(originalPosts)) {
          const afterPosts = originalPosts.filter((elem) => elem !== id);
          await updateDoc(doc(dbService, `group/${groupId}`), {
            posts: afterPosts,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteCommentFromPost = async (commentId: string) => {
    // const query = dbService.collection("comment").where("id", "==", commentId);
    const q = query(
      collection(dbService, "comment"),
      where("id", "==", commentId)
    );
    const queryResult = await getDocs(q);

    for (const docRef of queryResult.docs) {
      if (docRef.exists()) {
        if (docRef.data().imgUrlList) {
          for (const url of docRef.data().imgUrlList) {
            await deleteImgFromFirebase(url);
          }
        }

        await deleteDoc(doc(dbService, `comment/${docRef.id}`));
      }
    }
  };

  const handleDeletePost = async () => {
    console.log("Delete this post!");

    if (creator.uid !== authService.currentUser?.uid) {
      toast.error("해당 게시글을 삭제할 권한이 없습니다.");
      return;
    }

    try {
      // const query = dbService.collection("post").where("id", "==", id);
      const q = query(collection(dbService, "post"), where("id", "==", id));
      const queryResult = await getDocs(q);

      for (const docRef of queryResult.docs) {
        if (docRef.exists()) {
          if (docRef.data().comments) {
            for (const commentId of docRef.data().comments) {
              await deleteCommentFromPost(commentId);
            }
          }

          if (docRef.data().imgUrlList) {
            for (const url of docRef.data().imgUrlList) {
              await deleteImgFromFirebase(url);
            }
          }

          await deleteDoc(doc(dbService, `post/${docRef.id}`));
        }
      }

      await deletePostFromGroup();

      setRefetch(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClickToExitMenu = () => setPostMenuMode(false);

  const handleClickToCancel = async () => {
    try {
      if (commentImgUrlList.length > 0) {
        for (const url of commentImgUrlList) {
          await deleteImgFromFirebase(url);
        }
      }
    } catch (error) {
      console.log(error);
    }
    setEditorMode(false);
    setEditorValue("");
  };

  useEffect(() => {
    loadCreator();
    loadComments();
  }, []);

  useEffect(() => {
    if (postMenuMode) {
      document.body.onclick = handleClickToExitMenu;
    } else {
      document.body.onclick = null;
    }
  }, [postMenuMode]);

  useEffect(() => {
    if (refetchComments) {
      setLoading(true);
      loadComments();
    }
  }, [refetchComments]);

  return (
    <div className="w-full p-5 pb-0 my-5 border border-black">
      {loading ? (
        <div className="w-full">
          <FontAwesomeIcon
            icon={faCircleNotch}
            className="text-center animate-spin text-5xl text-blue-500"
          />
        </div>
      ) : (
        <>
          <header className="flex items-center justify-between">
            <section className="flex items-center">
              <FontAwesomeIcon
                icon={faUserCircle}
                className="text-gray-500 text-5xl"
              />
              <div className="ml-3">
                <h1 className="font-medium text-lg">{creator.email}</h1>
                <h2 className="text-sm">{timeCalc(createdAt)}</h2>
              </div>
            </section>
            <section className="relative">
              <FontAwesomeIcon
                icon={faEllipsisV}
                className="text-gray-500 text-xl cursor-pointer hover:opacity-70 transition-opacity "
                onClick={() => setPostMenuMode(true)}
              />
              {postMenuMode && (
                <div
                  className="absolute top-full mt-1 right-0 py-3 bg-white whitespace-nowrap  w-40"
                  style={{
                    boxShadow:
                      "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)",
                  }}
                >
                  <h1
                    onClick={handleDeletePost}
                    className="p-2 px-5 font-medium cursor-pointer hover:bg-gray-200 transition-colors text-center"
                  >
                    삭제
                  </h1>
                </div>
              )}
            </section>
          </header>
          <main
            className="my-10"
            dangerouslySetInnerHTML={{ __html: body }}
          ></main>
          <aside className="w-full flex items-center justify-between pb-10 border-b border-gray-300">
            <section className="flex items-center">
              <div className="p-1 px-3 border border-gray-500 rounded-sm hover:opacity-70 transition-opacity mr-3">
                <FontAwesomeIcon icon={faThumbsUp} className="mr-2" />
                <span>0</span>
              </div>
              <div className="p-1 px-3 border border-gray-500 rounded-sm hover:opacity-70 transition-opacity">
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                <FontAwesomeIcon icon={faSmile} className="" />
              </div>
            </section>
            <section>
              댓글 <span className="font-medium">{comments.length}</span>개
            </section>
          </aside>
          {/* comments should be here */}
          <footer className="mt-10">
            <section className="flex">
              <div
                style={{ width: "10%" }}
                className={`flex justify-center ${
                  editorMode ? "items-start" : "items-center"
                }`}
              >
                <FontAwesomeIcon
                  icon={faUserCircle}
                  className="text-4xl text-gray-500  "
                />
              </div>
              <div style={{ width: "90%" }} className="border border-gray-500">
                {editorMode ? (
                  <>
                    <Editor
                      value={editorValue}
                      setValue={setEditorValue}
                      imgUrlList={commentImgUrlList}
                      setImgUrlList={setCommentImgUrlList}
                    />
                    <div className="w-full flex items-center justify-end p-5">
                      <button
                        onClick={handleClickToCancel}
                        className="mr-5 px-5 py-2"
                      >
                        취소
                      </button>
                      <button
                        onClick={handleCommentSubmit}
                        className={`${
                          editorValue.length > 11
                            ? "bg-blue-500 hover:opacity-70"
                            : "bg-gray-500 cursor-not-allowed"
                        } text-white px-5 py-2 transition-all `}
                      >
                        게시하기
                      </button>
                    </div>
                  </>
                ) : (
                  <h1
                    onClick={handleEditorMode}
                    className="p-3 py-5 w-full  cursor-pointer hover:shadow-md transition-shadow"
                  >
                    댓글을 입력하세요.
                  </h1>
                )}
              </div>
            </section>
            <section className="mt-5">
              {comments.map((elem, index) => (
                <CampusDetailComment
                  comment={elem}
                  key={index}
                  isLast={index === comments.length - 1}
                  refetch={refetchComments}
                  setRefetch={setRefetchComments}
                />
              ))}
            </section>
          </footer>
        </>
      )}
    </div>
  );
};
