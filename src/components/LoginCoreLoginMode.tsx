import { LoginCoreLoginModeTypes } from "../types/LoginTypes";

export const LoginCoreLoginMode: React.FC<LoginCoreLoginModeTypes> = ({
  setSignInMode,
  setEmailMode,
  handleSubmit,
  handlePasswordChange,
  handleEmailChange,
  errorMsg,
  emailMode,
}) => {
  return (
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
        </div>
      ) : (
        <>
          <div
            className="border border-gray-500 hover:border-black transition-colors w-2/3 text-center  py-2 mb-10 cursor-pointer"
            onClick={() => setEmailMode(true)}
          >
            <span>이메일로 로그인</span>
          </div>
        </>
      )}
    </div>
  );
};
