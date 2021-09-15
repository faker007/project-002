import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { DB_UserTypes } from "../types/DBService.types";
import { authService, dbService } from "../utils/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { LoginCoreSignInMode } from "./LoginCoreSignInMode";
import { LoginCoreLoginMode } from "./LoginCoreLoginMode";
import { LoginModeTypes } from "../types/LoginTypes";

export const LoginCore: React.FC<LoginModeTypes> = ({
  loginMode,
  setLoginMode,
}) => {
  const [signInMode, setSignInMode] = useState(true);
  const [commuDetail, setCommuDetail] = useState(false);
  const [emailMode, setEmailMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;
    setEmail(value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;

    setPassword(value);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (email !== "" && password !== "") {
      try {
        if (signInMode) {
          // 회원가입
          const userCredential = await createUserWithEmailAndPassword(
            authService,
            email,
            password
          );

          if (userCredential.user) {
            // 해당 유저 데이터중 유의미한 데이터만 db에 저장
            const dbUser: DB_UserTypes = {
              displayName: userCredential.user.displayName,
              email: userCredential.user.email,
              uid: userCredential.user.uid,
              msgRoomIds: [],
            };

            await addDoc(collection(dbService, "user"), dbUser);

            setLoginMode(false);
            toast.success("성공적으로 유저 생성 완료");
          }
        } else {
          // 로그인
          const userCredential = await signInWithEmailAndPassword(
            authService,
            email,
            password
          );
          if (userCredential.user) {
            setLoginMode(false);
            toast.success("성공적으로 로그인 완료");
          }
        }
      } catch (error) {
        console.log(`error: ${error}`);
        // @ts-ignore
        setErrorMsg(error.message);
      }
    }
  };

  useEffect(() => {
    setEmailMode(false);
    setErrorMsg("");
  }, [signInMode]);

  useEffect(() => {
    if (errorMsg !== "") {
      setTimeout(() => {
        setErrorMsg("");
      }, 2000);
    }
  }, [errorMsg]);

  return (
    <>
      {signInMode ? (
        <LoginCoreSignInMode
          commuDetail={commuDetail}
          emailMode={emailMode}
          errorMsg={errorMsg}
          handleEmailChange={handleEmailChange}
          handlePasswordChange={handlePasswordChange}
          handleSubmit={handleSubmit}
          setCommuDetail={setCommuDetail}
          setEmailMode={setEmailMode}
          setSignInMode={setSignInMode}
        />
      ) : (
        <LoginCoreLoginMode
          setSignInMode={setSignInMode}
          setEmailMode={setEmailMode}
          handleSubmit={handleSubmit}
          handlePasswordChange={handlePasswordChange}
          handleEmailChange={handleEmailChange}
          errorMsg={errorMsg}
          emailMode={emailMode}
        />
      )}
    </>
  );
};
