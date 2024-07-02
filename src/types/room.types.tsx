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
  isRoomFull: boolean;
  isGameFinished: boolean;
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
  roomName: string;
  maxPlayers: number;
  bet: number;
  ownerId: number;
  gameType: string;
}

export type FinishGameProps = {
  roomId: string;
  playersScores: Record<string, string>[];
}

export type ReadyToPlayProps = {
  gameId: string;
  playerId: string;
};