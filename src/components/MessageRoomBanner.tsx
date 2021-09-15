import { getDocs } from "@firebase/firestore";
import { faComment } from "@fortawesome/free-regular-svg-icons";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { DB_UserTypes } from "../types/DBService.types";
import { MessageRoomBannerTypes } from "../types/Message.types";
import { routes } from "../utils/constants";
import { authService } from "../utils/firebase";
import { getFirestoreQuery } from "../utils/utils";

export const MessageRoomBanner: React.FC<MessageRoomBannerTypes> = ({
  msgRoom: { msgIds, id, createdAt, participantIds },
}) => {
  const [opponentUser, setOpponentUser] = useState<DB_UserTypes | null>(null);
  const [loading, setLoding] = useState(false);
  const history = useHistory();

  const loadOpponentUser = async () => {
    try {
      const opponentUserId = participantIds.filter(
        (elem) => elem !== authService.currentUser?.uid
      )[0];
      const q = getFirestoreQuery("user", "uid", opponentUserId);
      const result = await getDocs(q);

      for (const item of result.docs) {
        if (item.exists()) {
          setOpponentUser({
            displayName: item.get("displayName"),
            email: item.get("email"),
            msgRoomIds: item.get("msgRoomIds"),
            uid: item.get("uid"),
          });
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoding(false);
    }
  };

  const handleClickToMoveMsgRoom = () => {
    history.push(routes.messageRoom(id));
  };

  useEffect(() => {
    setLoding(true);
    loadOpponentUser();
  }, []);

  return (
    <div
      onClick={handleClickToMoveMsgRoom}
      className="w-full rounded-2xl border border-gray-300 p-5  hover:bg-green-500 hover:text-white hover:border-green-500 transition-all cursor-pointer mb-5"
    >
      {loading ? (
        <div className="w-full text-center">
          <FontAwesomeIcon
            icon={faCircleNotch}
            className="text-3xl text-blue-500 animate-spin"
          />
        </div>
      ) : (
        <div className="w-full flex items-center justify-between">
          <h1>{opponentUser?.email}님과의 대화</h1>
          <div className="flex items-center">
            <FontAwesomeIcon
              icon={faComment}
              className="text-2xl text-green-600 mr-2"
            />
            <span>{msgIds.length}</span>
          </div>
        </div>
      )}
    </div>
  );
};
