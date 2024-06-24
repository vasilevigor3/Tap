export type Room = {
  id: number;
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
