import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import { LoginModeTypes } from "../types/LoginMode.types";
import { LoginCore } from "./LoginCore";

export const LogIn: React.FC<LoginModeTypes> = ({
  loginMode,
  setLoginMode,
}) => {
  const handleLoginMode = () => {
    if (!loginMode) {
      return;
    }
    setLoginMode(false);
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="z-20 w-full h-screen min-h-screen fixed top-0 left-0 flex justify-center items-center bg-white ">
      <FontAwesomeIcon
        onClick={handleLoginMode}
        icon={faTimesCircle}
        className="absolute top-0 right-0 m-14 text-5xl cursor-pointer hover:text-red-500 transition-colors"
      />
      <div className="max-w-lg w-full">
        <LoginCore loginMode={loginMode} setLoginMode={setLoginMode} />
      </div>
    </div>
  );
};
