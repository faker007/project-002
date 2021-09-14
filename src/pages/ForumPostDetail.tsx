import {
  faCommentAlt,
  faEye,
  faHeart,
} from "@fortawesome/free-regular-svg-icons";
import {
  faBell,
  faChevronRight,
  faCircleNotch,
  faEllipsisV,
  faSearch,
  faShare,
  faTrashAlt,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useState } from "react";
import { useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Editor } from "../components/Editor";
import { DB_COMMENT, DB_UserTypes } from "../types/DBService.types";
import { ForumGroupTypes, ForumPostTypes } from "../types/Forum.types";
import { routes } from "../utils/constants";
import { authService, dbService } from "../utils/firebase";
import {
  deleteImgFromFirebase,
  getFirestoreQuery,
  handleDeleteForumPost,
  isLoggedIn,
  loadGroupIns,
  timeCalc,
} from "../utils/utils";
import { v4 as uuid } from "uuid";
import { ForumPostComment } from "../components/ForumPostComment";
import { PopUpLogin } from "../components/PopUpLogin";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  updateDoc,
} from "@firebase/firestore";

export const ForumPostDetail: React.FC = () => {
  const { forumGroup, postId } = useParams<{
    forumGroup: string;
    postId: string;
  }>();

  const [post, setPost] = useState<ForumPostTypes | null>(null);
  const [group, setGroup] = useState<ForumGroupTypes>();
  const [loading, setLoading] = useState(false);
  const [creator, setCreator] = useState<DB_UserTypes | null>(null);
  const [commentEditorValue, setCommentEditorValue] = useState<string>("");
  const [commentimgList, setCommentimgList] = useState<string[]>([]);
  const [comments, setComments] = useState<DB_COMMENT[]>([]);
  const [refetchComments, setRefetchComments] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginMode, setLoginMode] = useState(false);
  const [commentCreateMode, setCommentCreateMode] = useState(false);
  const commentRef = useRef(null);

  const history = useHistory();

  const loadPostFromId = async () => {
    try {
      const q = getFirestoreQuery("forumPost", "id", postId);
      const result = await getDocs(q);

      for (const doc of result.docs) {
        if (doc.exists()) {
          setPost({
            body: doc.data().body,
            comments: doc.data().comments,
            createdAt: doc.data().createdAt,
            creatorId: doc.data().creatorId,
            forumGroupId: doc.data().forumGroupId,
            id: doc.data().id,
            title: doc.data().title,
            views: doc.data().views,
            imgUrlList: doc.data().imgUrlList,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchGroupInstance = async () => {
    const groupIns = await loadGroupIns(forumGroup);
    if (groupIns) {
      setGroup(groupIns);
    }
  };

  const loadCreator = async (creatorId: string) => {
    try {
      const q = getFirestoreQuery("user", "uid", creatorId);
      const result = await getDocs(q);

      for (const doc of result.docs) {
        if (doc.exists()) {
          setCreator({
            displayName: doc.data().displayName,
            email: doc.data().email,
            uid: doc.data().uid,
            msgRoomIds: doc.data().msgRoomIds,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const loadComments = async () => {
    if (post) {
      try {
        const q = getFirestoreQuery("forumComment", "postID", post.id);
        const result = await getDocs(q);

        const arr: DB_COMMENT[] = [];
        for (const doc of result.docs) {
          if (doc.exists()) {
            arr.push({
              body: doc.data().body,
              replyComments: doc.data().replyComments,
              postID: doc.data().postID,
              imgUrlList: doc.data().imgUrlList,
              creatorId: doc.data().creatorId,
              createdAt: doc.data().createdAt,
              id: doc.data().id,
            });
          }
        }

        setComments([...arr].sort((a, b) => b.createdAt - a.createdAt));
      } catch (error) {
        console.log(error);
      }
    }

    setRefetchComments(false);
    setLoading(false);
  };

  const handleClickToCreateComment = async () => {
    if (!isLoggedIn()) {
      setLoginMode(true);
      return;
    }

    if (commentEditorValue.length <= 11) {
      toast.error("댓글은 최소 11자 이상 되어야 합니다.");
      return;
    }

    if (post && authService.currentUser) {
      const comment: DB_COMMENT = {
        body: commentEditorValue,
        createdAt: Date.now(),
        creatorId: authService.currentUser.uid,
        id: uuid(),
        imgUrlList: commentimgList,
        postID: post.id,
        replyComments: [],
      };

      try {
        await addDoc(collection(dbService, "forumComment"), comment);

        const postQ = getFirestoreQuery("forumPost", "id", post.id);
        const postResult = await getDocs(postQ);

        for (const docRef of postResult.docs) {
          if (docRef.exists()) {
            await updateDoc(doc(dbService, `forumPost/${docRef.id}`), {
              comments: [...docRef.data().comments, comment.id],
            });
          }
        }
      } catch (error) {
        console.log(error);
      }

      setCommentEditorValue("");
      setRefetchComments(true);
    } else {
      toast.error("댓글을 작성하는데 문제가 발생했습니다.");
    }
  };

  const handleClickToCancelCreateComment = async () => {
    setCommentEditorValue("");
    try {
      for (const url of commentimgList) {
        await deleteImgFromFirebase(url);
      }
    } catch (error) {
      console.log(error);
    }

    setCommentimgList([]);
    setCommentCreateMode(false);
  };

  const handleDeletePost = async () => {
    if (!isLoggedIn()) {
      setLoginMode(true);
      return;
    }

    try {
      if (post) {
        const ok = await handleDeleteForumPost(post);
        if (ok) {
          history.push(routes.forumDetail(forumGroup));
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const increaseViews = async () => {
    try {
      const q = getFirestoreQuery("forumPost", "id", postId);
      const result = await getDocs(q);

      for (const docRef of result.docs) {
        if (docRef.exists()) {
          await updateDoc(doc(dbService, `forumPost/${docRef.id}`), {
            views: +docRef.get("views") + 1,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClickToVerifyCreateComment = () => {
    if (!isLoggedIn()) {
      setLoginMode(true);
      return;
    }

    setCommentCreateMode(true);
  };

  useEffect(() => {
    setLoading(true);
    setCommentEditorValue("");
    increaseViews();
    fetchGroupInstance();
    loadPostFromId();
  }, []);

  useEffect(() => {
    if (refetchComments) {
      setLoading(true);
      loadComments();
    }
  }, [refetchComments]);

  useEffect(() => {
    if (post !== null) {
      loadCreator(post.creatorId);
      loadComments();
    }
  }, [post]);

  useEffect(() => {
    if (menuOpen) {
      document.body.onclick = () => {
        setMenuOpen(false);
      };
    } else {
      document.body.onclick = null;
    }
  }, [menuOpen]);

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
          <header className="w-full flex items-center justify-between mb-5 border-b border-gray-300 pb-5">
            <div className="flex items-center">
              <Link to={routes.forum} className="hover:underline">
                게시판
              </Link>
              <FontAwesomeIcon icon={faChevronRight} className="mx-5" />
              <Link
                className="hover:underline"
                to={routes.forumDetail(forumGroup)}
              >
                {group?.korName}
              </Link>
              <FontAwesomeIcon icon={faChevronRight} className="mx-5" />
              <h1>{post?.title}</h1>
            </div>
          </header>
          {post && creator && (
            <div className="mt-5 flex">
              <div className="w-3/4">
                <section className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FontAwesomeIcon
                      icon={faUserCircle}
                      className="text-gray-500 text-2xl mr-3"
                    />
                    <span className="text-sm">{creator.email}</span>
                  </div>
                  <div className="flex items-center relative">
                    <span className="mr-3 text-sm">
                      {post && timeCalc(post.createdAt)}
                    </span>
                    <FontAwesomeIcon
                      onClick={() => setMenuOpen(true)}
                      icon={faEllipsisV}
                      className="text-gray-500 cursor-pointer text-lg hover:opacity-70 transition-all"
                    />
                    {menuOpen && (
                      <div
                        className="absolute top-full right-0 w-48  p-5  bg-white"
                        style={{
                          boxShadow:
                            "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)",
                        }}
                      >
                        <div
                          onClick={handleDeletePost}
                          className="w-full hover:text-blue-500 transition-all cursor-pointer"
                        >
                          <FontAwesomeIcon className="mr-5" icon={faTrashAlt} />
                          <span>삭제</span>
                        </div>
                      </div>
                    )}
                  </div>
                </section>
                <section className="mt-5 ">
                  <h1 className="text-4xl font-medium">{post.title}</h1>
                </section>
                <section
                  className="my-10"
                  dangerouslySetInnerHTML={{ __html: post.body }}
                ></section>
                <section className="flex items-center justify-between pt-5">
                  <div className="flex">
                    <div className="mr-5">
                      <FontAwesomeIcon className="mr-2" icon={faCommentAlt} />
                      <span>댓글</span>
                    </div>
                  </div>
                </section>
                <footer ref={commentRef} className="mt-10">
                  <div>
                    {comments.map((elem, index) => (
                      <ForumPostComment
                        setLoginMode={setLoginMode}
                        comment={elem}
                        key={index}
                        setRefetch={setRefetchComments}
                      />
                    ))}
                  </div>
                  {commentCreateMode ? (
                    <div className="border border-gray-300 p-5 mt-5">
                      <section className="p-5 pt-3 flex items-center border-b border-gray-300">
                        <FontAwesomeIcon
                          icon={faUserCircle}
                          className="text-gray-500 text-3xl mr-3"
                        />
                        <span className="font-medium">
                          {authService.currentUser?.email}
                        </span>
                      </section>
                      <Editor
                        value={commentEditorValue}
                        setValue={setCommentEditorValue}
                        imgUrlList={commentimgList}
                        setImgUrlList={setCommentimgList}
                      />
                      <section className="flex items-center justify-end">
                        <button
                          onClick={handleClickToCancelCreateComment}
                          className="mr-5 px-10 py-3 hover:opacity-60 transition-all"
                        >
                          취소
                        </button>
                        <button
                          onClick={handleClickToCreateComment}
                          className={`px-14 py-2 ${
                            commentEditorValue.length <= 11
                              ? "bg-gray-500 cursor-not-allowed"
                              : "bg-blue-800"
                          } text-white hover:opacity-60 transition-all`}
                        >
                          게시
                        </button>
                      </section>
                    </div>
                  ) : (
                    <div
                      onClick={handleClickToVerifyCreateComment}
                      className="border border-gray-300 p-5 mt-5 flex items-center cursor-pointer hover:border-black transition-all font-medium"
                    >
                      <FontAwesomeIcon
                        icon={faUserCircle}
                        className="text-gray-500 text-3xl mr-3"
                      />
                      <span>댓글을 입력해 주세요.</span>
                    </div>
                  )}
                </footer>
              </div>
              <div className="w-1/4 p-5 pt-0 px-6 flex flex-col items-center">
                <div className="sticky top-4 w-full">
                  <section className="mb-5 flex flex-col w-full">
                    <button
                      onClick={() => {
                        if (commentRef.current !== null) {
                          // @ts-ignore
                          commentRef.current.scrollIntoView();
                        }
                      }}
                      className="hover:opacity-70  transition-all w-full text-center bg-blue-800 text-white mb-3 py-2"
                    >
                      댓글
                    </button>
                    <button className="hover:opacity-70 transition-all w-full border border-blue-800 py-2">
                      <FontAwesomeIcon
                        className="text-blue-800 text-xl mr-3"
                        icon={faBell}
                      />
                      <span className="text-blue-800">게시물 팔로우</span>
                    </button>
                  </section>
                  <section className="w-full border border-gray-300 p-5">
                    <div className="mb-5">
                      <FontAwesomeIcon icon={faEye} className="text-xl mr-3" />
                      <span>조회수 {post.views}회</span>
                    </div>
                    <div>
                      <FontAwesomeIcon
                        icon={faCommentAlt}
                        className="text-xl mr-3"
                      />
                      <span>댓글 {post.comments.length}개</span>
                    </div>
                  </section>
                  <section className="mt-5 p-5 w-full border border-gray-300">
                    <h1 className="mb-3">유사 게시물</h1>
                  </section>
                  <section className="mt-5 p-5 w-full border border-gray-300">
                    <h1 className="mb-3 font-medium">카테고리</h1>
                    <ul>
                      {/* <li className="mb-3 text-sm hover:text-blue-800 transition-all">
                        <Link to={routes.forumDetail("jayugesipan")}>
                          자유게시판
                        </Link>
                      </li>
                      <li className="mb-3 text-sm hover:text-blue-800 transition-all">
                        <Link to={routes.forumDetail("mentoring-cunceon")}>
                          멘토링 (춘천)
                        </Link>
                      </li>
                      <li className="mb-3 text-sm hover:text-blue-800 transition-all">
                        <Link to={routes.forumDetail("gwating-cunceon")}>
                          과팅 (춘천)
                        </Link>
                      </li>
                      <li className="mb-3 text-sm hover:text-blue-800 transition-all">
                        <Link to={routes.forumDetail("miting-cunceon")}>
                          미팅 (춘천)
                        </Link>
                      </li>
                      <li className="mb-3 text-sm hover:text-blue-800 transition-all">
                        <Link to={routes.forumDetail("somoim-cunceon")}>
                          소모임 (춘천)
                        </Link>
                      </li> */}
                      <li className="mb-3 text-sm hover:text-blue-800 transition-all">
                        <Link to={routes.forum}>전체 카테고리 보기</Link>
                      </li>
                    </ul>
                  </section>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      {loginMode && (
        <PopUpLogin
          popUpLoginMode={loginMode}
          setPopUpLoginMode={setLoginMode}
        />
      )}
    </div>
  );
};
