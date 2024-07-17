"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
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
  const [winner, setWinner] = useState<Player>();

  const updateScoresMutation = api.game.updateScoresForCurrentGameAndCurrentPlayer.useMutation();

  const { data: room, isLoading: roomLoading } = api.rooms.getById.useQuery(roomId);

  // Add a check to prevent users from accessing the page if their current room is not null and does not match the roomId
  if (player?.currentRoomId !== null && player?.currentRoomId !== roomId) {
    return <div>You are not allowed to access this page.</div>;
  }

  const { mutate: finishGame } = api.rooms.finishGame();

  const timerRef = useRef<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const startTimeRef = useRef<number>(0);
  const elapsedTimeRef = useRef<number>(0);
  const gameEndedRef = useRef<boolean>(false);
  const [myBestScore, setMyBestScore] = useState<number | null>(null);
  const [bestScore, setBestScore] = useState<number | null>(null);

  const gameContainerRef = useRef<HTMLDivElement>(null);


  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {

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
          if (gameEndedRef.current) return; // Ignore clicks after the game has ended

          const x = pointer.x;
          const y = pointer.y;

          if (
            x >= objectArea.x &&
            x <= objectArea.x + objectArea.width &&
            y >= objectArea.y &&
            y <= objectArea.y + objectArea.height
          ) {
            gameEndedRef.current = true; // Mark the game as ended for this player
            const endTime = performance.now();
            const elapsedMs = Math.round(endTime - startTimeRef.current);
            console.log("Elapsed time (ms):", elapsedMs);
            setElapsedTime(elapsedMs); // Update the final time
            submitScore(elapsedMs);
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
    startTimeRef.current = performance.now();

    const updateTimer = () => {
      if (gameEndedRef.current) return; // Stop updating if the game has ended for this player

      const currentTime = performance.now();
      const elapsedMs = Math.round(currentTime - startTimeRef.current);
      setElapsedTime(elapsedMs);
      elapsedTimeRef.current = elapsedMs;
      requestAnimationFrame(updateTimer);
    };

    const animationFrameId = requestAnimationFrame(updateTimer);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };

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
      brokerURL: "ws://localhost:8080/ws",
      onConnect: () => {
        console.log("Connected to WS");

        const playerScores = new Map<string, number>();
        let timeoutId: NodeJS.Timeout;

        const determineWinner = () => {
          if (playerScores.size > 0) {
            const winningScore = Math.min(...Array.from(playerScores.values()));
            const winningPlayerId = Array.from(playerScores.entries()).find(([_, score]) => score === winningScore)?.[0];

            if (winningPlayerId === player?.id.toString()) {
              setWinner(player);

              const playersScores = room?.playerIds?.map((playerId) => ({
                [playerId.toString()]: playerId.toString() === winningPlayerId ? "1" : "0",
              })) || [];

              const finishGameProps: FinishGameProps = {
                roomId,
                playersScores,
              };
              console.log("finishGameProps:", finishGameProps);

              finishGame(finishGameProps, {
                onSuccess: (data) => {
                  console.log("Game finished successfully:", data);
                },
                onError: (error) => {
                  console.error("Failed to finish the game:", error);
                },
              });
            }

            setBestScore(winningScore);
          }
        };

        const subscription = stompClient.subscribe(`/topic/game/${room?.gameId}/scores`, (message) => {
          const update = JSON.parse(message.body);
          console.log("update:", update);

          playerScores.set(update.playerId, parseInt(update.score));

          // Clear existing timeout and set a new one
          clearTimeout(timeoutId);
          timeoutId = setTimeout(determineWinner, 10000); // 10 seconds timeout

          // If all players have submitted, determine winner immediately
          if (playerScores.size === room?.playerIds?.length) {
            clearTimeout(timeoutId);
            determineWinner();
          }
        });

        // Set initial timeout
        timeoutId = setTimeout(determineWinner, 60000); // 1 minute total game time

        return () => {
          clearTimeout(timeoutId);
          subscription.unsubscribe();
        };
      },
    });

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, [roomId, player, room, finishGame]);

  const submitScore = useCallback((score: number) => {
    if (!myBestScore || score < myBestScore) {
      setMyBestScore(score);

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
  }, [myBestScore, room?.gameId, player?.id, updateScoresMutation]);

  return (
    <div className="text-2xl font-bold text-white text-center">
      Find Fast Game

      <div ref={gameContainerRef} />
      {/* Display the timer */}
      {myBestScore == null && (
        <div className="mt-4">Time: {(elapsedTime / 1000).toFixed(3)} seconds</div>
      )}

      {myBestScore !== null && (
        <div className="mt-2">Your best time: {(myBestScore / 1000).toFixed(3)} seconds</div>
      )}

      {bestScore !== null && (
        <div className="mt-2">Best time: {(bestScore / 1000).toFixed(3)} seconds</div>
      )}

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