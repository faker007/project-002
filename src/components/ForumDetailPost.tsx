import {
  faEllipsisV,
  faTrash,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { DB_UserTypes } from "../types/DBService.types";
import { ForumDetailPostTypes } from "../types/Forum.types";
import { routes } from "../utils/constants";
import {
  getUserFromUid,
  handleDeleteForumPost,
  isLoggedIn,
  timeCalc,
} from "../utils/utils";

export const ForumDetailPost: React.FC<ForumDetailPostTypes> = ({
  post,
  post: { title, views, id, forumGroupId, creatorId, comments, createdAt },
  forumGroup,
  setRefetch,
  setLoginMode,
}) => {
  const [creator, setCreator] = useState<DB_UserTypes | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const loadCreator = async () => {
    const creator = await getUserFromUid(creatorId);
    if (creator !== null) {
      setCreator(creator);
    }
  };

  const handleDeletePost = async () => {
    if (!isLoggedIn()) {
      setLoginMode(true);
    }

    try {
      await handleDeleteForumPost(post);
      setRefetch(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadCreator();
  }, []);

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
    <div
      className="grid border-b border-gray-300 py-3 mx-5"
      style={{ gridTemplateColumns: "3fr 0.5fr 1fr" }}
    >
      <section>
        <Link
          to={routes.forumPostDetail(forumGroup, id)}
          className="text-lg font-medium hover:text-blue-500 transition-all cursor-pointer"
        >
          {title}
        </Link>
        <h2 className="text-sm hover:text-blue-500 transition-all">
          {creator?.email}
        </h2>
      </section>
      <section className="flex items-center justify-between">
        <span className="mr-3">{comments.length}</span>
        <span className="mr-3">{views}</span>
      </section>
      <section className="ml-8 flex justify-between items-center relative">
        <FontAwesomeIcon
          icon={faUserCircle}
          className="text-gray-500 text-2xl"
        />
        <span className="text-sm">{timeCalc(createdAt)}</span>
        <FontAwesomeIcon
          onClick={() => setMenuOpen(true)}
          icon={faEllipsisV}
          className="text-gray-500  cursor-pointer"
        />
        {menuOpen && (
          <div
            style={{
              boxShadow:
                "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)",
            }}
            className="z-10 absolute top-full right-0 w-40 p-5 bg-white"
          >
            <div
              onClick={handleDeletePost}
              className="hover:text-blue-800 transition-all cursor-pointer hover:opacity-70"
            >
              <FontAwesomeIcon className="mr-5" icon={faTrash} />
              <span>삭제</span>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
