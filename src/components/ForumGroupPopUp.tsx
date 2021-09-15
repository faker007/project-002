import { faTimesCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { ForumGroupPopUpTypes } from "../types/Forum.types";
import { routes } from "../utils/constants";

export const ForumGroupPopUp: React.FC<ForumGroupPopUpTypes> = ({
  setMenuOpen,
  forumGroup,
}) => {
  return (
    <div className="z-10 fixed top-0 left-0 w-full h-screen backdrop-filter backdrop-blur-sm flex justify-center items-center">
      <div
        onClick={() => setMenuOpen(false)}
        className="fixed top-0 left-0 w-full h-screen bg-black opacity-50 z-0"
      ></div>
      <div className="max-w-screen-md bg-white w-full p-10  z-10">
        <div className="flex items-center justify-end">
          <FontAwesomeIcon
            onClick={() => setMenuOpen(false)}
            icon={faTimesCircle}
            className="text-4xl hover:text-red-500 transition-all cursor-pointer"
          />
        </div>
        <h1 className="mb-10 text-3xl font-medium text-center">
          카테고리 선택
        </h1>
        <div className="grid grid-cols-4 gap-5  ">
          {forumGroup.map((elem, index) => (
            <Link
              className="border  border-gray-300 p-3 text-center hover:text-blue-800 transition-all ring-2 ring-gray-400 font-medium hover:opacity-60"
              key={index}
              to={routes.forumCreatePost(elem.enName)}
            >
              {elem.korName}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
