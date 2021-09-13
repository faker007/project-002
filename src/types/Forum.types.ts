import React from "react";
import { DB_COMMENT } from "./DBService.types";

export interface ForumGroupTypes {
  enName: string;
  korName: string;
  posts: string[];
  views: number;
}

export interface ForumPostTypes {
  body: string;
  comments: string[];
  createdAt: number;
  creatorId: string;
  forumGroupId: string;
  id: string;
  views: number;
  title: string;
  imgUrlList: string[];
}

export interface ForumDetailPostTypes {
  post: ForumPostTypes;
  forumGroup: string;
  setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
  setLoginMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface ForumPostCommentTypes {
  comment: DB_COMMENT;
  setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
  setLoginMode: React.Dispatch<React.SetStateAction<boolean>>;
}
