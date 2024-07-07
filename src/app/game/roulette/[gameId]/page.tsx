"use client";

import { create } from "zustand";
import { Button } from "@/app/components/ui/Button";
import { api } from "@/app/react-query/routers";
import { Player } from "@/types/Player";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { Client } from '@stomp/stompjs';
import { FindFastGame } from '@/app/games/findFast'; // Add this import
import { RouletteGame } from '@/app/games/roulette'; // Add this import

type GamePageProps = {
    params: {
      gameId: string;
    };
  };

  type RouletteProps = {
    params: {
        room: Room;
        fetchedPlayers: Player[] | undefined;
    };
};

const GamePage = (props: GamePageProps) => {
 
    return (
        <div>
          <RouletteGame params={{ room: null, fetchedPlayers: null }} />
        </div>
    )
}

export default GamePage;