"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/app/components/ui/Button";
import { api } from "@/app/react-query/routers";
import classNames from "classnames";
import { useRouter } from "next/navigation";

// setrouletteFinneshed(true); 21
// exit button post /finish-game + get /allRooms
// start auto game 3.2.1...

type PageProps = {
  params: {
    roomId: string;
  };
};

const GameAreaPage = (props: PageProps) => {
  const roomId = props.params.roomId;
  const [winner, setWinner] = useState<string | null>(null);
  const [rouletteActive, setRouletteActive] = useState(false);
  // const [rouletteFineshed, setrouletteFineshed] = useState(false);
  const router = useRouter();
  const [countdown, setCountdown] = useState(3);

  const { data: room } = api.rooms.getById.useQuery(roomId);
  //TODO: some check if user/player could see this page
  const { data: fetchedPlayers } = api.playerIds.getPlayersByIds(room?.playerIds);
  const playerNames: string[] = fetchedPlayers ? fetchedPlayers?.map(player => player.name) : [];

  const startRoulette = () => {
    setRouletteActive(true);
    const randomIndex = Math.floor(Math.random() * playerNames.length);
    setTimeout(() => {
      setWinner(playerNames[randomIndex]);
      setRouletteActive(false);
      // setrouletteFineshed(true);
      //send /finish-game
    }, 3000); // 5 seconds animation
  };

  const generateRandomTransition = () => ({
    duration: Math.random() * 0.5 + 0.5, // Random duration between 0.5 and 1 second
    repeat: Infinity,
    repeatType: "mirror" as const, // Ensure repeatType is a valid literal type
    delay: Math.random() * 0.5, // Random delay up to 0.5 seconds
  });

  useEffect(() => {
    // Initiate countdown upon component mount
    const countdownTimer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown > 1) {
          return prevCountdown - 1;
        } else {
          clearInterval(countdownTimer);
          startRoulette(); // Start the roulette after countdown finishes
          return 0;
        }
      });
    }, 1000); // Decrements the countdown every second

    return () => clearInterval(countdownTimer); // Cleanup interval on component unmount
  }, [fetchedPlayers]);

  if (!room?.isGameStarted) return <div className="text-2xl font-bold text-white text-center">Game has not started yet.</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#1a1a1a] bg-[url('/texture.svg')] bg-repeat p-4">
      <div className="flex flex-col items-center gap-8 w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-white text-center">Roulette</h1>
        <div className="flex flex-col items-center justify-center w-full h-[calc(100vh-12rem)] bg-[#262626] rounded-lg p-4">

          {/* <div className="text-white text-4xl font-bold text-center mb-4">Game Area</div> */}
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            {playerNames.map((player, index) => (
              <motion.div
                key={index}
                className={classNames("w-40 h-10 flex items-center justify-center text-white rounded-lg bg-gray-500", {
                  "bg-[red]": winner === player,
                })}
                animate={rouletteActive ? { backgroundColor: ["#1a1a1a", "#888", "#1a1a1a"] } : {}}
                transition={generateRandomTransition()}
              >
                {player}
              </motion.div>
            ))}
          </div>
          
          {countdown > 0 && (
            <div>Starting in... {countdown}</div>
          )
          }


          {/* {!rouletteFineshed && (
            <Button variant="outline" size="lg" className="text-white" onClick={startRoulette}>
              Start Roulette
            </Button>
          )} */}
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
                <Button variant="outline" size="lg" className="text-white" onClick={() => router.push(`/`)}>
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
