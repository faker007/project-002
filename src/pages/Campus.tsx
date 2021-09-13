import {
  faChevronDown,
  faCircleNotch,
  faPlus,
  faSearch,
  faTruckLoading,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import { useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { PopUpLogin } from "../components/PopUpLogin";
import { DB_Group } from "../types/DBService.types";
import { routes } from "../utils/constants";
import { authService, dbService } from "../utils/firebase";
import { initGroups, isLoggedIn } from "../utils/utils";

export const Campus: React.FC = () => {
  const [popUpLoginMode, setPopUpLoginMode] = useState(false);
  const [groupList, setGroupList] = useState<DB_Group[]>([]);
  const [loading, setLoading] = useState(false);

  const checkGroupParticipants = async (group: string): Promise<boolean> => {
    let ok = false;
    const query = dbService.collection("group").where("enName", "==", group);
    const queryResult = await query.get();

    queryResult.forEach((doc) => {
      const data = doc.data();
      const participants = data["participants"];
      if (participants && Array.isArray(participants)) {
        const searchQuery = participants.find(
          (elem) => elem === authService.currentUser?.uid
        );
        console.log(searchQuery);

        if (!searchQuery) {
          ok = true;
        }
      }
    });

    return ok;
  };

  const joinGroup = async (group: string): Promise<boolean> => {
    let ok = false;
    const query = dbService.collection("group").where("enName", "==", group);
    const queryResult = await query.get();

    for (const doc of queryResult.docs) {
      const documentRef = dbService.doc(`group/${doc.id}`);
      try {
        await documentRef.update({
          participants: [
            ...doc.data().participants,
            authService.currentUser?.uid,
          ],
        });
        ok = true;
      } catch (error) {
        console.log(error);
      }
    }

    return ok;
  };

  const handleJoinGroup = async (e: any) => {
    if (isLoggedIn()) {
      const href = e.target.parentNode.querySelector("a").href;
      const group = href.split("/")[href.split("/").length - 2];

      if (group !== "" && (await checkGroupParticipants(group))) {
        const ok = await joinGroup(group);
        if (!ok) {
          console.log("Join group occured error!");
          toast.error("그룹에 가입하지 못했습니다.");
        } else {
          toast.success("성공적으로 그룹에 가입했습니다.");
        }
      }
    } else {
      setPopUpLoginMode(true);
    }
  };

  const loadGroupList = async () => {
    setLoading(true);
    const groupList = await dbService.collection("group").get();
    const arr: DB_Group[] = [];

    for (const group of groupList.docs) {
      const data: DB_Group = {
        ...group.data(),
        enName: group.data().enName,
        korName: group.data().korName,
      };

      arr.push(data);
    }

    setGroupList(arr);
    setLoading(false);
  };

  useEffect(() => {
    loadGroupList();
    dbService.collection("group").onSnapshot((groups) => {
      const arr: DB_Group[] = [];
      for (const group of groups.docs) {
        const data: DB_Group = {
          ...group.data(),
          enName: group.data().enName,
          korName: group.data().korName,
        };
        arr.push(data);
      }
      setGroupList(arr);
    });
  }, []);

  return (
    <main className="max-w-screen-lg mx-auto">
      <section className="flex justify-between items-center mb-10">
        <h1 className="text-3xl">그룹</h1>
        <div className="cursor-pointer">
          <FontAwesomeIcon className="mr-2" icon={faPlus} />
          <span>그룹 추가</span>
        </div>
      </section>
      <section>
        <div className="flex items-center justify-between border-b border-black pb-5">
          <div className="flex items-center">
            <span>정렬:</span>
            <div className="flex items-center cursor-pointer">
              <h2 className="pl-3 pr-10">최근활동</h2>
              <FontAwesomeIcon icon={faChevronDown} />
            </div>
          </div>
          <FontAwesomeIcon
            className="text-gray-500 text-xl cursor-pointer"
            icon={faSearch}
          />
        </div>
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <FontAwesomeIcon
              icon={faCircleNotch}
              className="animate-spin text-4xl text-blue-500"
            />
          </div>
        ) : (
          groupList.map((elem, index) => (
            <div
              key={index}
              className="border-b border-black py-5 px-3 flex justify-between  items-center"
            >
              <div className="flex items-center">
                <div className="bg-green-400 p-9 px-16"></div>
                <div className="w-4/6 px-5">
                  <Link
                    to={routes.campusDetail(elem.enName)}
                    className="font-semibold text-xl hover:text-blue-400 transition-colors cursor-pointer"
                  >
                    {elem.korName}
                  </Link>
                  <h5>공개 회원 {elem.participants?.length}명</h5>
                </div>
              </div>
              {elem.participants?.find(
                (user) => user === authService.currentUser?.uid
              ) ? (
                <Link
                  className="px-10 py-3 text-center border border-blue-800 text-blue-800 bg-white hover:opacity-70 transition-opacity cursor-pointer"
                  to={routes.campusDetail(elem.enName)}
                >
                  보기
                </Link>
              ) : (
                <h4
                  className="px-10 py-3 border  text-center bg-green-800 text-white hover:opacity-70 transition-opacity cursor-pointer"
                  onClick={handleJoinGroup}
                >
                  가입
                </h4>
              )}
            </div>
          ))
        )}
      </section>
      {/* popUpLoginMode */}
      {popUpLoginMode && (
        <PopUpLogin
          popUpLoginMode={popUpLoginMode}
          setPopUpLoginMode={setPopUpLoginMode}
        />
      )}
    </main>
  );
};
