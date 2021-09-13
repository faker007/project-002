import { faTimesCircle, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { CampusDetailPopupTypes } from "../types/CampusDetail.types";
import { DB_POST } from "../types/DBService.types";
import { authService, dbService } from "../utils/firebase";
import { deleteImgFromFirebase, findGroupId, isLoggedIn } from "../utils/utils";
import { Editor } from "./Editor";
import { v4 as uuid } from "uuid";

export const CampusDetailPopup: React.FC<CampusDetailPopupTypes> = ({
  mode,
  setMode,
  group,
  refetch,
  setRefetch,
  groupId,
}) => {
  const [editorValue, setEditorValue] = useState("");
  const [imgUrlList, setImgUrlList] = useState<string[]>([]);
  const submitBtnRef = useRef<any>();
  const MIN_SUBMIT_LENGTH = 11;

  const handleSubmitPost = async () => {
    if (editorValue.length <= MIN_SUBMIT_LENGTH || !isLoggedIn()) {
      return;
    }

    const post: DB_POST = {
      body: editorValue,
      createdAt: Date.now(),
      creatorId: authService.currentUser?.uid,
      comments: [],
      groupId: await findGroupId(group),
      id: uuid(),
      imgUrlList,
    };

    try {
      await dbService.collection("post").add(post);

      const groupRef = await dbService.doc(`group/${groupId}`).get();

      if (groupRef.exists) {
        const postsRef = groupRef.data()?.posts || [];
        await dbService.doc(`group/${groupId}`).update({
          posts: [...postsRef, post.id],
        });
      }

      setRefetch(true);
      setMode(false);
      toast.success("성공적으로 게시물을 게시했습니다.");
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  const handleClickToCancel = async () => {
    try {
      if (imgUrlList.length > 0) {
        for (const url of imgUrlList) {
          await deleteImgFromFirebase(url);
        }
      }
    } catch (error) {
      console.log(error);
    }

    setMode(false);
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      setEditorValue("");
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-screen backdrop-filter backdrop-blur-sm flex justify-center items-center">
      <div
        onClick={() => setMode(false)}
        className="fixed top-0 left-0 w-full h-screen bg-black opacity-60"
      ></div>
      <div
        className="z-10 max-w-screen-sm mx-auto w-full h-3/4 bg-white grid "
        style={{ gridTemplateRows: "0.5fr 3.5fr 1fr" }}
      >
        <section className="w-full flex items-center justify-between p-5">
          <div className="flex items-center">
            <FontAwesomeIcon
              icon={faUserCircle}
              className="text-gray-500 text-5xl mr-3"
            />
            <span className="font-medium">
              {authService.currentUser?.email}
            </span>
          </div>
          <FontAwesomeIcon
            icon={faTimesCircle}
            onClick={() => setMode(false)}
            className="text-4xl hover:text-red-500 transition-colors cursor-pointer text-gray-500"
          />
        </section>
        <section className="w-full h-full overflow-auto">
          <Editor
            value={editorValue}
            setValue={setEditorValue}
            imgUrlList={imgUrlList}
            setImgUrlList={setImgUrlList}
          />
        </section>
        <section className="w-full flex items-center justify-end p-5 mt-10">
          <button onClick={handleClickToCancel} className="px-14 py-2">
            취소
          </button>
          <button
            ref={submitBtnRef}
            onClick={handleSubmitPost}
            className={`px-14 py-2 ${
              editorValue.length > MIN_SUBMIT_LENGTH
                ? "bg-blue-500  cursor-pointer"
                : "bg-gray-500 cursor-not-allowed "
            } text-white font-medium hover:opacity-70 transition-opacity relative`}
          >
            게시
          </button>
        </section>
      </div>
    </div>
  );
};
