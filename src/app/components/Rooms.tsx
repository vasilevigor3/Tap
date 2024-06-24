"use client";

import { useEffect, useState } from "react";
import { Room } from "../types/Room";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { TGUser, User } from "../types/TGUser";
import { Player } from "../types/Player";
import GameComponent from "../gameArea"; // Adjust the import path as needed

type BodyProps = {
  player: Player | undefined;
};

export default function Body({ player }: BodyProps) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null); // To store the current room

  const fetchRooms = async () => {
    const response = await fetch("http://localhost:8080/api/getAllRooms");
    const data = await response.json();
    const filteredRooms = data.filter((room: Room) => !room.isGameStarted);
    setRooms(filteredRooms);
  };

  const joinRoom = async (roomId: number) => {
    if (!player) {
      console.error("Player data is not available");
      return;
    }

    const response = await fetch("http://localhost:8080/api/join-room", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: roomId,
        playerIds: [player.id],
      }),
    });

    if (!response.ok) {
      console.error("Failed to join the room");
      return;
    }

    const result = await response.json();

    if (result.isGameStarted) {
      setCurrentRoom(result);
    } else {
      fetchRooms();
    }
    console.log("Joined room successfully:", result);
  };

  const leaveRoom = async (roomId: number) => {
    if (!player) {
      console.error("Player data is not available");
      return;
    }

    const response = await fetch("http://localhost:8080/api/leave-room", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: roomId,
        playerIds: [player.id],
      }),
    });

    if (!response.ok) {
      console.error("Failed to leave the room");
      return;
    }

    const result = await response.json();
    fetchRooms();
    console.log("Leaved room successfully:", result);
  };

  useEffect(() => {
    fetchRooms().catch((error) => console.error("Error fetching rooms:", error));
  }, []);

  if (currentRoom && currentRoom.isGameStarted) {
    return <GameComponent />;
  }

  return (
    <main className="flex-1 bg-gray-100 dark:bg-gray-950 py-8 px-4 md:px-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-950 dark:text-gray-100">Active Rooms</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {rooms.map((room) => (
            <Card
              key={room.id}
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
                  <Button
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition-colors duration-300"
                    onClick={() => joinRoom(room.id)}
                  >
                    Join
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition-colors duration-300"
                    onClick={() => leaveRoom(room.id)}
                  >
                    Leave
                  </Button>
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-sm">{room.gameType}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
