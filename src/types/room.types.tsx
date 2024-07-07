export type Room = {
  roomId: string;
  roomName: string;
  playerIds: string[];
  maxPlayers: number;
  bet: number;
  ownerId: string;
  gameType: string;
  gameId: string;
  winnerId: string;
  playersIds: [];
  isRoomFull: boolean;
  isGameFinished: boolean;
};

export type JoinRoomProps = {
  roomId: number;
  playerIds: number[];
};

export type LeaveRoomProps = {
  roomId: string;
  playerIds: string[];
};

export type CreateRoomProps = {
  roomName: string;
  maxPlayers: number;
  bet: number;
  ownerId: number;
  gameType: string;
};

export type FinishGameProps = {
  roomId: string;
  playersScores: Record<string, string>[];
};

export type ReadyToPlayProps = {
  gameId: string;
  playerId: string;
};

export type ScoreDTO = {
  id: string;
  score: string;
  playerId: string;
  gameId: string;
};
