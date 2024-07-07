"use client";

import React, { useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import { useRouter } from "next/navigation";
import { api } from "@/app/react-query/routers";
import { FinishGameProps } from "@/types/room.types";
import { Player } from "@/types/Player";
import { motion } from "framer-motion";
import { Button } from "@/app/components/ui/Button";
import { Client } from "@stomp/stompjs";

type FindFastProps = {
  params: {
    roomId: string;
  };
};

//MAKE A BIG CHECK IF USER COULD ENTER A ROOM IF HE IS NOT PLAYER OF THE ROOM

export const FindFastGame = (findFastProps: FindFastProps) => {
  const roomId = findFastProps.params.roomId;

  const router = useRouter();

  const { data: user } = api.users.getOrCreate.useQuery();
  const { data: player } = api.players.getOrCreate(user?.id);
  // console.log("user", player?.id);
  const [winner, setWinner] = useState<Player>();

  const updateScoresMutation = api.game.updateScoresForCurrentGameAndCurrentPlayer.useMutation();

  const { data: room, isLoading: roomLoading } = api.rooms.getById.useQuery(roomId);
  // console.log("room", room);




  const { mutate: finishGame } = api.rooms.finishGame();

  const timerRef = useRef<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  const gameContainerRef = useRef<HTMLDivElement>(null);


  const [bestTime, setBestTime] = useState(null);
  const [myBestTime, setMyBestTime] = useState(0);


  const gameRef = useRef<Phaser.Game | null>(null);
  // console.log("gameId1:", room?.gameId.toString());
  // console.log("playerId1:", player?.id.toString());


  useEffect(() => {
    // console.log("gameId2:", room.gameId);
    // console.log("playerId2:", player?.id.toString());

    const loadGame = () => {
      if (!gameContainerRef.current || gameRef.current) return;

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

      gameRef.current = new Phaser.Game(config);

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
              console.log("timerRef.current:", timerRef.current);
              const elapsedTimeInSeconds = elapsedTime;
              console.log("elapsedTimeInSeconds:", elapsedTimeInSeconds);
              submitScore(timerRef.current);
            }
          } else {
            alert("Try again!");
          }
        });
      }

      function update() {
        // Any necessary update logic
      }

      return () => {
        gameRef.current?.destroy(true);
        if (timerRef.current !== null) {
          clearInterval(timerRef.current); // Cleanup the timer on component unmount
        }
      };
    };

    loadGame();
    if (timerRef.current === 0) {
      timerRef.current = window.setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
      }, 1000);
    }

  }, [room, player]);


  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        // Reset the reference to 0 for future validations
        timerRef.current = 0;
      }
    };
  }, []);

  useEffect(() => {
    const stompClient = new Client({
      brokerURL: "ws://localhost:8080/ws", // Ensure this matches your actual WebSocket server
      onConnect: () => {
        console.log("Connected to WS");

        stompClient.subscribe(`/topic/game/${roomId}/scores`, (message) => {
          // console.log(message)
          const update = JSON.parse(message.body);

          // console.log(message.body)
          // If the received score is better than the current best, update it
          if (!bestTime || update.score < bestTime) {
            setBestTime(update.score);

            console.log("update.score:", update.score);
            console.log("bestTime:", bestTime);

            if (update.playerId === player?.id.toString()) {
              // This player has the best score

              setWinner(player); // Ensure you have logic to appropriately determine and display the winner
              // console.log("winner:", winner);
              // console.log("player:", player);
              console.log("room?.playerIds:", room?.playerIds);

              const playersScores =
                room?.playerIds?.map((playerId) => ({
                  [playerId.toString()]: playerId.toString() === player?.id.toString() ? "1" : "0",
                })) || [];

              const finishGameProps: FinishGameProps = {
                roomId,
                playersScores,
              };
              console.log("finishGameProps:", finishGameProps);

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
            }
          }
        });
      },
    });

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, [roomId, player, bestTime]);

  const submitScore = (score: number) => {
    if (!myBestTime || score < myBestTime) {
      setMyBestTime(score);
      console.log("gameIdSubmit:", room?.gameId);
      console.log("playerIdSubmit:", player?.id.toString());

      updateScoresMutation.mutate(
        {
          gameId: room?.gameId.toString(),
          playerId: player?.id.toString(),
          score: score.toString(),
        },
        {
          onSuccess: (data) => {
            console.log("Score updated successfully", data);
          },
          onError: (error) => {
            console.error("Failed to update score:", error);
          },
        }
      );
    }
  };

  return (
    <div className="text-2xl font-bold text-white text-center">
      Find Fast Game

      <div ref={gameContainerRef} />
      {/* Display the timer */}
      <div className="mt-4">Time: {elapsedTime} seconds</div>

      {winner && (
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
