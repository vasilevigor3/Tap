"use client";

import { useMutation, MutationOptions } from "@tanstack/react-query";
import { curEnv } from "@/constants/env";
import type { Room, ReadyToPlayProps } from "@/types/room.types"; 

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

};