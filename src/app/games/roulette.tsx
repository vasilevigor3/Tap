"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/app/components/ui/Button";
import { api } from "@/app/react-query/routers";
import classNames from "classnames";
import { useRouter } from "next/navigation";
import { FinishGameProps } from "@/types/room.types"
import { Player } from "@/types/Player";
import { Room } from "@/types/room.types";

type RouletteProps = {
    params: {
        room: Room;
        fetchedPlayers:Player[] | undefined;
    };
};

export const RouletteGame = (rouletteProps: RouletteProps) => {
    const router = useRouter();

    const room = rouletteProps.params.room
    const roomId = rouletteProps.params.room.roomId.toString()
    const fetchedPlayers = rouletteProps.params.fetchedPlayers
    const [winner, setWinner] = useState<Player | undefined>(undefined);

    const [rouletteActive, setRouletteActive] = useState(false);
    const [countdown, setCountdown] = useState(3);
    const playersScores = room?.playerIds?.map(playerId => ({
      [playerId.toString()]: playerId.toString() === winner?.id.toString() ? "1" : "0",
    })) || [];

    const { mutate: finishGame } = api.rooms.finishGame();

    const handleFinishGame = () => {
        const finishGameProps: FinishGameProps = {
          roomId,
          playersScores,
        };
    
        finishGame(finishGameProps, {
          onSuccess: (data) => {
            console.log('Game finished successfully:', data);
            // Additional logic upon successful game finish
          },
          onError: (error) => {
            console.error('Failed to finish the game:', error);
            // Error handling logic
          }
        });
      };
    
      const startRoulette = () => {
        setRouletteActive(true);
        setTimeout(() => {
          if (fetchedPlayers && fetchedPlayers.length > 0) {
            console.log("test")
            const randomIndex = Math.floor(Math.random() * fetchedPlayers.length);
            console.log(randomIndex)
            setWinner(fetchedPlayers[randomIndex]);
            setRouletteActive(false);
            handleFinishGame();
          } else {
            console.log("No players to select a winner from.");
            setWinner(undefined);
          }
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

    return (<div>
        <h1 className="text-2xl font-bold text-white text-center">{room.gameType}</h1>
        <div className="flex flex-col items-center justify-center w-full h-[calc(100vh-12rem)] bg-[#262626] rounded-lg p-4">
            <div className="flex flex-wrap justify-center gap-4 mb-4">
                {fetchedPlayers?.map((player, index) => (
                    <motion.div
                        key={index}
                        className={classNames("w-40 h-10 flex items-center justify-center text-white rounded-lg bg-gray-500", {
                            "bg-[red]": winner?.name === player.name,
                        })}
                        animate={rouletteActive ? { backgroundColor: ["#1a1a1a", "#888", "#1a1a1a"] } : {}}
                        transition={generateRandomTransition()}
                    >
                        {player.name}
                    </motion.div>
                ))}
            </div>

            {countdown > 0 && (
                <div>Starting in... {countdown}</div>
            )
            }
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
                        Winner: <span>{winner.name}</span>
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
    );
}
