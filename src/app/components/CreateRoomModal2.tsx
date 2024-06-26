// components/CreateRoomModal.tsx
import React, { useState } from "react";

import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Player } from "../../types/Player";
import { Room } from "../../types/room.types";
import { curEnv } from "@/constants/env";
import { api } from "../react-query/routers";

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: Player | undefined;
}

const CreateRoomModal2: React.FC<CreateRoomModalProps> = ({ isOpen, onClose, player }) => {
  if (!isOpen) return null;
  const [roomName, setRoomName] = useState("");
  const [numPlayers, setNumPlayers] = useState("");
  const [bet, setBet] = useState("");
  const [gameType, setGameType] = useState("");
  const [rooms, setRooms] = useState<Room[]>([]);



  const CreateRoomForm = () => {
    const { mutateAsync: createRoom } = api.rooms.create.useMutation();

    const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();

      if (!player?.id) {
        console.error("Player ID is undefined");
        return;
      }

      const createRoomProps = {
        roomName,
        maxPlayers: parseInt(numPlayers, 10),
        bet: parseFloat(bet),
        ownerId: player.id, 
        gameType,
      };
      
      try {
        createRoom(createRoomProps);
        //todo why it don't close
        //todo how to fetch rooms after modal closing
        onClose();
      } catch (e) {
        console.error("Failed to create room", e);
      }
    };

    return (
      <form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Room Name"
            className="text-gray-500 font-bold mb-4"
            value={roomName}
            //todo why it is blocking input
            onChange={(e) => setRoomName(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Number of Players"
            className="text-gray-500 font-bold mb-4"
            value={numPlayers}
            onChange={(e) => setNumPlayers(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Bet"
            className="text-gray-500 font-bold mb-4"
            value={bet}
            onChange={(e) => setBet(e.target.value)}
          />
          <select
            value={gameType}
            onChange={(e) => setGameType(e.target.value)}
            className="text-gray-500 font-bold mb-4"
          >
            <option value="" disabled>
              Select Game Type
            </option>
            <option value="roulette">Roulette</option>
            {/* Add more game types as needed */}
          </select>

          <Button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
            Create
          </Button>
          <Button onClick={onClose} className="text-gray-500 hover:text-gray-700 focus:outline-none ">
            Close
          </Button>
        </form>
    )
  }

  
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50 ">
      <div className="bg-white p-6 rounded-lg shadow-lg ">
        <div className="flex justify-end"></div>
        <h2 className="text-gray-500 font-bold mb-4">Create Room Form</h2>
        <CreateRoomForm />
      </div>
    </div>
  );
};

export default CreateRoomModal2;
