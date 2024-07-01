"use client";

import React, { useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import { useRouter } from "next/navigation";
import { api } from "@/app/react-query/routers";
import { FinishGameProps } from "@/types/room.types";
import { Player } from "@/types/Player";
import { Room } from "@/types/room.types";

type FindFastProps = {
  params: {
    room: Room;
    fetchedPlayers: Player[] | undefined;
  };
};

export const FindFastGame = (findFastProps: FindFastProps) => {
  const router = useRouter();

  const room = findFastProps.params.room;
  const roomId = findFastProps.params.room.roomId.toString();
  const fetchedPlayers = findFastProps.params.fetchedPlayers;
  const [winner, setWinner] = useState<Player | undefined>(undefined);

  const { mutate: finishGame } = api.rooms.finishGame();

  const handleFinishGame = () => {
    const playersScores =
      room?.playerIds?.map((playerId) => ({
        [playerId.toString()]: playerId.toString() === winner?.id.toString() ? "1" : "0",
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
    if (!gameContainerRef.current) return;

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

      this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
        const x = pointer.x;
        const y = pointer.y;

        if (
          x >= objectArea.x &&
          x <= objectArea.x + objectArea.width &&
          y >= objectArea.y &&
          y <= objectArea.y + objectArea.height
        ) {
          alert("You found the object!");
          setWinner(fetchedPlayers?.find((player) => player.id.toString() === "some_player_id")); // example
          handleFinishGame();
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
    };
  }, [fetchedPlayers, winner]);

  return (
    <div className="text-2xl font-bold text-white text-center">
      Find Fast Game
      <div ref={gameContainerRef} />
    </div>
  );
};
