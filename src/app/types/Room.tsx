export type Room = {
  id: number;
  roomName: string;
  players: [Player];
  maxPlayers: number;
  bet: number;
  status: string;
};
