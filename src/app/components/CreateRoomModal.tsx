// components/CreateRoomModal.tsx
import React, { useState } from "react";

import { Button } from "./ui/Button";
import { Input } from "./ui/Input";

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateRoomModal: React.FC<CreateRoomModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const [roomName, setRoomName] = useState("");
  const [numPlayers, setNumPlayers] = useState("");
  const [bet, setBet] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    // Make sure to replace 'your-api-endpoint' with the actual endpoint
    const response = await fetch("https://rare-keys-cheat.loca.lt/api/create-room", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        roomName,
        maxPlayers: parseInt(numPlayers, 10),
        bet: parseFloat(bet),
      }),
    });

    if (response.ok) {
      // Handle success, e.g., close the modal
      onClose();
    } else {
      // Handle error
      console.error("Failed to create room");
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50 ">
      <div className="bg-white p-6 rounded-lg shadow-lg ">
        <div className="flex justify-end"></div>
        <h2 className="text-gray-500 font-bold mb-4">Create Room Form</h2>
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Room Name"
            className="text-gray-500 font-bold mb-4"
            value={roomName}
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

          <Button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
            Create
          </Button>
          <Button onClick={onClose} className="text-gray-500 hover:text-gray-700 focus:outline-none ">
            Close
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateRoomModal;
