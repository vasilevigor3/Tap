"use client";

import { useEffect, useState } from "react";
import { Room } from "./types/Room";
import { Button } from "./components/ui/Button";
import { Card, CardContent } from "./components/ui/Card";
import { pick } from "lodash-es";
import { TGUser, User } from "./types/TGUser";

type MainComponentProps = {
  header: React.ReactNode;
  footer: React.ReactNode;
};

const getOrCreateUser = async (id: string, name: string) => {
  const response  = await fetch("http://localhost:8080/api/getOrCreateTGUser", {
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
    console.log("KAKOGO HUYA ONO VYPOLNJAETSA STOLKO RAZ")
    return dbUser;
};

export const MainComponent: React.FC<MainComponentProps> = ({ header, footer }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [user, setUser] = useState<TGUser | null>(null);

  getOrCreateUser("243856482","Vasya").then(dbUser => {
    console.log(dbUser);
  });

  useEffect(() => {
    function initTg() {
      if (window.Telegram && window.Telegram.WebApp) {
        const tgUser: TGUser = window?.Telegram?.WebApp?.initDataUnsafe?.user;
        const user: User = pick(tgUser, ["id", "username"]);
        setUser(user);
        return;
      }
      setTimeout(initTg, 500);
    }
    initTg();
  }, []);

  useEffect(() => {
    fetch("http://localhost:8080/api/rooms")
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        setRooms(data);
      })
      .catch((error) => console.error("Error fetching rooms:", error));
  }, []);

  return (
    <div className={`flex flex-col min-h-screen ${isDarkMode ? "dark" : ""}`}>
      {header}
      <main className="flex-1 bg-gray-100 dark:bg-gray-950 py-8 px-4 md:px-8">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-gray-950 dark:text-gray-100">Active Rooms</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {rooms.map((room) => (
              <Card
                key={room.id}
                className="bg-gray-200 dark:bg-gray-700 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-lg font-bold text-gray-950 dark:text-gray-100">{room.roomName}</div>
                    <div className="text-gray-600 dark:text-gray-400">
                      {room.players.length}/{room.maxPlayers} players
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl font-bold text-gray-950 dark:text-gray-100">${room.bet}</div>
                    <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition-colors duration-300">
                      Join
                    </Button>
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm">{room.status}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      {footer}
    </div>
  );
};
