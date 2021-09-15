import React from "react";
import { DB_COMMENT, DB_ForumGroup, DB_ForumPost } from "./DBService.types";

export interface ForumDetailPostTypes {
  post: DB_ForumPost;
  forumGroup: string;
  setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
  setLoginMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface ForumPostCommentTypes {
  comment: DB_COMMENT;
  setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
  setLoginMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface ForumGroupPopUpTypes {
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  forumGroup: DB_ForumGroup[];
}
