import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { PopUpLogin } from "../components/PopUpLogin";
import { DB_Group } from "../types/DBService.types";
import { routes } from "../utils/constants";
import { authService, dbService } from "../utils/firebase";
import { getFirestoreQuery, isLoggedIn } from "../utils/utils";
import {
  getDocs,
  doc,
  updateDoc,
  collection,
  onSnapshot,
} from "firebase/firestore";

export const Campus: React.FC = () => {
  const [popUpLoginMode, setPopUpLoginMode] = useState(false);
  const [groupList, setGroupList] = useState<DB_Group[]>([]);
  const [loading, setLoading] = useState(false);

  const checkGroupParticipants = async (group: string): Promise<boolean> => {
    let ok = false;
    const q = getFirestoreQuery("group", "enName", group);
    const queryResult = await getDocs(q);

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

    const q = getFirestoreQuery("group", "enName", group);
    const queryResult = await getDocs(q);

    for (const docRef of queryResult.docs) {
      const documentRef = doc(dbService, `group/${docRef.id}`);
      try {
        await updateDoc(documentRef, {
          participants: [
            ...docRef.data().participants,
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
          toast.error("????????? ???????????? ???????????????.");
        } else {
          toast.success("??????????????? ????????? ??????????????????.");
        }
      }
    } else {
      setPopUpLoginMode(true);
    }
  };

  const loadGroupList = async () => {
    setLoading(true);
    const groupList = await getDocs(collection(dbService, "group"));
    const arr: DB_Group[] = [];

    for (const group of groupList.docs) {
      if (group.exists()) {
        const data: DB_Group = {
          ...group.data(),
          enName: group.data().enName,
          korName: group.data().korName,
        };

        arr.push(data);
      }
    }

    setGroupList(arr);
    setLoading(false);
  };

  useEffect(() => {
    loadGroupList();
    onSnapshot(collection(dbService, "group"), (groups) => {
      const arr: DB_Group[] = [];
      for (const group of groups.docs) {
        if (group.exists()) {
          const data: DB_Group = {
            ...group.data(),
            enName: group.data().enName,
            korName: group.data().korName,
          };
          arr.push(data);
        }
      }
      setGroupList(arr);
    });
  }, []);

  return (
    <main className="max-w-screen-lg mx-auto pb-20">
      <section className="flex justify-between items-center mb-5 ">
        <h1 className="text-3xl">??????</h1>
      </section>
      <section className="border-t border-black">
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
                  <h5>?????? ?????? {elem.participants?.length}???</h5>
                </div>
              </div>
              {elem.participants?.find(
                (user) => user === authService.currentUser?.uid
              ) ? (
                <Link
                  className="px-10 py-3 text-center border border-blue-800 text-blue-800 bg-white hover:opacity-70 transition-opacity cursor-pointer"
                  to={routes.campusDetail(elem.enName)}
                >
                  ??????
                </Link>
              ) : (
                <h4
                  className="px-10 py-3 border  text-center bg-green-800 text-white hover:opacity-70 transition-opacity cursor-pointer"
                  onClick={handleJoinGroup}
                >
                  ??????
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
