"use client";

import { curEnv } from "@/constants/env";
import { MutationOptions, useMutation, useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { JoinRoomProps, LeaveRoomProps, CreateRoomProps, FinishGameProps, Room } from "@/types/room.types";
import type { Player } from "@/types/Player";

export const rooms = {
  getById: {
    useQuery: (roomId: string, options?: UseQueryOptions<Room, Error>) =>
      useQuery<Room, Error>({
        queryKey: ["rooms", roomId],
        queryFn: async () => {
          const response = await fetch(`${curEnv}/api/room/${roomId}`);
          const data = await response.json();
          return data;
        },
        ...options,
      }),
  },

  getAll: {
    useQuery: (options?: UseQueryOptions<void, Error, Room[]>) =>
      useQuery<void, Error, Room[]>({
        queryKey: ["rooms"],
        queryFn: async () => {
          const response = await fetch(`${curEnv}/api/getAllRooms`);
          const data = await response.json();
          return data;
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
    useMutation: (options?: MutationOptions<Room, Error, LeaveRoomProps>) =>
      useMutation<Room, Error, LeaveRoomProps>({
        mutationFn: async (props: LeaveRoomProps) => {
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

  create: {
    useMutation: (options?: MutationOptions<Room, Error, CreateRoomProps>) =>
      useMutation<Room, Error, CreateRoomProps>({
        mutationFn: async (props: CreateRoomProps) => {
          const response = await fetch(`${curEnv}/api/create-room`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(props),
          });
          console.log(JSON.stringify(props))
          const roomLeft: Room = await response.json();
          return roomLeft;
        },
        ...options,
      }),
  },

  finishGame: () => useMutation<Player[], Error, FinishGameProps>({
    mutationKey: ['finishGame'],
    mutationFn: async (finishGameProps: FinishGameProps) => {
      const response = await fetch(`${curEnv}/api/finish-game`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finishGameProps),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  }),
};