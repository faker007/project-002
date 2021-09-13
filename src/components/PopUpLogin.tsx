import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import { PopUpLoginTypes } from "../types/PopUpLogin.types";
import { isLoggedIn } from "../utils/utils";
import { LoginCore } from "./LoginCore";

export const PopUpLogin: React.FC<PopUpLoginTypes> = ({
  popUpLoginMode,
  setPopUpLoginMode,
}) => {
  const handleClickToExit = (e: any) => {
    setPopUpLoginMode(false);
  };

  useEffect(() => {
    if (isLoggedIn()) {
      setPopUpLoginMode(false);
    }

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="z-20 fixed top-0 left-0 w-full h-screen backdrop-filter backdrop-blur-sm flex justify-center items-center">
      <div
        onClick={handleClickToExit}
        className="fixed top-0 left-0 w-full h-full bg-black opacity-60"
      ></div>

      <div className="max-w-lg w-full py-14 px-5 bg-white z-10">
        <LoginCore
          loginMode={popUpLoginMode}
          setLoginMode={setPopUpLoginMode}
        />
      </div>
    </div>
  );
};
