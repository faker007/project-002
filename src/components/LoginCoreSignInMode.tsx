import { LoginCoreSignInModeTypes } from "../types/LoginCoreSignInMode.types";

export const LoginCoreSignInMode: React.FC<LoginCoreSignInModeTypes> = ({
  commuDetail,
  emailMode,
  errorMsg,
  handleEmailChange,
  handlePasswordChange,
  handleSubmit,
  setCommuDetail,
  setEmailMode,
  setSignInMode,
}) => {
  return (
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
        </div>
      ) : (
        <>
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
            사이트 회원 간 교류, 댓글 추가, 팔로우 등의 활동을 시작하세요. 내
            별명, 프로필 이미지, 공개 활동 내용이 사이트에 표시됩니다.
          </h3>
        )}
      </div>
    </div>
  );
};
