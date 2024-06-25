"use client";

import { curEnv } from "@/constants/env";
import { Player } from "@/types/TGUser";
import { type MutationOptions, useMutation, useQuery } from "@tanstack/react-query";

export const players = {
  getOrCreate: {
    useQuery: (userId:string | undefined, options?: MutationOptions<Player, Error, string>) =>
      useQuery<Player | {}, Error, string>({
        queryKey: ["player"],
        queryFn: async () => {
          if (!userId) return {};

          const response = await fetch(`${curEnv}/api/getOrCreatePlayer`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: userId,
            }),
          });

          const player: Player = await response.json();
          return player;
        },
        ...options,
      }),
  },
};
