import {
  faFacebookSquare,
  faGoogle,
  faGooglePlusSquare,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { DB_UserTypes } from "../types/DBService.types";
import { LoginModeTypes } from "../types/LoginMode.types";
import { authService, dbService } from "../utils/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";

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
        <div className="w-full bg-white flex flex-col items-center">
          <h1 className="text-5xl mb-5">가입하기</h1>
          <h2 className="text-xl mb-10">
            이미 계정이 있습니까?{" "}
            <span
              className="text-blue-500 cursor-pointer"
              onClick={() => {
                setSignInMode(false);
              }}
            >
              로그인
            </span>
          </h2>
          {emailMode ? (
            <div className=" w-2/3 mb-14">
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col mb-3 ">
                  <label className="text-xl" htmlFor={"email"}>
                    이메일
                  </label>
                  <input
                    className="outline-none border-b border-black"
                    type="email"
                    name="email"
                    id="email"
                    required
                    onChange={handleEmailChange}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-xl" htmlFor={"password"}>
                    비밀번호
                  </label>
                  <input
                    onChange={handlePasswordChange}
                    className="outline-none border-b border-black"
                    type="password"
                    name="password"
                    id="password"
                    required
                  />
                </div>

                {errorMsg && <h4 className="mt-3 text-red-500">{errorMsg}</h4>}
                <button
                  type="submit"
                  className="w-full mt-5 text-lg  bg-blue-800 text-center py-3 text-gray-500 cursor-pointer hover:text-gray-300 transition-colors "
                >
                  가입하기
                </button>
              </form>

              <div className="my-5  p-1 w-full border-b border-black text-center relative">
                <span className="absolute left-0 right-0 mx-auto -top-1 w-1/2  bg-white ">
                  다음 계정으로 가입하기
                </span>
              </div>
              <div className="text-center text-4xl">
                <FontAwesomeIcon
                  className="mr-5 text-blue-800 cursor-pointer"
                  icon={faFacebookSquare}
                />
                <FontAwesomeIcon
                  className="mr-5 text-red-500 cursor-pointer"
                  icon={faGoogle}
                />
              </div>
            </div>
          ) : (
            <>
              <div className=" w-2/3 p-2 border  text-center flex items-center bg-blue-800 text-white mb-3 hover:opacity-80 transition-opacity">
                <div className="w-2/3 flex items-center justify-between">
                  <FontAwesomeIcon
                    icon={faFacebookSquare}
                    className="text-2xl "
                  />
                  <span className="font-light text-sm">Facebook으로 가입</span>
                </div>
              </div>
              <div className="w-2/3 p-2 border  text-center flex items-center bg-blue-500 text-white hover:opacity-80 transition-opacity">
                <div className="w-2/3 flex items-center justify-between">
                  <FontAwesomeIcon
                    icon={faGooglePlusSquare}
                    className="text-2xl"
                  />
                  <span className="font-light text-sm">Google+로 가입</span>
                </div>
              </div>
              <div className="my-5  p-1 w-2/3 border-b border-black text-center relative">
                <span className="absolute left-0 right-0 mx-auto -top-1 w-1/5 bg-white ">
                  또는
                </span>
              </div>
              <div
                className="border border-gray-500 hover:border-black transition-colors w-2/3 text-center  py-2 mb-10 cursor-pointer"
                onClick={() => setEmailMode(true)}
              >
                <span>이메일로 가입</span>
              </div>
            </>
          )}

          <div className="text-center">
            <input className="mr-2" type="checkbox" checked />
            <span className="mr-2">사이트 커뮤니티에 가입합니다.</span>
            {commuDetail ? (
              <span
                className="border-b border-black hover:opacity-80 transition-opacity cursor-pointer"
                onClick={() => setCommuDetail(false)}
              >
                접기
              </span>
            ) : (
              <span
                className="border-b border-black hover:opacity-80 transition-opacity cursor-pointer"
                onClick={() => setCommuDetail(true)}
              >
                자세히 보기
              </span>
            )}
            {commuDetail && (
              <h3>
                사이트 회원 간 교류, 댓글 추가, 팔로우 등의 활동을 시작하세요.
                내 별명, 프로필 이미지, 공개 활동 내용이 사이트에 표시됩니다.
              </h3>
            )}
          </div>
        </div>
      ) : (
        <div className="w-full bg-white flex flex-col items-center">
          <h1 className="text-5xl mb-5">로그인</h1>
          <h2 className="text-xl mb-10">
            아직 계정이 없으신가요?{" "}
            <span
              className="text-blue-500 cursor-pointer"
              onClick={() => {
                setSignInMode(true);
              }}
            >
              가입하기
            </span>
          </h2>
          {emailMode ? (
            <div className="w-2/3 mb-14">
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col mb-3 ">
                  <label className="text-xl" htmlFor={"email"}>
                    이메일
                  </label>
                  <input
                    onChange={handleEmailChange}
                    className="outline-none border-b border-black"
                    type="email"
                    name="email"
                    id="email"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-xl" htmlFor={"password"}>
                    비밀번호
                  </label>
                  <input
                    onChange={handlePasswordChange}
                    className="outline-none border-b border-black"
                    type="password"
                    name="password"
                    id="password"
                    required
                  />
                </div>
                {errorMsg && <h4 className="mt-3 text-red-500">{errorMsg}</h4>}
                <button
                  className="w-full mt-5 text-lg  bg-blue-800 text-center py-3 text-gray-500 cursor-pointer hover:text-gray-300 transition-colors"
                  type="submit"
                >
                  로그인
                </button>
              </form>

              <div className="my-5  p-1 w-full border-b border-black text-center relative">
                <span className="absolute left-0 right-0 mx-auto -top-1 w-3/5  bg-white ">
                  다음 계정으로 로그인하기
                </span>
              </div>
              <div className="text-center text-4xl">
                <FontAwesomeIcon
                  className="mr-5 text-blue-800 cursor-pointer"
                  icon={faFacebookSquare}
                />
                <FontAwesomeIcon
                  className="mr-5 text-red-500 cursor-pointer"
                  icon={faGoogle}
                />
              </div>
            </div>
          ) : (
            <>
              <div className="w-2/3 p-2 border  text-center flex items-center bg-blue-800 text-white mb-3 hover:opacity-80 transition-opacity">
                <div className="w-2/3 flex items-center justify-between">
                  <FontAwesomeIcon
                    icon={faFacebookSquare}
                    className="text-2xl "
                  />
                  <span className="font-light text-sm">Facebook 로그인</span>
                </div>
              </div>
              <div className="w-2/3 p-2 border  text-center flex items-center bg-blue-500 text-white hover:opacity-80 transition-opacity">
                <div className="w-2/3 flex items-center justify-between">
                  <FontAwesomeIcon
                    icon={faGooglePlusSquare}
                    className="text-2xl"
                  />
                  <span className="font-light text-sm">Google+ 로그인</span>
                </div>
              </div>
              <div className="my-5  p-1 w-2/3 border-b border-black text-center relative">
                <span className="absolute left-0 right-0 mx-auto -top-1 w-1/5 bg-white ">
                  또는
                </span>
              </div>
              <div
                className="border border-gray-500 hover:border-black transition-colors w-2/3 text-center  py-2 mb-10 cursor-pointer"
                onClick={() => setEmailMode(true)}
              >
                <span>이메일로 로그인</span>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
