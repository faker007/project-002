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

export interface MessageRoomBannerTypes {
  msgRoom: DB_MSGROOM;
}
