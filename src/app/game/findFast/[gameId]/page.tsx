"use client";

import { create } from "zustand";
import { Button } from "@/app/components/ui/Button";
import { api } from "@/app/react-query/routers";
import { Player } from "@/types/Player";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { Client } from '@stomp/stompjs';
import { FindFastGame } from '@/app/games/findFast';

type GamePageProps = {
    params: {
      gameId: string;
    };
  };

const GamePage = (props: GamePageProps) => {
  const { gameId } = props.params;



  console.log("roomId:", gameId);
 
    return (
        <div>
            <FindFastGame params={{ roomId: gameId }} />
        </div>
    )
}

export default GamePage;