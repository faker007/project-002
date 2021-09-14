import {
  addDoc,
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  onSnapshot,
  QueryDocumentSnapshot,
  updateDoc,
} from "@firebase/firestore";
import { async } from "@firebase/util";
import { faUserCircle } from "@fortawesome/free-regular-svg-icons";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { toast } from "react-toastify";
import { DB_MESSAGE, DB_MSGROOM } from "../types/Message.types";
import { authService, dbService } from "../utils/firebase";
import { getFirestoreQuery, isLoggedIn } from "../utils/utils";
import { v4 as uuid } from "uuid";

export const MessageRoom: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [msgRoom, setMsgRoom] = useState<DB_MSGROOM | null>(null);
  const [msgs, setMsgs] = useState<DB_MESSAGE[]>([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");

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

    if (!isLoggedIn()) {
      toast.error("해당 기능은 로그인 후에 이용할 수 있습니다.");
      return;
    }

    if (input.length <= 0) {
      toast.error("메세지를 입력한 후에 전송해 주세요.");
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
    }
  }, [msgRoom]);

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
        <main className="w-full p-5 bg-gray-100">
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
                  <div
                    className={`border-2 ${
                      elem.fromUserId === authService.currentUser?.uid
                        ? "border-green-500"
                        : "border-red-500"
                    } flex justify-center items-center p-3`}
                  >
                    <FontAwesomeIcon
                      icon={faUserCircle}
                      className={`${
                        elem.fromUserId === authService.currentUser?.uid
                          ? "text-green-500"
                          : "text-red-500"
                      } text-3xl mr-3`}
                    />
                    <span>{elem.textBody}</span>
                  </div>
                </div>
              ))}
          </section>
          <form
            onSubmit={handleSubmitToCreateMsg}
            className="w-full flex mt-5 shadow-md"
          >
            <input
              onChange={(e) => setInput(e.target.value)}
              value={input}
              type={"text"}
              placeholder={"메시지를 입력해 주세요."}
              className="w-full p-5 outline-none"
            />
            <button
              type={"submit"}
              className={`text-2xl  px-12 ${
                input.length > 0 ? "bg-green-500" : "bg-gray-300"
              } transition-all`}
            >
              🔥
            </button>
          </form>
        </main>
      )}
    </div>
  );
};
