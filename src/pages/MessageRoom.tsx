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
  faArrowAltCircleLeft,
  faUserCircle,
} from "@fortawesome/free-regular-svg-icons";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { toast } from "react-toastify";
import { authService, dbService } from "../utils/firebase";
import { getFirestoreQuery, isLoggedIn, timeCalc } from "../utils/utils";
import { v4 as uuid } from "uuid";
import { DB_MESSAGE, DB_MSGROOM, DB_UserTypes } from "../types/DBService.types";
import { routes } from "../utils/constants";

export const MessageRoom: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [msgRoom, setMsgRoom] = useState<DB_MSGROOM | null>(null);
  const [msgs, setMsgs] = useState<DB_MESSAGE[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendLoading, setSendLoading] = useState(false);
  const [input, setInput] = useState("");
  const [opponentUser, setOpponentUser] = useState<DB_UserTypes | null>(null);

  const loadOpponentUser = async () => {
    try {
      const opponentUid = msgRoom?.participantIds.find(
        (elem) => elem !== authService.currentUser?.uid
      );

      if (opponentUid) {
        const q = getFirestoreQuery("user", "uid", opponentUid);
        const result = await getDocs(q);
        for (const item of result.docs) {
          if (item.exists()) {
            const opponentUser: DB_UserTypes = {
              uid: item.get("uid"),
              displayName: item.get("displayName"),
              email: item.get("email"),
              msgRoomIds: item.get("msgRoomIds"),
            };
            setOpponentUser(opponentUser);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const loadMsgRoom = async (docs: QueryDocumentSnapshot<DocumentData>[]) => {
    try {
      for (const item of docs) {
        if (item.exists()) {
          setMsgRoom({
            id: item.get("id"),
            createdAt: item.get("createdAt"),
            participantIds: item.get("participantIds"),
            msgIds: item.get("msgIds"),
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const loadMsg = async (id: string): Promise<DB_MESSAGE | null> => {
    try {
      const q = getFirestoreQuery("msg", "id", id);
      const result = await getDocs(q);

      for (const item of result.docs) {
        if (item.exists()) {
          const msg: DB_MESSAGE = {
            id: item.get("id"),
            createdAt: item.get("createdAt"),
            fromUserId: item.get("fromUserId"),
            textBody: item.get("textBody"),
            toUserId: item.get("toUserId"),
          };
          return msg;
        }
      }
    } catch (error) {
      console.log(error);
    }

    return null;
  };

  const loadMsgs = async () => {
    const container: DB_MESSAGE[] = [];
    if (!Boolean(msgRoom)) {
      toast.error("msgRoom이 유효하지 않습니다.");
      return;
    }
    try {
      if (msgRoom) {
        for (const item of msgRoom.msgIds) {
          const msg = await loadMsg(item);
          if (msg !== null) {
            container.push(msg);
          }
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setMsgs(container);
      setLoading(false);
      setSendLoading(false);
      window.scrollTo(0, document.body.scrollHeight);
    }
  };

  const setMsgRoomSnapshot = async () => {
    const q = getFirestoreQuery("msgRoom", "id", id);

    onSnapshot(q, (ref) => {
      loadMsgRoom(ref.docs);
    });
  };

  const updateMsgRoomMsgIds = async (newMsgId: string): Promise<void> => {
    try {
      const msgRoomQ = getFirestoreQuery("msgRoom", "id", id);
      const msgRoomR = await getDocs(msgRoomQ);

      for (const item of msgRoomR.docs) {
        if (item.exists()) {
          const newMsgIds = [...item.get("msgIds"), newMsgId];
          await updateDoc(doc(dbService, `msgRoom/${item.id}`), {
            msgIds: newMsgIds,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmitToCreateMsg = async (e: any) => {
    e.preventDefault();
    setSendLoading(true);

    if (!isLoggedIn()) {
      toast.error("해당 기능은 로그인 후에 이용할 수 있습니다.");
      setSendLoading(false);
      return;
    }

    if (input.length <= 0) {
      toast.error("메세지를 입력한 후에 전송해 주세요.");
      setSendLoading(false);
      return;
    }

    try {
      if (authService.currentUser && msgRoom) {
        const toUserId = msgRoom.participantIds.filter(
          (elem) => elem !== authService.currentUser?.uid
        )[0];
        const newMsg: DB_MESSAGE = {
          createdAt: Date.now(),
          fromUserId: authService.currentUser.uid,
          id: uuid(),
          textBody: input,
          toUserId,
        };

        await addDoc(collection(dbService, "msg"), newMsg);
        await updateMsgRoomMsgIds(newMsg.id);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setInput("");
    }
  };

  useEffect(() => {
    setLoading(true);
    setMsgRoomSnapshot();
  }, []);

  useEffect(() => {
    if (msgRoom !== null) {
      loadMsgs();
      loadOpponentUser();
    }
  }, [msgRoom]);

  useEffect(() => {
    if (msgs.length > 0) {
      window.scrollTo(0, document.body.scrollHeight);
    }
  }, [msgs]);

  return (
    <div className="max-w-screen-lg mx-auto pb-20">
      {loading ? (
        <div className="w-full text-center">
          <FontAwesomeIcon
            icon={faCircleNotch}
            className="text-5xl animate-spin text-blue-500"
          />
        </div>
      ) : (
        <>
          <header className="w-full">
            <div className="w-full flex items-center justify-between border border-gray-300 bg-green-500 p-5 rounded-t-2xl text-white">
              <FontAwesomeIcon
                onClick={() => history.push(routes.message)}
                icon={faArrowAltCircleLeft}
                className="text-3xl cursor-pointer hover:text-red-500 transition-all hover:scale-110 transform"
              />
              <h1 className="text-xl font-medium">
                {opponentUser?.email}님과의 대화
              </h1>
            </div>
          </header>
          <main className="w-full p-5 bg-gray-100 rounded-b-2xl shadow-inner">
            <section className="w-full">
              {msgs
                .sort((a, b) => a.createdAt - b.createdAt)
                .map((elem, index) => (
                  <div
                    key={index}
                    className={`w-full flex my-3 items-center ${
                      elem.fromUserId === authService.currentUser?.uid
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div className="flex items-end">
                      {elem.fromUserId === authService.currentUser?.uid && (
                        <div className="mr-1 text-xs p-1 px-2 bg-green-300  rounded-full">
                          {timeCalc(elem.createdAt)}
                        </div>
                      )}
                      <div
                        className={`p-3 ${
                          elem.fromUserId === authService.currentUser?.uid
                            ? "bg-green-500 text-white"
                            : "bg-gray-200 text-black"
                        }  rounded-2xl flex items-center`}
                      >
                        {opponentUser?.uid === elem.fromUserId && (
                          <div className="flex items-center justify-center">
                            <FontAwesomeIcon
                              icon={faUserCircle}
                              className="text-2xl mr-2"
                            />
                          </div>
                        )}
                        <div>
                          {opponentUser?.uid === elem.fromUserId && (
                            <h1 className="text-sm font-medium">
                              {opponentUser?.email}
                            </h1>
                          )}
                          <h1 className="text-lg">{elem.textBody}</h1>
                        </div>
                      </div>
                      {opponentUser?.uid === elem.fromUserId && (
                        <div className="ml-1 text-xs p-1 px-2 bg-gray-300 rounded-full">
                          {timeCalc(elem.createdAt)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </section>
            <form
              onSubmit={handleSubmitToCreateMsg}
              className="w-full flex mt-5 shadow-md rounded-2xl"
            >
              <input
                onChange={(e) => setInput(e.target.value)}
                value={input}
                type={"text"}
                placeholder={"메시지를 입력해 주세요."}
                className="w-full p-5 outline-none rounded-tl-2xl rounded-bl-2xl"
              />
              <button
                type={"submit"}
                className={`text-2xl  px-12 ${
                  input.length > 0 ? "bg-green-500" : "bg-gray-300"
                } transition-all rounded-tr-2xl rounded-br-2xl`}
              >
                {sendLoading ? (
                  <FontAwesomeIcon
                    icon={faCircleNotch}
                    className="animate-spin text-white"
                  />
                ) : (
                  "🔥"
                )}
              </button>
            </form>
          </main>
        </>
      )}
    </div>
  );
};
