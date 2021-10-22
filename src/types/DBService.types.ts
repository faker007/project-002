export interface DB_UserTypes {
  uid: string;
  displayName: string | null;
  email: string | null;
  msgRoomIds: string[];
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
  likes?: string[];
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

export interface DB_ForumGroup {
  enName: string;
  korName: string;
  posts: string[];
  views: number;
}

export interface DB_ForumPost {
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

export interface DB_MESSAGE {
  fromUserId: string;
  toUserId: string;
  textBody: string;
  id: string;
  createdAt: number;
}

export interface DB_MSGROOM {
  id: string;
  participantIds: string[];
  msgIds: string[];
  createdAt: number;
}
