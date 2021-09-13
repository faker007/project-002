import { faHeart, faShareSquare } from "@fortawesome/free-regular-svg-icons";
import {
  faCircleNotch,
  faEllipsisV,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { CampusDetailCommentTypes } from "../types/CampusDetail.types";
import { DB_UserTypes } from "../types/DBService.types";
import { authService, dbService } from "../utils/firebase";
import {
  deleteImgFromFirebase,
  getUserFromUid,
  isLoggedIn,
  timeCalc,
} from "../utils/utils";

export const CampusDetailComment: React.FC<CampusDetailCommentTypes> = ({
  comment: { postID, replyComments, createdAt, body, creatorId, id },
  isLast,
  refetch,
  setRefetch,
}) => {
  const [loading, setLoading] = useState(false);
  const [creator, setCreator] = useState<DB_UserTypes | null>(null);
  const [commentMenuMode, setCommentMenuMode] = useState(false);

  const loadCreator = async () => {
    setLoading(true);
    try {
      const creator = await getUserFromUid(creatorId);
      if (creator !== null) {
        setCreator(creator);
      }
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  const deleteCommentIdFromPost = async () => {
    try {
      const commentQuery = dbService
        .collection("post")
        .where("id", "==", postID);
      const commentQueryResult = await commentQuery.get();

      for (const doc of commentQueryResult.docs) {
        if (doc.exists) {
          const dbComments = doc.data().comments;
          if (Array.isArray(dbComments) && dbComments.length > 0) {
            const restOfDBComments = dbComments.filter((elem) => elem !== id);
            await dbService.doc(`post/${doc.id}`).update({
              comments: [...restOfDBComments],
            });
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteComment = async () => {
    if (!isLoggedIn()) {
      toast.error("해당 댓글을 지울 권한이 없습니다.");
      return;
    }

    if (authService.currentUser?.uid !== creatorId) {
      toast.error("해당 댓글을 지울 권한이 없습니다.");
      return;
    }
    try {
      const query = dbService.collection("comment").where("id", "==", id);
      const queryResult = await query.get();

      for (const doc of queryResult.docs) {
        if (doc.exists) {
          await deleteCommentIdFromPost();

          if (doc.data().imgUrlList) {
            for (const url of doc.data().imgUrlList) {
              await deleteImgFromFirebase(url);
            }
          }

          await dbService.doc(`comment/${doc.id}`).delete();
          setRefetch(true);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClickToExitMenu = () => setCommentMenuMode(false);

  useEffect(() => {
    loadCreator();
  }, []);

  useEffect(() => {
    if (commentMenuMode) {
      document.body.onclick = handleClickToExitMenu;
    } else {
      document.body.onclick = null;
    }
  }, [commentMenuMode]);

  return (
    <div className={`w-full flex ${isLast ? "my-0" : "my-5"}`}>
      {loading ? (
        <FontAwesomeIcon
          icon={faCircleNotch}
          className="text-3xl animate-spin text-blue-500"
        />
      ) : (
        <>
          <div
            style={{ width: "10%" }}
            className="flex justify-center items-start"
          >
            <FontAwesomeIcon
              icon={faUserCircle}
              className="text-gray-500 text-3xl"
            />
          </div>
          <div
            style={{ width: "90%" }}
            className={`pb-5 ${
              isLast ? "border-b-0" : "border-b"
            } border-black`}
          >
            <section className="w-full  flex items-center justify-between">
              <div>
                <h1 className="font-medium">{creator?.email}</h1>
                <h2 className="text-sm">{timeCalc(createdAt)}</h2>
              </div>
              <div className="relative">
                <FontAwesomeIcon
                  onClick={() => setCommentMenuMode(true)}
                  icon={faEllipsisV}
                  className="text-lg cursor-pointer text-gray-500"
                />
                {commentMenuMode && (
                  <div
                    className="absolute top-full mt-1 right-0 py-3 bg-white whitespace-nowrap  w-40"
                    style={{
                      boxShadow:
                        "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)",
                    }}
                  >
                    <h1
                      onClick={handleDeleteComment}
                      className="p-2 px-5 font-medium cursor-pointer hover:bg-gray-200 transition-colors text-center"
                    >
                      삭제
                    </h1>
                  </div>
                )}
              </div>
            </section>
            <main
              dangerouslySetInnerHTML={{ __html: body }}
              className="py-5 font-medium"
            ></main>
            <aside className="flex">
              <div className="cursor-pointer hover:opacity-70 transition-all">
                <FontAwesomeIcon icon={faHeart} className="mr-2 text-red-500" />
                <span>좋아요</span>
              </div>
              <div className="ml-5 cursor-pointer hover:opacity-70 transition-all">
                <FontAwesomeIcon icon={faShareSquare} className="mr-2" />
                <span>답글</span>
              </div>
            </aside>
          </div>
        </>
      )}
    </div>
  );
};
