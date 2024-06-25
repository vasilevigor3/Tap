"use client";

import { curEnv } from "@/constants/env";
import { MutationOptions, useMutation, useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { JoinRoomProps, Room } from "@/types/room.types";

export const rooms = {
  getAll: {
    useQuery: (options?: UseQueryOptions<void, Error, Room[]>) =>
      useQuery<void, Error, Room[]>({
        queryKey: ["rooms"],
        queryFn: async () => {
          const response = await fetch(`${curEnv}/api/getAllRooms`);
          const data = await response.json();
        },
        ...options,
      }),
  },

  join: {
    useMutation: (options?: MutationOptions<Room, Error, JoinRoomProps>) =>
      useMutation<Room, Error, JoinRoomProps>({
        mutationFn: async (props: JoinRoomProps) => {
          const response = await fetch(`${curEnv}/api/join-room`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(props),
          });
          const roomJoined: Room = await response.json();
          return roomJoined;
        },
        ...options,
      }),
  },

  leave: {
    useMutation: (options?: MutationOptions<Room, Error, JoinRoomProps>) =>
      useMutation<Room, Error, JoinRoomProps>({
        mutationFn: async (props: JoinRoomProps) => {
          const response = await fetch(`${curEnv}/api/leave-room`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(props),
          });
          const roomLeft: Room = await response.json();
          return roomLeft;
        },
        ...options,
      }),
  },
};
