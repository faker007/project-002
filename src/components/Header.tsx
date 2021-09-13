import {
  faBell,
  faChevronDown,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { HeaderTypes } from "../types/Header.types";
import { routes } from "../utils/constants";
import { authService } from "../utils/firebase";
import { getMinimizedStr } from "../utils/utils";
import { FaceBookLogo, LinkLogo, TwitterLogo } from "./SocialComponents";

export const Header: React.FC<HeaderTypes> = ({
  loginModeType: { loginMode, setLoginMode },
  userObj,
}) => {
  const [openMenu, setOpenMenu] = useState(false);

  const handleLoginMode = () => {
    if (loginMode) {
      return;
    }
    setLoginMode(true);
  };

  const handleDropDownMenuOpen = () => {
    console.log("drop down");
    setOpenMenu((prev) => !prev);
  };

  const handleLogOut = async () => {
    console.log("logout!");
    try {
      await authService.signOut();
      toast("성공적으로 로그아웃 했습니다.");
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  return (
    <div className="w-full py-12 pb-20 px-24">
      {/* 헤더 위쪽 로그인 파트 */}
      <div className="w-full  pb-3 border-b border-black flex items-center justify-end">
        <div
          className="flex items-center cursor-pointer"
          onClick={
            userObj.uid !== "" ? handleDropDownMenuOpen : handleLoginMode
          }
        >
          {userObj.uid !== "" && (
            <FontAwesomeIcon
              className="text-xl text-blue-500 mr-3"
              icon={faBell}
            />
          )}
          <FontAwesomeIcon
            icon={faUserCircle}
            className="text-2xl text-blue-500"
          />
          {userObj.uid !== "" ? (
            <div className="ml-3 font-light relative">
              <span>
                {userObj.email !== null && getMinimizedStr(userObj.email)}
              </span>
              <FontAwesomeIcon className="ml-3" icon={faChevronDown} />
              {openMenu && (
                <div className="absolute top-6 right-0 bg-white text-gray-500 p-5 shadow-xl text-center">
                  <ul>
                    <li className="mb-3 hover:text-black">Profile</li>
                    <li className="mb-3 hover:text-black">내 계정</li>
                    <li className="border-b border-black "></li>
                    <li
                      onClick={handleLogOut}
                      className="hover:text-red-500 font-medium"
                    >
                      Log Out
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <span className="ml-3 font-light text-gray-500 text-sm hover:text-gray-400">
              Log In
            </span>
          )}
        </div>
      </div>
      {/* 헤더 아래쪽 곰돌이 부분 */}
      <div className="w-full py-5 flex justify-between items-center">
        <Link to={routes.home} className="flex items-center">
          <img
            draggable={false}
            src={
              "https://firebasestorage.googleapis.com/v0/b/jido-button.appspot.com/o/249._%E1%84%89%E1%85%A5%E1%84%8B%E1%85%AE%E1%86%AF_%E1%84%89%E1%85%A5%E1%84%80%E1%85%A7%E1%86%BC%E1%84%83%E1%85%A2_%E1%84%85%E1%85%A9%E1%84%80%E1%85%A9.png?alt=media&token=ba715371-17b9-4559-b8cb-52a2deba8880"
            }
            width={150}
            height={150}
          />
          <span className="ml-5 text-2xl font-medium">서경 타임</span>
        </Link>
        <div className="w-1/2">
          <ul className="w-full flex justify-end items-center">
            <li className="mr-5">
              <Link to={routes.home}>메인</Link>
            </li>
            <li className="mr-5">
              <Link to={routes.campus}>캠퍼스</Link>
            </li>
            <li className="mr-5">
              <Link to={routes.forum}>게시판</Link>
            </li>
            <li className="mr-5">
              <Link to={routes.message}>쪽지함</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
