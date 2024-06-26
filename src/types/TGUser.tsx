export type TGUser = {
  id: string;
  username: string;
};

export type TGUserResponse = {
  initDataUnsafe?: {
    user?: {
      id: number | null;
      username: string | null;
    };
  };
};

export type User = {
  id: string;
  name: string;
  playerId: string | null;
};

export type Player = {
  id: number;
  name: string;
  balance: number;
  tgUserAccountId: number;
  ownedRoomId: number;
  currentRoomId: number;
  wonGamesIds: number[];
};

//TODO: huli zdes i room i player?
export type Room = {
  id: number;
  roomName: string;
  maxPlayers: number;
  bet: number;
  ownerId: number;
  gameType: string;
  winnerId: number | null;
  playerIds: number[];
  isGameStarted: boolean;
  isGameFinished: boolean;
};
