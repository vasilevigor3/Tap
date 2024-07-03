export type Player = {
  id: string;
  name: string;
  balance: number;
  tgUserAccountId: string;
  ownedRoomId: string;
  currentRoomId: string;
  wonGamesIds: [];
};

export type GameId = string;
