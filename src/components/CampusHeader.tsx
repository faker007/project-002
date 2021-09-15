import {
  faChevronRight,
  faEllipsisV,
  faPlus,
  faShare,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { CampusHeaderTypes, CampusTab } from "../types/CampusHeader.types";
import { routes } from "../utils/constants";

export const CampusHeader: React.FC<CampusHeaderTypes> = ({
  campus,
  groupIns,
  tab,
}) => {
  return (
    <>
      <section>
        <Link
          className="hover:opacity-70 transition-opacity mr-2"
          to={routes.home}
        >
          홈
        </Link>
        <FontAwesomeIcon className="mr-2 text-gray-500" icon={faChevronRight} />
        <Link
          className="hover:opacity-70 transition-opacity mr-2"
          to={routes.campus}
        >
          그룹 목록
        </Link>
        <FontAwesomeIcon className="mr-2 text-gray-500" icon={faChevronRight} />
        <Link
          className="hover:opacity-70 transition-opacity"
          to={routes.campusDetail(campus)}
        >
          {groupIns.korName}
        </Link>
      </section>
      <section className="mt-5 bg-blue-300 h-64 "></section>
      <section className="border-b py-5 border-black flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">{groupIns["korName"]}</h2>
          <h2>공개·회원 {groupIns.participants?.length}명</h2>
        </div>
      </section>
      <section className="text-lg  px- border-b border-black flex items-center">
        <Link
          to={routes.campusDetail(campus)}
          className={`cursor-pointer p-4 py-3 mr-10 border-b-2  ${
            tab === CampusTab.detail && "border-blue-500"
          }`}
        >
          그룹활동
        </Link>
      </section>
    </>
  );
};
