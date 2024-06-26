"use client";

import { curEnv } from "@/constants/env";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { TGUser, User } from "@/types/TGUser";

const mockUser: TGUser = {
  id: "123",
  username: "Ryan Gosling",
};

export const users = {
  getOrCreate: {
    useQuery: (options?: UseQueryOptions<void, Error, User>) =>
      useQuery<void, Error, User>({
        queryKey: ["user"],
        queryFn: async () => {
          const telegramUser = window?.Telegram?.WebApp?.initDataUnsafe?.user ?? mockUser;

          const response = await fetch(`${curEnv}/api/getOrCreateTGUser`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: telegramUser.id,
              name: telegramUser.username,
            }),
          });

          const user = await response.json();

          return user;
        },
        ...options,
      }),
  },
};
