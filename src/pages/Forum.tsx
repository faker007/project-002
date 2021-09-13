import {
  faCircleNotch,
  faSearch,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { domainToASCII } from "url";
import { ForumGroup } from "../components/ForumGroup";
import { LoginCore } from "../components/LoginCore";
import { PopUpLogin } from "../components/PopUpLogin";
import { ForumGroupTypes } from "../types/Forum.types";
import { FORUM_GROUPS, FORUM_HERO_IMGS, routes } from "../utils/constants";
import { dbService } from "../utils/firebase";
import { isLoggedIn } from "../utils/utils";

export const Forum: React.FC = () => {
  const [forumGroup, setForumGroup] = useState<ForumGroupTypes[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginMode, setLoginMode] = useState(false);

  const loadForumGroup = async (docs: any) => {
    // const query = dbService.collection("forumGroup");
    // const result = await query.get({ source: "server" });
    let arr: ForumGroupTypes[] = [];

    for (const doc of docs) {
      if (doc.exists) {
        const data: ForumGroupTypes = {
          enName: doc.get("enName"),
          views: doc.get("views"),
          posts: doc.get("posts"),
          korName: doc.get("korName"),
        };

        arr.push(data);
      }
    }

    const freedomCommu = arr.find((elem) => elem.korName === "자유게시판");
    if (freedomCommu) {
      console.log("Freedom!");
      console.log(freedomCommu);

      const alteredArr = arr.filter((elem) => elem.korName !== "자유게시판");
      alteredArr.unshift(freedomCommu);
      arr = [...alteredArr];
    }

    setForumGroup([...arr]);
    setLoading(false);
  };

  const handleMenuOpen = () => {
    if (!isLoggedIn()) {
      setMenuOpen(false);
      setLoginMode(true);
    } else {
      setMenuOpen(true);
    }
  };

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [menuOpen]);

  useEffect(() => {
    setLoading(true);
    setMenuOpen(false);
    dbService
      .collection("forumGroup")
      .onSnapshot((ref) => loadForumGroup(ref.docs));

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="max-w-screen-lg mx-auto">
      {!loading ? (
        <>
          <section className="w-full flex items-center justify-between mb-5">
            <h1 className="text-3xl font-medium">게시판</h1>
            <div className="w-1/5 border-b border-black">
              <FontAwesomeIcon
                className="text-xl text-gray-500 mb-1"
                icon={faSearch}
              />
            </div>
          </section>
          <section className="relative w-full h-80  flex flex-col justify-center items-center  ">
            <div
              className="absolute top-0 left-0 w-full h-full bg-cover bg-center filter blur-sm"
              style={{
                backgroundImage: `url(${
                  FORUM_HERO_IMGS[
                    Math.floor(Math.random() * FORUM_HERO_IMGS.length)
                  ]
                })`,
              }}
            ></div>
            <h1 className="z-10 text-6xl font-semibold mb-5 ">서경 대학교</h1>
            <h2 className="z-10 text-lg font-medium">
              멘토링, 과팅, 미팅, 소모임, 동아리, 스터디 등등의 교류활동이
              이루어지는 게시판입니다.
            </h2>
          </section>
          <section className="w-full flex justify-end items-center mt-5">
            <button
              onClick={handleMenuOpen}
              className="relative bg-blue-800 text-white px-5 py-2 hover:opacity-70 transition-all"
            >
              <span>게시물 작성하기</span>
            </button>
          </section>
          <section className="mt-5">
            {forumGroup.length > 0 &&
              forumGroup.map((elem, index) => (
                <ForumGroup {...elem} key={index} />
              ))}
          </section>
          {/* 게시물 작성 클릭시 열리는 카테고리 선택 후 포스트 작성 이동 컴포넌트 */}
          {forumGroup.length > 0 && menuOpen && (
            <div className="fixed top-0 left-0 w-full h-screen backdrop-filter backdrop-blur-sm flex justify-center items-center">
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
          )}
          {loginMode && (
            <PopUpLogin
              popUpLoginMode={loginMode}
              setPopUpLoginMode={setLoginMode}
            />
          )}
        </>
      ) : (
        <div className="w-full  text-center">
          <FontAwesomeIcon
            icon={faCircleNotch}
            className="text-5xl animate-spin text-blue-500"
          />
        </div>
      )}
    </div>
  );
};
