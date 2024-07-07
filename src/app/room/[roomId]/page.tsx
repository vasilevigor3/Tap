"use client";

import { create } from "zustand";
import { Button } from "@/app/components/ui/Button";
import { api } from "@/app/react-query/routers";
import { Player } from "@/types/Player";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { Client } from '@stomp/stompjs';

type RoomPageProps = {
  params: {
    roomId: string;
  };
};

type RoomState = {
  roomId: string;
  isPlayerReady: boolean;
  isGameActive: boolean;
  winner: Player | undefined;
  setRoomId: (roomId: string) => void;
  setIsPlayerReady: (isReady: boolean) => void;
  setIsGameActive: (isActive: boolean) => void;
  setWinner: (winner: Player | undefined) => void;
};

const useRoomStore = create<RoomState>((set) => ({
  roomId: "",
  isPlayerReady: false,
  isGameActive: false,
  winner: undefined,
  setRoomId: (roomId) => set({ roomId }),
  setIsPlayerReady: (isPlayerReady) => set({ isPlayerReady }),
  setIsGameActive: (isGameActive) => set({ isGameActive }),
  setWinner: (winner) => set({ winner }),
}));

const useInactivityKicker = () => {
  const INACTIVITY_TIMEOUT_MS = 55000;
  const { isPlayerReady, roomId, isGameActive } = useRoomStore();

  const { data: player } = api.players.getOrCreate();
  const { mutate: leave } = api.rooms.leave.useMutation();
  const router = useRouter();

  useEffect(() => {
    if (!player?.id) return;
    console.log("isPlayerReady", isPlayerReady)
    console.log("isGameActive", isGameActive)
    if (!isPlayerReady) {
      const timer = setTimeout(() => {
        leave(
          { roomId, playerIds: [player.id] },
          {
            onSuccess: () => {
              toast.success("Player left the room due to inactivity.");
              router.push("/");
            },
            onError: (error) => {
              console.error("Error leaving the room due to inactivity:", error);
            },
          }
        );
      }, INACTIVITY_TIMEOUT_MS);

      return () => clearTimeout(timer);
    }
  }, [isPlayerReady, player, roomId, leave, router]);
};

const ReadyButton = () => {
  const { data: player } = api.players.getOrCreate();
  const { roomId: gameId, setIsPlayerReady } = useRoomStore();

  const { mutateAsync: sendReadyToPlay } = api.game.readyToPlay.useMutation({
    onSuccess: () => {
      setIsPlayerReady(true);
    },
  });

  const onClick = async () => {
    if (!player?.id) return;
    sendReadyToPlay({ gameId, playerId: player.id });
    // setIsPlayerReady(true);
  };

  return (
    <Button className="bg-white text-black hover:brightness-75" onClick={onClick} disabled={!player?.id}>
      Readyyyy
    </Button>
  );
};

const RoomPage = (props: RoomPageProps) => {
  const { roomId } = props.params;
  const { setRoomId, isPlayerReady, isGameActive, winner, setIsGameActive, setIsPlayerReady } = useRoomStore();
  const { data: user } = api.users.getOrCreate.useQuery();
  const { data: room, isLoading: roomLoading } = api.rooms.getById.useQuery(roomId);
  const { data: player, isLoading: loadingPlayer } = api.players.getOrCreate();
  const router = useRouter();

  const gameId = room?.gameId;

  useEffect(() => {
    setRoomId(roomId);
  }, [roomId, setRoomId]);

  useInactivityKicker();

  useEffect(() => {
    const stompClient = new Client({
      brokerURL: "http://localhost:8080/ws",
      onConnect: () => {
        console.log("Connected");

        stompClient.subscribe(`/topic/roomStatus/${roomId}`, (message) => {
          const { body } = message;
          const gameStatus = JSON.parse(body);

          if (gameStatus.status === "ready") {
            console.log("user pressed ready");
            setIsGameActive(true);

            if (room?.gameType.toString() == "FF") {
              router.push(`/game/findFast/${roomId}`);
            } else if (room?.gameType.toString() == "Roulette") {
              router.push(`/game/roulette/${roomId}`);
            } 

          } else if (gameStatus.status === "finished") {
            console.log("game finished");
            setIsGameActive(false);
            setIsPlayerReady(false);

          }
        });
      },
    });

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, [roomId, setIsGameActive, setIsPlayerReady, room]);

  if (roomLoading) return <div>Loading the room...</div>;
  if (!room) return <div>Room not found</div>;
  if (!room.isRoomFull) return <div className="text-2xl font-bold text-white text-center">Game has not started yet.</div>;

  return (
    <div className="text-2xl font-bold text-white text-center">
      {!isPlayerReady && !isGameActive && (
        <div>
          <ReadyButton />
        </div>
      )}
      {isPlayerReady && !isGameActive && (
        <div>Waiting for other players...</div>
      )}
    </div>
  );
};

export default RoomPage;
