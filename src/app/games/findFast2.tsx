"use client";

import React, { useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import { useRouter } from "next/navigation";
import { api } from "@/app/react-query/routers";
import { FinishGameProps } from "@/types/room.types";
import { Player } from "@/types/Player";
import { Score } from "@/types/Score";
import { Room } from "@/types/room.types";
import { motion } from "framer-motion";
import { Button } from "@/app/components/ui/Button";
import { curEnv } from "@/constants/env";

type FindFastProps = {
  params: {
    room: Room;
    fetchedPlayers: Player[] | undefined;
  };
};

export const FindFastGame = (findFastProps: FindFastProps) => {
  const { data: user } = api.users.getOrCreate.useQuery();
  const { data: player } = api.players.getOrCreate(user?.id);
  const [countdown, setCountdown] = useState(3);

  const router = useRouter();
  const [gameActive, setGameActive] = useState<Boolean>(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const timerRef = useRef<number>(0);

  const room = findFastProps.params.room;
  const roomId = findFastProps.params.room.roomId.toString();
  const fetchedPlayers = findFastProps.params.fetchedPlayers;
  const [winner, setWinner] = useState<Player>();

  const { mutate: finishGame } = api.rooms.finishGame();

  const updateScoreForCurrentPlayer = async (score:number) => {
    try {
      const response = await fetch(`${curEnv}/api/updateScoresForCurrentGameAndCurrentPlayer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gameId: roomId, playerId: player?.id, score:score }),
      });

      const returnedScore: Score = await response.json();

    } catch (error) {
      console.error("Error fetching scores:", error);
    }  
  }

  const checkScoresAndDetermineWinner = async () => {
    let currentScore = timerRef.current;
    await updateScoreForCurrentPlayer(currentScore)

    try {
      const response = await fetch(`${curEnv}/api/scores`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gameId: roomId }),
      });

      const scores: { playerId: string; score: number | null }[] = await response.json();
      let currentWinner: Player | undefined;

      scores.forEach((score) => {
        if (score.score !== null && score.score > currentScore) {
          currentWinner = player
        } 
      });

      if (currentWinner) {
        setWinner(currentWinner)
        handleFinishGame(currentScore,currentWinner);
      }
    } catch (error) {
      console.error("Error fetching scores:", error);
    }
  };

  const handleFinishGame = (score:Number, winner:Player) => {
    const playersScores =
      room?.playerIds?.map((playerId) => ({
        [playerId.toString()]: playerId === winner?.id ? score.toString() : "0",
      })) || [];
      
    const finishGameProps: FinishGameProps = {
      roomId,
      playersScores,
    };

    finishGame(finishGameProps, {
      onSuccess: (data) => {
        console.log("Game finished successfully:", data);
        // Additional logic upon successful game finish
      },
      onError: (error) => {
        console.error("Failed to finish the game:", error);
        // Error handling logic
      },
    });
  };
  // Ref for the Phaser game container
  const gameContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const countdownTimer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown > 1) {
          return prevCountdown - 1;
        } else {
          clearInterval(countdownTimer);
          setGameActive(true);
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(countdownTimer);
  }, []);

  useEffect(() => {
    if (!gameContainerRef.current || !gameActive) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: gameContainerRef.current,
      scene: {
        preload,
        create,
        update,
      },
    };

    const game = new Phaser.Game(config);

    function preload(this: Phaser.Scene) {
      this.load.image("gameImage", "/puzzle.jpg");
    }

    function create(this: Phaser.Scene) {
      const image = this.add.image(400, 300, "gameImage");
      image.setInteractive();

      const objectArea = { x: 350, y: 250, width: 100, height: 100 };

      // Draw a transparent rectangle over the clickable area
      const graphics = this.add.graphics();
      graphics.lineStyle(2, 0xff0000, 1); // Red outline with 2px width
      graphics.strokeRect(objectArea.x, objectArea.y, objectArea.width, objectArea.height);

      // Start the timer
      timerRef.current = window.setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
      }, 1000);

      this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
        const x = pointer.x;
        const y = pointer.y;

        if (
          x >= objectArea.x &&
          x <= objectArea.x + objectArea.width &&
          y >= objectArea.y &&
          y <= objectArea.y + objectArea.height
        ) {
          // alert("You found the object!");
          if (timerRef.current !== null) {
            clearInterval(timerRef.current); // Stop the timer
          }
          checkScoresAndDetermineWinner();
          setGameActive(false);
        } else {
          alert("Try again!");
        }
      });
    }

    function update() {
      // Any necessary update logic
    }

    return () => {
      game.destroy(true);
      if (timerRef.current !== null) {
        clearInterval(timerRef.current); // Cleanup the timer on component unmount
      }
    };
  }, [fetchedPlayers, gameActive]);

  return (
    <div className="text-2xl font-bold text-white text-center">
      Find Fast Game
      {countdown > 0 && (
        <div>Starting in... {countdown}</div>
      )}
      {gameActive && ( <div ref={gameContainerRef}/> )}
      {gameActive && ( <div>Elapsed Time: {elapsedTime} seconds</div> )}
      {winner && !gameActive && (
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
  );
};
