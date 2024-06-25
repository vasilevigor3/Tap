"use client";

import { Button } from "./ui/Button";
import { Card, CardContent } from "./ui/Card";
import { api } from "../react-query/routers";

const JoinRoomButton = (props: { roomId: number, }) => {
  const { mutateAsync: joinRoom } = api.rooms.join.useMutation();
  const { data:user } = api.users.getOrCreate.useQuery();
  const { data: player } = api.players.getOrCreate.useQuery(user?.id);

  const { roomId } = props;

  return (
    <Button
      className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition-colors duration-300"
      onClick={() => joinRoom({ roomId, playerIds: [player.id] })}
    >
      Join
    </Button>
  );
};

const LeaveRoomButton = (props: { roomId: number }) => {
  const { mutateAsync: leaveRoom } = api.rooms.leave.useMutation();
  const { data:user } = api.users.getOrCreate.useQuery();
  const { data: player } = api.players.getOrCreate.useQuery(user?.id);

  const { roomId } = props;

  return (
    <Button
      className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition-colors duration-300"
      onClick={() => leaveRoom({ roomId, playerIds: [player.id] })}
    >
      Leave
    </Button>
  );
};


//todo 61 is not updated {room.playerIds.length}/{room.maxPlayers} players
export const AllRooms = () => {
  const { data: rooms } = api.rooms.getAll.useQuery();
  const filteredRooms = rooms?.filter((room) => !room.isGameStarted);

  return (
    <main className="flex-1 bg-gray-100 dark:bg-gray-950 py-8 px-4 md:px-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-950 dark:text-gray-100">Active Rooms</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredRooms?.map((room) => (
            <Card
              key={room.roomId}
              className="bg-gray-200 dark:bg-gray-700 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-lg font-bold text-gray-950 dark:text-gray-100">{room.roomName}</div>
                  <div className="text-gray-600 dark:text-gray-400">
                    {room.playerIds.length}/{room.maxPlayers} players
                  </div>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl font-bold text-gray-950 dark:text-gray-100">${room.bet}</div>
                  <JoinRoomButton roomId={room.roomId} />
                  <LeaveRoomButton roomId={room.roomId} />
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-sm">{room.gameType}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
};
