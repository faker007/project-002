import {
  faChevronRight,
  faCircleNotch,
  faEllipsisV,
  faSearch,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Editor } from "../components/Editor";
import { ForumGroupTypes, ForumPostTypes } from "../types/Forum.types";
import { routes } from "../utils/constants";
import { authService, dbService } from "../utils/firebase";
import {
  deleteImgFromFirebase,
  findForumGroupId,
  isLoggedIn,
  loadGroupIns,
} from "../utils/utils";
import { v4 as uuid } from "uuid";

export const ForumCreatePost: React.FC = () => {
  const { forumGroup } = useParams<{ forumGroup: string }>();
  const [group, setGroup] = useState<ForumGroupTypes>();
  const [loading, setLoading] = useState(false);
  const [postTitle, setPostTitle] = useState<string>("");
  const [editorValue, setEditorValue] = useState<string>("");
  const [editorImgList, setEditorImgList] = useState<string[]>([]);
  const history = useHistory();

  const fetchGroupInstance = async () => {
    const groupIns = await loadGroupIns(forumGroup);
    console.log(groupIns);
    if (groupIns) {
      setGroup(groupIns);
    }

    setLoading(false);
  };

  const handleCreatePost = async () => {
    if (!isLoggedIn()) {
      toast.error("포스트를 작성하기 위해선 로그인 해야합니다.");
      return;
    }

    if (postTitle === "") {
      toast.error("제목은 필수사항 입니다.");
      return;
    }

    if (editorValue.length <= 11) {
      toast.error("포스트 내용은 최소 11자부터 입니다.");
      return;
    }

    const post: ForumPostTypes = {
      body: editorValue,
      comments: [],
      createdAt: Date.now(),
      creatorId: authService.currentUser?.uid || "",
      forumGroupId: await findForumGroupId(forumGroup),
      id: uuid(),
      views: 0,
      title: postTitle,
      imgUrlList: editorImgList,
    };

    try {
      await dbService.collection("forumPost").add(post);

      const forumGroupId = await findForumGroupId(forumGroup);
      const forumGroupQuery = dbService.doc(`forumGroup/${forumGroupId}`);
      const forumGroupResult = await forumGroupQuery.get();

      if (forumGroupResult.exists) {
        await forumGroupQuery.update({
          posts: [post.id, ...forumGroupResult.data()?.posts],
        });
      }

      history.push(routes.forumPostDetail(forumGroup, post.id));
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangePostTitle = (e: any) => {
    const {
      target: { value },
    } = e;
    setPostTitle(value);
  };

  const handleClickToCancelCreatePost = async () => {
    for (const url of editorImgList) {
      await deleteImgFromFirebase(url);
    }
  };

  useEffect(() => {
    setLoading(true);
    setEditorValue("");
    fetchGroupInstance();
  }, []);

  return (
    <div className="max-w-screen-lg mx-auto">
      {loading ? (
        <div className="text-center">
          <FontAwesomeIcon
            icon={faCircleNotch}
            className="text-5xl text-blue-500 animate-spin"
          />
        </div>
      ) : (
        <>
          <header className="w-full flex items-center justify-between mb-5">
            <div className="flex items-center">
              <Link to={routes.forum} className="hover:underline">
                게시판
              </Link>
              <FontAwesomeIcon icon={faChevronRight} className="mx-5" />
              <Link
                to={routes.forumDetail(forumGroup)}
                className="hover:underline"
              >
                {group?.korName}
              </Link>
              <FontAwesomeIcon icon={faChevronRight} className="mx-5" />
              <h1>게시물 작성</h1>
            </div>
            <div className="w-1/4 flex items-center ">
              <div className="border-b border-black w-5/6">
                <FontAwesomeIcon
                  className="text-xl text-gray-500 mb-1"
                  icon={faSearch}
                />
              </div>
              <div className="w-1/6 flex justify-center items-center">
                <FontAwesomeIcon
                  icon={faEllipsisV}
                  className="text-xl text-gray-500"
                />
              </div>
            </div>
          </header>
          <main
            className="border border-gray-300 px-10"
            style={{ minHeight: "24rem" }}
          >
            <section className="flex w-full items-center  py-5 pt-10">
              <FontAwesomeIcon
                icon={faUserCircle}
                className="text-gray-500 text-3xl mr-3"
              />
              <h1 className="font-medium">{authService.currentUser?.email}</h1>
            </section>
            <section>
              <input
                className="w-full text-4xl py-5 pb-10 outline-none font-medium"
                type="text"
                placeholder="+ 제목"
                required
                maxLength={140}
                onChange={handleChangePostTitle}
              />
              <Editor
                value={editorValue}
                setValue={setEditorValue}
                imgUrlList={editorImgList}
                setImgUrlList={setEditorImgList}
              />
            </section>
          </main>
          <aside className="flex items-center justify-end mt-5 pb-20">
            <Link
              onClick={handleClickToCancelCreatePost}
              to={routes.forumDetail(forumGroup)}
              className="mr-5 p-3 px-14  border border-blue-800 hover:opacity-60 transition-all text-blue-800"
            >
              취소
            </Link>
            <button
              onClick={handleCreatePost}
              className="p-3 px-14 bg-blue-800 text-white hover:opacity-60 transition-all"
            >
              게시
            </button>
          </aside>
        </>
      )}
    </div>
  );
};
