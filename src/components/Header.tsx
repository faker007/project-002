import { faChevronDown, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { HeaderTypes } from "../types/Header.types";
import { routes } from "../utils/constants";
import { authService } from "../utils/firebase";
import { getMinimizedStr, isLoggedIn } from "../utils/utils";

export const Header: React.FC<HeaderTypes> = ({
  loginModeType: { loginMode, setLoginMode },
  userObj,
}) => {
  const [openMenu, setOpenMenu] = useState(false);
  const history = useHistory();

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
      history.push(routes.home);
      toast("성공적으로 로그아웃 했습니다.");
    } catch (error) {
      console.log(error);
      //@ts-ignore
      toast.error(error);
    }
  };

  return (
    <div className="w-full py-12  px-24">
      {/* 헤더 위쪽 로그인 파트 */}
      <div className="w-full  pb-3 border-b border-black flex items-center justify-end">
        <div
          className="flex items-center cursor-pointer"
          onClick={
            userObj.uid !== "" ? handleDropDownMenuOpen : handleLoginMode
          }
        >
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
      <div className="w-full py-5 flex justify-between items-center">
        <Link to={routes.home} className="flex items-center">
          <img
            draggable={false}
            src={
              "https://firebasestorage.googleapis.com/v0/b/seogyeong-time.appspot.com/o/headerImg.png?alt=media&token=bfc1a85d-611f-49e8-af86-d14f1cf0e06b"
            }
            width={150}
            height={150}
          />
          <span className="ml-5 text-2xl font-medium">서경 메이트</span>
        </Link>
        <div className="w-1/2">
          <ul className="w-full flex justify-end items-center">
            <li className="mr-5 hover:underline">
              <Link to={routes.home}>메인</Link>
            </li>
            <li className="mr-5 hover:underline">
              <Link to={routes.campus}>캠퍼스</Link>
            </li>
            <li className="mr-5 hover:underline">
              <Link to={routes.forum}>게시판</Link>
            </li>
            {isLoggedIn() && (
              <li className="mr-5 hover:underline">
                <Link to={routes.message}>쪽지함</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};
