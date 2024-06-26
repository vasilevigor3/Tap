"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/app/components/ui/Button";

//todo plyers fetch from get room
// setrouletteFinneshed(true); 21
// exit button post /finish-game + get /allRooms
// start auto game 3.2.1...
const players = ["Ryan Gosling", "Player 2", "Player 3", "Player 4", "Player 5", "Player 6", "Player 7", "Player 8"];

const GameAreaPage = () => {
  const [winner, setWinner] = useState<string | null>(null);
  const [rouletteActive, setRouletteActive] = useState(false);
  const [rouletteFinneshed, setrouletteFinneshed] = useState(false);

  const startRoulette = () => {
    setRouletteActive(true);
    const randomIndex = Math.floor(Math.random() * players.length);
    setTimeout(() => {
      setWinner(players[randomIndex]);
      setRouletteActive(false);
      // setrouletteFinneshed(true);
    }, 5000); // 5 seconds animation
  };

  const generateRandomTransition = () => ({
    duration: Math.random() * 0.5 + 0.5, // Random duration between 0.5 and 1 second
    repeat: Infinity,
    repeatType: "mirror" as const, // Ensure repeatType is a valid literal type
    delay: Math.random() * 0.5, // Random delay up to 0.5 seconds
  });
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#1a1a1a] bg-[url('/texture.svg')] bg-repeat p-4">
      <div className="flex flex-col items-center gap-8 w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-white text-center">Roulette</h1>
        <div className="flex flex-col items-center justify-center w-full h-[calc(100vh-12rem)] bg-[#262626] rounded-lg p-4">
          {/* <div className="text-white text-4xl font-bold text-center mb-4">Game Area</div> */}
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            {players.map((player, index) => (
              <motion.div
                key={index}
                className={`w-40 h-10 flex items-center justify-center text-white rounded-lg ${
                  winner === player ? "bg-gray-500" : "bg-[#262626]"
                }`}
                animate={rouletteActive ? { backgroundColor: ["#1a1a1a", "#888", "#1a1a1a"] } : {}}
                transition={generateRandomTransition()}
              >
                {player}
              </motion.div>
            ))}
          </div>
          {!rouletteFinneshed && (
            <Button variant="outline" size="lg" className="text-white" onClick={startRoulette}>
              Start Roulette
            </Button>
          )}
          <AnimatePresence>
            {rouletteActive && (
              <motion.div
                className="text-white text-4xl font-bold mt-4"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.5 }}
              >
                Spinning...
              </motion.div>
            )}
          </AnimatePresence>
          {winner && !rouletteActive && (
            <motion.div
              className="text-white text-4xl font-bold mt-4"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-wrap justify-center mb-4">
                Winner: <span>{winner}</span>
              </div>
              <div className="flex flex-wrap justify-center mb-4">
                <Button variant="outline" size="lg" className="text-white">
                  Exit Room
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameAreaPage;
