import { faCommentAlt, faEye } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { DB_ForumGroup } from "../types/DBService.types";
import { routes } from "../utils/constants";

export const ForumGroup: React.FC<DB_ForumGroup> = ({
  enName,
  korName,
  posts,
  views,
}) => {
  return (
    <div
      className={`p-5 ${
        korName !== "자유게시판" && "py-10"
      }  flex items-center  w-full border border-gray-300 mb-5`}
    >
      <section className="flex items-center" style={{ width: "60%" }}>
        {korName === "자유게시판" && (
          <Link to={routes.forumDetail(enName)} className="mr-5">
            <img
              src={
                "https://firebasestorage.googleapis.com/v0/b/campus-mate-c41f8.appspot.com/o/freedomCommunity.webp?alt=media&token=65377509-479b-42c4-8293-b015133936a0"
              }
            />
          </Link>
        )}
        <div>
          <Link
            to={routes.forumDetail(enName)}
            className="text-xl font-medium hover:text-blue-500 transition-all"
          >
            {korName}
          </Link>
          {korName === "자유게시판" && (
            <h2 className="text-sm">게시글을 새로 작성하거나 편집해보세요.</h2>
          )}
        </div>
      </section>
      <section className="flex items-center" style={{ width: "30%" }}>
        <div className="mr-10">
          <FontAwesomeIcon icon={faEye} className="mr-2" />
          <span className="font-medium">{views}</span>
        </div>
        <div>
          <FontAwesomeIcon icon={faCommentAlt} className="mr-2" />
          <span className="font-medium">{posts.length}</span>
        </div>
      </section>
      <section style={{ width: "10%" }}>
        <h1 className="cursor-pointer hover:opacity-60 transition-opacity">
          팔로우
        </h1>
      </section>
    </div>
  );
};
