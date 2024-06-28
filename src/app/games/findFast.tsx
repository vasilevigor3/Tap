"use client";
import { useState } from "react";
import { api } from "@/app/react-query/routers";
import { useRouter } from "next/navigation";
import { FinishGameProps } from "@/types/room.types"
import { Player } from "@/types/Player";
import { Room } from "@/types/room.types";

type FindFastProps = {
    params: {
        room: Room;
        fetchedPlayers: Player[] | undefined;
    };
};

export const FindFastGame = (findFastProps: FindFastProps) => {
    const router = useRouter();

    const room = findFastProps.params.room
    const roomId = findFastProps.params.room.roomId.toString()
    const fetchedPlayers = findFastProps.params.fetchedPlayers
    const [winner, setWinner] = useState<Player | undefined>(undefined);

    const { mutate: finishGame } = api.rooms.finishGame();

    const handleFinishGame = () => {
        const playersScores = room?.playerIds?.map(playerId => ({
            [playerId.toString()]: playerId.toString() === winner?.id.toString() ? "1" : "0",
        })) || [];

        const finishGameProps: FinishGameProps = {
            roomId,
            playersScores,
        };

        finishGame(finishGameProps, {
            onSuccess: (data) => {
                console.log('Game finished successfully:', data);
                // Additional logic upon successful game finish
            },
            onError: (error) => {
                console.error('Failed to finish the game:', error);
                // Error handling logic
            }
        });
    };

    return (<div className="text-2xl font-bold text-white text-center">
        Find Fast Game
    </div>
    );
}
