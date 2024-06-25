export type Room = {
  roomId: number;
  roomName: string;
  playerIds: [number];
  maxPlayers: number;
  bet: number;
  ownerId: string;
  gameType: string;
  winnerId: string;
  playersIds: [];
  isGameStarted: [];
  isGameFinished: [];
};

export type JoinRoomProps = {
  roomId: number;
  playerIds: number[];
};

export type LeaveRoomProps = {
  roomId: number;
  playerIds: number[];
};

export type CreateRoomProps = {
  roomId: number;
  roomName: string;
  maxPlayers: number;
  bet: number;
  ownerId: string;
  gameType: string;
}
