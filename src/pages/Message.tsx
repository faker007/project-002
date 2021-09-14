import {
  addDoc,
  collection,
  doc,
  DocumentData,
  getDocs,
  onSnapshot,
  QueryDocumentSnapshot,
  updateDoc,
} from "@firebase/firestore";
import {
  faPlusSquare,
  faTimesCircle,
} from "@fortawesome/free-regular-svg-icons";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { toast } from "react-toastify";
import { DB_UserTypes } from "../types/DBService.types";
import { DB_MSGROOM } from "../types/Message.types";
import { routes } from "../utils/constants";
import { authService, dbService } from "../utils/firebase";
import { getFirestoreQuery, isLoggedIn } from "../utils/utils";
import { v4 as uuid } from "uuid";
import { async } from "@firebase/util";
import { MessageRoomBanner } from "../components/MessageRoomBanner";

export const Message: React.FC = () => {
  const [openPopUp, setOpenPopUp] = useState(false);
  const [users, setUsers] = useState<DB_UserTypes[]>([]);
  const [loading, setLoading] = useState(false);
  const [msgRooms, setMsgRooms] = useState<DB_MSGROOM[]>([]);
  const [init, setInit] = useState(false);
  const history = useHistory();

  const loadUsers = async () => {
    const container: DB_UserTypes[] = [];
    try {
      const docs = await getDocs(collection(dbService, "user"));
      for (const item of docs.docs) {
        if (item.exists()) {
          const user: DB_UserTypes = {
            displayName: item.get("displayName"),
            email: item.get("email"),
            uid: item.get("uid"),
            msgRoomIds: item.get("msgRoomIds"),
          };
          container.push(user);
        }
      }

      setUsers(container);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClickToOpenMessageChat = () => {
    if (!isLoggedIn()) {
      toast.error("해당 기능은 로그인 후에 이용 가능합니다.");
      return;
    }
    setOpenPopUp(true);
  };

  const updateUserMsgRoomIds = async (uid: string, newMsgRoomId: string) => {
    try {
      if (authService.currentUser) {
        const q = getFirestoreQuery("user", "uid", uid);
        const result = await getDocs(q);

        for (const item of result.docs) {
          if (item.exists()) {
            const updatedMsgRoomIds = [...item.get("msgRoomIds"), newMsgRoomId];
            await updateDoc(doc(dbService, `user/${item.id}`), {
              msgRoomIds: updatedMsgRoomIds,
            });
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateMsgRoom = async (uid: string) => {
    if (!isLoggedIn()) {
      toast.error("해당 기능은 로그인 이후에 이용 가능합니다.");
      return;
    }
    if (uid === "" || uid === null) {
      toast.error("올바른 유저가 아닙니다.");
      return;
    }

    try {
      if (authService.currentUser) {
        const newMsgRoom: DB_MSGROOM = {
          createdAt: Date.now(),
          id: uuid(),
          msgIds: [],
          participantIds: [authService.currentUser.uid, uid],
        };

        await addDoc(collection(dbService, "msgRoom"), newMsgRoom);
        await updateUserMsgRoomIds(authService.currentUser.uid, newMsgRoom.id);
        await updateUserMsgRoomIds(uid, newMsgRoom.id);
        history.push(routes.messageRoom(newMsgRoom.id));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const loadMsgRoom = async (msgRoomId: string): Promise<DB_MSGROOM | null> => {
    try {
      const q = getFirestoreQuery("msgRoom", "id", msgRoomId);
      const result = await getDocs(q);

      for (const item of result.docs) {
        if (item.exists()) {
          const msgRoom: DB_MSGROOM = {
            id: item.get("id"),
            createdAt: item.get("createdAt"),
            participantIds: item.get("participantIds"),
            msgIds: item.get("msgIds"),
          };
          return msgRoom;
        }
      }
    } catch (error) {
      console.log(error);
    }
    return null;
  };

  const loadMsgRooms = async (msgRoomIds: string[]) => {
    const container: DB_MSGROOM[] = [];
    try {
      if (Array.isArray(msgRoomIds) && msgRoomIds.length > 0) {
        for (const msgRoomId of msgRoomIds) {
          const msgRoom = await loadMsgRoom(msgRoomId);
          if (msgRoom !== null) {
            container.push(msgRoom);
          }
        }

        setMsgRooms(container);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const setSnapshot = () => {
    if (init && authService.currentUser) {
      const q = getFirestoreQuery("user", "uid", authService.currentUser.uid);

      onSnapshot(q, (ref) => {
        for (const item of ref.docs) {
          if (item.exists()) {
            const msgRoomIds = item.get("msgRoomIds");
            loadMsgRooms(msgRoomIds);
          }
        }
      });
      setInit(false);
    }
  };

  useEffect(() => {
    if (openPopUp) {
      document.body.style.overflow = "hidden";
      setLoading(true);
      loadUsers();
    } else {
      document.body.style.overflow = "";
    }
  }, [openPopUp]);

  useEffect(() => {
    if (authService.currentUser?.uid) {
      setInit(true);
    }
  }, [authService.currentUser]);

  useEffect(() => {
    if (init) {
      setSnapshot();
    }
  }, [init]);

  useEffect(() => {
    return () => {
      document.body.onclick = null;
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="max-w-screen-lg mx-auto min-h-screen">
      <header className="flex justify-between items-center pb-3 border-b border-gray-500">
        <h1 className="text-3xl font-medium">메세지</h1>
        <div
          onClick={handleClickToOpenMessageChat}
          className="text-lg border border-gray-300 p-3 hover:bg-green-500 hover:text-white cursor-pointer transition-all"
        >
          <FontAwesomeIcon className="mr-3" icon={faPlusSquare} />
          <span>메세지 보내기</span>
        </div>
      </header>
      <main className="my-5 w-full">
        {msgRooms.map((elem, index) => (
          <MessageRoomBanner msgRoom={elem} key={index} />
        ))}
      </main>
      {openPopUp && (
        <div className="z-10 fixed top-0 left-0 w-full min-h-screen flex justify-center items-center">
          <div
            onClick={() => setOpenPopUp(false)}
            className="fixed top-0 left-0 w-full min-h-screen bg-black opacity-50"
          ></div>
          <main className="z-10 max-w-screen-sm w-full bg-white p-5 flex flex-col justify-center items-center">
            <header className=" w-full flex items-center justify-end">
              <FontAwesomeIcon
                onClick={() => setOpenPopUp(false)}
                icon={faTimesCircle}
                className="text-gray-500 text-3xl hover:text-red-500 transition-all cursor-pointer"
              />
            </header>
            {loading ? (
              <FontAwesomeIcon
                icon={faCircleNotch}
                className="text-blue-500 animate-spin text-3xl"
              />
            ) : (
              <>
                <h1 className="w-full pb-3 border-b border-gray-300 text-center text-3xl font-medium">
                  메세지 보내기
                </h1>
                <div className="w-full py-5 max-h-96 overflow-auto">
                  {users
                    .filter((elem) => elem.uid !== authService.currentUser?.uid)
                    .map((elem, index) => (
                      <div
                        onClick={() => handleCreateMsgRoom(elem.uid)}
                        key={index}
                        className="w-full border border-gray-500 p-3 mb-3 hover:bg-green-500 hover:text-white hover:border-green-500 transition-all cursor-pointer"
                      >
                        <h1>{elem.email}</h1>
                      </div>
                    ))}
                </div>
              </>
            )}
          </main>
        </div>
      )}
    </div>
  );
};
