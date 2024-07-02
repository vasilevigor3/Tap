"use client";

import { useMutation, MutationOptions } from "@tanstack/react-query";
import { curEnv } from "@/constants/env";
import type { Room, ReadyToPlayProps, ScoreDTO } from "@/types/room.types";


interface UpdateScoresProps {
    gameId: string;
    playerId: string;
    score: string;
}

export const game = {

    readyToPlay: {
        useMutation: (options?: MutationOptions<Room, Error, ReadyToPlayProps>) =>
            useMutation<Room, Error, ReadyToPlayProps>({
                mutationFn: async (props: ReadyToPlayProps) => {
                    const response = await fetch(`${curEnv}/api/readyToPlay`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(props),
                    });
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    return response.json();
                },
                ...options,
            }),
    },

    updateScoresForCurrentGameAndCurrentPlayer: {
        useMutation: (options?: MutationOptions<ScoreDTO, Error, UpdateScoresProps>) =>
            useMutation<ScoreDTO, Error, UpdateScoresProps>({
                mutationFn: async ({ gameId, playerId, score }: UpdateScoresProps) => {
                    const response = await fetch(`${curEnv}/api/updateScoresForCurrentGameAndCurrentPlayer`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ gameId, playerId, score }),
                    });
                    if (!response.ok) {
                        throw new Error("Failed to update score: Network response was not ok");
                    }
                    return await response.json();
                },
                ...options,
            }),
    },


};