"use client";

import { useEffect, useState } from "react";
import { TGUser, User } from "./types/TGUser";
import { Player } from "./types/Player";
import Body from "./components/Rooms";
import Header from "./components/layout/Header";
import { Room } from "./types/Room";

type MainComponentProps = {
  // header: React.ReactNode;
  footer: React.ReactNode;
};

const getOrCreateTGUser = async (id: string, name: string) => {
  const response = await fetch("http://localhost:8080/api/getOrCreateTGUser", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id,
      name
    }),
  });
  const dbUser = await response.json();
  return dbUser;
};

const getOrCreatePlayer = async (id: string) => {
  const response = await fetch("http://localhost:8080/api/getOrCreatePlayer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id
    }),
  });
  const player = await response.json();
  return player;
};

export const MainComponent: React.FC<MainComponentProps> = ({ footer }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  // const [rooms, setRooms] = useState<Room[]>([]);
  const [TGUser, setTGUser] = useState<TGUser | null>(null);
  const [player, setPlayer] = useState<Player>();
  const [rooms, setRooms] = useState<Room[]>([]);

  const fetchRooms = async () => {
    const response = await fetch("http://localhost:8080/api/getAllRooms");
    const data = await response.json();
    const filteredRooms = data.filter((room: Room) => !room.isGameStarted);
    setRooms(filteredRooms);
  };

  useEffect(() => {
    fetchRooms().catch((error) => console.error("Error fetching rooms:", error));
  }, []);

  useEffect(() => {
    function initTg() {
      if (window.Telegram && window.Telegram.WebApp) {
        const tgUserData: TGUser = window?.Telegram?.WebApp?.initDataUnsafe?.user;
        // const TGUser: User = pick(tgUserData, ["id", "username"]);
        getOrCreateTGUser("243856482", "Ryan Gosling")
        getOrCreatePlayer("243856482").then((player) => setPlayer(player))
        setTGUser(tgUserData);
        return;
      }
      setTimeout(initTg, 500);
    }
    initTg();
  }, []);

  return (
    <div className={`flex flex-col min-h-screen ${isDarkMode ? "dark" : ""}`}>
      <Header fetchRooms={fetchRooms}/>
      <Body player={player}/>
      {footer}
    </div>
  );
};
