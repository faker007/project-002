import {
  faCommentAlt,
  faEye,
  faHeart,
  faQuestionCircle,
} from "@fortawesome/free-regular-svg-icons";
import {
  faChevronDown,
  faChevronRight,
  faChevronUp,
  faCircleNotch,
  faEllipsisV,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ForumDetailPost } from "../components/ForumDetailPost";
import { ForumGroupTypes, ForumPostTypes } from "../types/Forum.types";
import { routes } from "../utils/constants";
import { dbService } from "../utils/firebase";
import { findForumGroupId, isLoggedIn, loadGroupIns } from "../utils/utils";
import { useHistory } from "react-router-dom";
import { PopUpLogin } from "../components/PopUpLogin";

export const ForumDetail: React.FC = () => {
  const { forumGroup } = useParams<{ forumGroup: string }>();
  const [posts, setPosts] = useState<ForumPostTypes[]>([]);
  const [group, setGroup] = useState<ForumGroupTypes | null>(null);
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(true);
  const [refetchPosts, setRefetchPosts] = useState(false);
  const [loginMode, setLoginMode] = useState(false);
  const history = useHistory();

  const loadForumGroupPosts = async () => {
    if (group) {
      try {
        const arr: ForumPostTypes[] = [];

        const query = dbService
          .collection("forumPost")
          .where("forumGroupId", "==", await findForumGroupId(forumGroup));
        const result = await query.get();

        for (const doc of result.docs) {
          if (doc.exists) {
            const elem: ForumPostTypes = {
              body: doc.data().body,
              comments: doc.data().comments,
              createdAt: doc.data().createdAt,
              creatorId: doc.data().creatorId,
              forumGroupId: doc.data().forumGroupId,
              id: doc.data().id,
              views: doc.data().views,
              title: doc.data().title,
              imgUrlList: doc.data().imgUrlList,
            };

            arr.push(elem);
          }
        }
        arr.sort((a, b) => b.createdAt - a.createdAt);

        console.log(`arr: `, arr);

        setPosts([...arr]);
      } catch (error) {
        console.log(error);
      }
    }

    setRefetchPosts(false);
    setLoading(false);
  };

  const fetchGroupInstance = async () => {
    const groupIns = await loadGroupIns(forumGroup);
    if (groupIns) {
      setGroup(groupIns);
    }
  };

  const handleClickToCreatePost = () => {
    if (!isLoggedIn()) {
      setLoginMode(true);
    } else {
      history.push(routes.forumCreatePost(forumGroup));
    }
  };

  const increaseViews = async () => {
    try {
      const query = dbService
        .collection("forumGroup")
        .where("enName", "==", forumGroup);
      const result = await query.get();

      for (const doc of result.docs) {
        if (doc.exists) {
          await dbService.doc(`forumGroup/${doc.id}`).update({
            views: +doc.get("views") + 1,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setMenuOpen(false);
    setLoading(true);
    increaseViews();
    fetchGroupInstance();
  }, []);

  useEffect(() => {
    if (group !== null) {
      loadForumGroupPosts();
    }
  }, [group]);

  useEffect(() => {
    if (menuOpen) {
      document.body.onclick = () => setMenuOpen(false);
    } else {
      document.body.onclick = null;
    }
  }, [menuOpen]);

  useEffect(() => {
    if (refetchPosts) {
      setLoading(true);
      loadForumGroupPosts();
    }
  }, [refetchPosts]);

  return (
    <main className="max-w-screen-lg mx-auto">
      {loading ? (
        <div className="text-center">
          <FontAwesomeIcon
            icon={faCircleNotch}
            className="text-5xl animate-spin text-blue-500"
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
              <h1>{group?.korName}</h1>
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
          {forumGroup === "jayugesipan" && (
            <section
              className="w-full h-80 bg-cover bg-center relative flex justify-center items-center"
              style={{
                backgroundImage: `url("https://firebasestorage.googleapis.com/v0/b/campus-mate-c41f8.appspot.com/o/jagebig.webp?alt=media&token=7c90f12c-7ee8-4b73-a998-b056bfd5c8ca")`,
              }}
            >
              <div className="absolute top-0 left-0 w-full h-full bg-black opacity-30 "></div>
              <h1 className="z-10 text-white text-xl">
                게시글을 새로 작성하거나 편집해보세요.
              </h1>
            </section>
          )}
          {posts.length > 0 ? (
            <section className="border border-gray-300 mt-20">
              <div className="flex items-center justify-between p-3 border-b border-gray-300">
                <div className="flex items-center">
                  <h1 className="text-gray-500">정렬:</h1>
                  <h1 className="mx-1">최근 활동</h1>
                  <FontAwesomeIcon
                    className="ml-2 text-gray-500"
                    icon={faChevronDown}
                  />
                </div>
                <button
                  onClick={() => setMenuOpen(true)}
                  className="px-10 py-3 bg-blue-800 text-white flex items-center relative"
                >
                  <span>게시물 작성하기</span>
                  {menuOpen ? (
                    <FontAwesomeIcon
                      icon={faChevronUp}
                      className="ml-3 text-gray-300"
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      className="ml-3 text-gray-300"
                    />
                  )}

                  {menuOpen && (
                    <div
                      style={{
                        boxShadow:
                          "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)",
                      }}
                      className="z-10 absolute top-full right-0  w-80 bg-white text-black"
                    >
                      <section
                        onClick={handleClickToCreatePost}
                        className="flex border-b border-gray-300 bg-white p-5 py-8  hover:text-blue-500 transition-all"
                      >
                        <div
                          className="flex justify-center items-start mr-3 "
                          style={{ width: "10%" }}
                        >
                          <FontAwesomeIcon
                            className="mt-2"
                            icon={faCommentAlt}
                          />
                        </div>
                        <div
                          className="flex flex-col justify-start items-start"
                          style={{ width: "90%" }}
                        >
                          <h1 className="font-medium mb-2">그룹 대화</h1>
                          <h2>다른 회원들과 대화를 나눠보세요.</h2>
                        </div>
                      </section>
                      <section
                        onClick={handleClickToCreatePost}
                        className="flex p-5 py-8 hover:text-blue-500 bg-white transition-all"
                      >
                        <div
                          className="flex justify-center items-start mr-3"
                          style={{ width: "10%" }}
                        >
                          <FontAwesomeIcon
                            className="mt-2"
                            icon={faQuestionCircle}
                          />
                        </div>
                        <div
                          className="flex flex-col justify-start items-start"
                          style={{ width: "90%" }}
                        >
                          <h1 className="font-medium">문의 게시물</h1>
                          <h2>직접 커뮤니티 답변을 받아보세요.</h2>
                        </div>
                      </section>
                    </div>
                  )}
                </button>
              </div>
              <div
                className="grid py-3 border-b border-gray-300"
                style={{ gridTemplateColumns: "3fr 1fr 1fr" }}
              >
                <section></section>
                <section className="flex justify-between items-center ">
                  <FontAwesomeIcon className="mr-5" icon={faCommentAlt} />
                  <FontAwesomeIcon className="mr-5" icon={faHeart} />
                  <FontAwesomeIcon className="mr-5" icon={faEye} />
                </section>
                <section className="ml-5 flex items-center justify-start ">
                  <h1 className="">최근 활동</h1>
                </section>
              </div>
              <div>
                {posts.map((elem, index) => (
                  <ForumDetailPost
                    setLoginMode={setLoginMode}
                    post={elem}
                    key={index}
                    forumGroup={forumGroup}
                    setRefetch={setRefetchPosts}
                  />
                ))}
              </div>
            </section>
          ) : (
            <section className="flex flex-col justify-center items-center w-full border border-black mt-20 py-20">
              <h1 className="text-4xl font-medium ">
                게시물을 작성하시겠습니까?
              </h1>
              <h2 className="mt-5 text-lg">
                첫 카테고리 게시물을 작성해보세요.
              </h2>
              <section className="flex mt-14">
                <section
                  onClick={handleClickToCreatePost}
                  className="flex items-start p-5 border border-black hover:text-blue-500 cursor-pointer transition-all"
                >
                  <FontAwesomeIcon icon={faCommentAlt} className="mr-3 mt-2" />
                  <div>
                    <h1 className="text-lg font-medium">그룹 대화</h1>
                    <h2 className="mt-2">다른 회원들과 대화를 나눠보세요.</h2>
                  </div>
                </section>
                <section
                  onClick={handleClickToCreatePost}
                  className="flex p-5 border-t border-b border-r border-black hover:text-blue-500 cursor-pointer transition-all"
                >
                  <FontAwesomeIcon
                    icon={faQuestionCircle}
                    className="mr-3 mt-2"
                  />
                  <div>
                    <h1 className="text-lg font-medium">문의 게시물</h1>
                    <h2 className="mt-2">직접 커뮤니티 답변을 받아보세요.</h2>
                  </div>
                </section>
              </section>
            </section>
          )}
        </>
      )}
      {loginMode && (
        <PopUpLogin
          popUpLoginMode={loginMode}
          setPopUpLoginMode={setLoginMode}
        />
      )}
    </main>
  );
};
