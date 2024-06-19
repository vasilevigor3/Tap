"use client"

import { SVGProps, useEffect, useState } from "react"
import { Card, CardContent } from './components/ui/Card';
import { Button } from "./components/ui/Button";


type MainComponentProps = {
  header: React.ReactNode;
  footer: React.ReactNode;
};

export const MainComponent: React.FC<MainComponentProps> = ({header, footer }) => {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [rooms, setRooms] = useState<Room[]>([]);
  const [tg, setTg] = useState(null); 
  // const [TGUser, setTGUser] = useState(null); 
  const [tgUser, setTGUser] = useState<TGUser | null>(null);

  useEffect(() => {
    console.log('useTelegram');
    function initTg() {
      if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
        console.log('Telegram WebApp is set');
        const tgData = window.Telegram.WebApp;
        setTg(tgData);
        
        setTGUser(tgData.initDataUnsafe.user)
      } else {
        console.log('Telegram WebApp is undefined, retrying…');
        setTimeout(initTg, 500);
      }
    }
    initTg();
  }, []);


  console.log(tgUser)



  useEffect(() => {
    fetch('https://rare-keys-cheat.loca.lt/api/rooms')
      .then(response => response.json())
      .then(data => {
        console.log(data)
        setRooms(data)
      })
      .catch(error => console.error('Error fetching rooms:', error));
  }, []);

  return (
    
    <div className={`flex flex-col min-h-screen ${isDarkMode ? "dark" : ""}`}>
      {header}
      <main className="flex-1 bg-gray-100 dark:bg-gray-950 py-8 px-4 md:px-8">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-gray-950 dark:text-gray-100">Active Rooms</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {rooms.map(room => (
              <Card key={room.id} className="bg-gray-200 dark:bg-gray-700 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-lg font-bold text-gray-950 dark:text-gray-100">{room.roomName}</div>
                    <div className="text-gray-600 dark:text-gray-400">{room.players.length}/{room.maxPlayers} players</div>
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
  )
}