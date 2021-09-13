import { DB_COMMENT, DB_POST } from "./DBService.types";

export interface CampusDetailUseParamsTypes {
  campus: string;
}

export interface CampusDetailPopupTypes {
  mode: boolean;
  setMode: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: boolean;
  setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
  group: string;
  groupId: string;
}

export interface CampusDetailPostTypes {
  post: DB_POST;
  loginMode: boolean;
  setLoginMode: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: boolean;
  setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface CampusDetailCommentTypes {
  comment: DB_COMMENT;
  isLast: boolean;
  refetch: boolean;
  setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
}
