export interface DB_UserTypes {
  uid: string;
  displayName: string | null;
  email: string | null;
}

export interface DB_Group {
  enName: string;
  korName: string;
  participants?: string[];
  posts?: string[];
}

export interface DB_POST {
  id: string;
  createdAt: number;
  creatorId?: string;
  body: string;
  comments?: string[];
  groupId?: string;
  imgUrlList: string[];
}

export interface DB_COMMENT {
  id: string;
  postID: string;
  createdAt: number;
  body: string;
  replyComments: string[];
  creatorId: string;
  imgUrlList: string[];
}
