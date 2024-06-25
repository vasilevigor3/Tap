"use client";

import { curEnv } from "@/constants/env";
import { Player } from "@/types/TGUser";
import { type MutationOptions, useMutation } from "@tanstack/react-query";

export const players = {
  getOrCreate: {
    useMutation: (options?: MutationOptions<Player, Error, string>) =>
      useMutation<Player, Error, string>({
        mutationFn: async (userId: string) => {
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
