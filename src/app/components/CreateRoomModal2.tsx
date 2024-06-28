// Импорты
import React, { useState } from "react";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { Player } from "../../types/Player";
import { api } from "../react-query/routers";
import { useQueryClient } from '@tanstack/react-query';

// Интерфейс пропсов для CreateRoomModal
interface CreateRoomFormProps {
  roomName: string;
  setRoomName: React.Dispatch<React.SetStateAction<string>>;
  numPlayers: string;
  setNumPlayers: React.Dispatch<React.SetStateAction<string>>;
  bet: string;
  setBet: React.Dispatch<React.SetStateAction<string>>;
  gameType: string;
  setGameType: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (event: React.FormEvent) => void;
  onClose: () => void;
}

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: Player | undefined;
}

// Компонент формы для создания комнаты
const CreateRoomForm: React.FC<CreateRoomFormProps> = ({
  roomName,
  setRoomName,
  numPlayers,
  setNumPlayers,
  bet,
  setBet,
  gameType,
  setGameType,
  handleSubmit,
  onClose,
}) => {
  return (
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
      <select
        value={gameType}
        onChange={(e) => setGameType(e.target.value)}
        className="text-gray-500 font-bold mb-4"
      >
        <option value="" disabled>Select Game Type</option>
        <option value="roulette">Roulette</option>
        <option value="FF">FindFast</option>
        <option value="KNB">Rock Paper Scissors</option>
      </select>

      <Button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
        Create
      </Button>
      <Button onClick={onClose} className="text-gray-500 hover:text-gray-700 focus:outline-none">
        Close
      </Button>
    </form>
  );
};

// Главный компонент модального окна
const CreateRoomModal2: React.FC<CreateRoomModalProps> = ({ isOpen, onClose, player }) => {
  if (!isOpen) return null;

  // Состояния для управления формой
  const [roomName, setRoomName] = useState("");
  const [numPlayers, setNumPlayers] = useState("");
  const [bet, setBet] = useState("");
  const [gameType, setGameType] = useState("");

  const queryClient = useQueryClient();
  const { mutateAsync: createRoom } = api.rooms.create.useMutation();

  // Обработчик отправки формы
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
      await createRoom(createRoomProps).then(() => {
        queryClient.invalidateQueries({ queryKey: ['rooms'] });
        onClose();
      });
    } catch (e) {
      console.error("Failed to create room", e);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-gray-500 font-bold mb-4">Create Room Form</h2>
        <CreateRoomForm
          roomName={roomName}
          setRoomName={setRoomName}
          numPlayers={numPlayers}
          setNumPlayers={setNumPlayers}
          bet={bet}
          setBet={setBet}
          gameType={gameType}
          setGameType={setGameType}
          handleSubmit={handleSubmit}
          onClose={onClose}
        />
      </div>
    </div>
  );
};

export default CreateRoomModal2;