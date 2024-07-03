"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
// import { Player } from "@/types/TGUser";
import { Player } from "@/types/Player";
import { curEnv } from "@/constants/env";

// Объект players будет содержать все взаимодействия с данными игроков
export const players = {
  // Метод getOrCreate использует хук useQuery для получения или создания игрока
  getOrCreate: (userId: string, options?: UseQueryOptions<Player, Error>) =>
    useQuery<Player, Error>({
      queryKey: ["player", userId],
      queryFn: async () => await fetchOrCreatePlayer(userId),
      enabled: !!userId, // Запускать запрос только если userId определен
      ...options,
    }),
};

export const playerIds = {
  getPlayersByIds: (playerIds: number[] | undefined, options?: UseQueryOptions<Player[], Error>) =>
    useQuery<Player[], Error>({
      queryKey: ["playerIds", playerIds],
      queryFn: async () => playerIds ? await getPlayersByIds(playerIds) : [],
      enabled: !!playerIds, // Enable the query only if playerIds is not undefined
      ...options,
    }),
};


async function fetchOrCreatePlayer(userId: string): Promise<Player> {
  const response = await fetch(`${curEnv}/api/getOrCreatePlayer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: userId }),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
}

async function getPlayersByIds(playerIds: number[]): Promise<Player[]> {
  const response = await fetch(`${curEnv}/api/players`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ids: playerIds }),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
}
