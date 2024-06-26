"use client";

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
// import { Player } from "@/types/TGUser";
import { Player } from "@/types/Player";
import { curEnv } from "@/constants/env";

// Объект players будет содержать все взаимодействия с данными игроков
export const players = {
  // Метод getOrCreate использует хук useQuery для получения или создания игрока
  getOrCreate: (userId: string | undefined, options?: UseQueryOptions<Player, Error>) => 
    useQuery<Player, Error>({
      queryKey: ['player', userId],
      queryFn: () => fetchOrCreatePlayer(userId!),
      enabled: !!userId, // Запускать запрос только если userId определен
      ...options,
    }),
};

// Функция для выполнения запроса создания или получения игрока
async function fetchOrCreatePlayer(userId: string): Promise<Player> {
  const response = await fetch(`${curEnv}/api/getOrCreatePlayer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: userId }),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
}