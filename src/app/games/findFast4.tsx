"use client";

import React, { useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import { useRouter } from "next/navigation";
import { api } from "@/app/react-query/routers";
import { FinishGameProps } from "@/types/room.types";
import { Player } from "@/types/Player";
import { GameId } from "@/types/Player";
import { Score } from "@/types/Score";
import { Room } from "@/types/room.types";
import { motion } from "framer-motion";
import { Button } from "@/app/components/ui/Button";
import { curEnv } from "@/constants/env";
import { handleClientScriptLoad } from "next/script";
import { Client } from '@stomp/stompjs';

type FindFastProps = {
    params: {
        room: Room;
        fetchedPlayers: Player[] | undefined;
    };
};

//MAKE A BIG CHECK IF USER COULD ENTER A ROOM IF HE IS NOT PLAYER OF THE ROOM

export const FindFastGame = (findFastProps: FindFastProps) => {
    const router = useRouter();

    const { data: user } = api.users.getOrCreate.useQuery();
    const { data: player } = api.players.getOrCreate(user?.id);
    const fetchedPlayers = findFastProps.params.fetchedPlayers;
    const [winner, setWinner] = useState<Player>();

    const updateScoresMutation = api.game.updateScoresForCurrentGameAndCurrentPlayer.useMutation();

    const room = findFastProps.params.room;
    const roomId = findFastProps.params.room.roomId.toString();

    const { mutate: finishGame } = api.rooms.finishGame();

    const [gameActive, setGameActive] = useState<Boolean>(false);
    const [currentPlayerIsReady, setCurrentPlayerIsReady] = useState<Boolean>(false);

    const timerRef = useRef<number>(0);
    const [countdown, setCountdown] = useState(3);
    const [elapsedTime, setElapsedTime] = useState<number>(0);

    const gameContainerRef = useRef<HTMLDivElement>(null);

    const [kickTimer, setKickTimer] = useState<NodeJS.Timeout | null>(null);

    const leaveRoom = api.rooms.leave.useMutation();

    const [bestTime, setBestTime] = useState(null);
    const [myBestTime, setMyBestTime] = useState(0);
    

    useEffect(() => {
        if (!currentPlayerIsReady) {
            const timer = setTimeout(() => {
                // API call to leave the room
                leaveRoom.mutate({ roomId: room.roomId, playerIds: [player?.id] },
                    {
                        onSuccess: () => {
                            console.log("Player left the room due to inactivity.");
                            router.push('/'); // Adjust as needed
                        },
                        onError: (error) => {
                            console.error("Error leaving the room due to inactivity:", error);
                        }
                    }
                );
            }, 5000); // 5 seconds wait time

            return () => clearTimeout(timer);
        }
    }, [currentPlayerIsReady, player?.id, room.roomId, leaveRoom.mutate, router]);

    interface ReadyButtonProps {
        gameId: GameId;
        player: Player;
    }

    const ReadyButton: React.FC<ReadyButtonProps> = ({ gameId, player }) => {
        const { mutate: sendReadyToPlay } = api.game.readyToPlay.useMutation({
            onSuccess: () => {
                setCurrentPlayerIsReady(true);
                // You might want to inform other players or check if all players are ready here
            },
        });

        const handleReadyButton = async () => {
            if (!player?.id || !roomId) return;

            sendReadyToPlay({ gameId: roomId, playerId: player.id.toString() }, {
                onSuccess: () => {
                    setCurrentPlayerIsReady(true);
                    // Clear the timer as the player has marked themselves as ready
                    if (kickTimer) {
                        clearTimeout(kickTimer); // Stop the kick timer
                        setKickTimer(null);
                    }
                },
            });
        };

        return (
            <Button
                className="bg-gradient-to-r from-indigo-500 to-purple-500..."
                onClick={handleReadyButton}
                disabled={!player || !player.id}
            >
                Ready
            </Button>
        );
    };

    useEffect(() => {

        const loadGame = () => {
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
                        alert("You found the object!");
                        if (timerRef.current !== null) {
                            clearInterval(timerRef.current); // Stop the timer
                            console.log(timerRef.current)
                            const elapsedTimeInSeconds = elapsedTime;
                            console.log(elapsedTimeInSeconds)
                            submitScore(timerRef.current)
                        }
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
        }
        if (gameActive) {
            loadGame();
            if (timerRef.current === 0) { // Ensure not to start the timer again if it's already running
                timerRef.current = window.setInterval(() => {
                    setElapsedTime((prevTime) => prevTime + 1);
                }, 1000);
            }
        }
    }, [gameActive]);


    useEffect(() => {
        // Более корректный способ создания экземпляра stompClient для браузера
        const stompClient = new Client({
            // Предполагаем, что у вас есть WebSocket endpoint на сервере, пример: 'wss://вашсервер.com/ws'
            brokerURL: "http://localhost:8080/ws",
            onConnect: () => {
                console.log("Connected");

                stompClient.subscribe(`/topic/roomStatus/${roomId}`, (message) => {

                    const { body } = message;
                    const gameStatus = JSON.parse(body);

                    if (gameStatus.status === "ready") {
                        // Игра началась, перенаправляем пользователя
                        console.log("ready")
                        setGameActive(true)
                    }
                });
            },
            // Логику переподключения и другие настройки добавить по необходимости
        });

        stompClient.activate();

        return () => {
            stompClient.deactivate(); // Правильно деактивировать клиента при размонтировании компонента
        };
    }, [roomId, router]);

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
                    console.log(message)
                    const update = JSON.parse(message.body);
                    
                    console.log(message.body)
                    // If the received score is better than the current best, update it
                    if (!bestTime || update.score < bestTime) {
                        setBestTime(update.score);
                        if (update.playerId === player?.id.toString()) {
                            // This player has the best score
                            
                            setWinner(player); // Ensure you have logic to appropriately determine and display the winner
                            console.log(winner)
                            console.log(player)

                            const playersScores = room?.playerIds?.map(playerId => ({
                                [playerId.toString()]: playerId.toString() === player?.id.toString() ? "1" : "0",
                            })) || [];

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
                            // api.rooms.finishGame
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

            updateScoresMutation.mutate({
                gameId: roomId,
                playerId: player?.id.toString(),
                score: score.toString(),
            }, {
                onSuccess: (data) => {
                    console.log("Score updated successfully", data);
                },
                onError: (error) => {
                    console.error("Failed to update score:", error);
                },
            });
        }
    };

    return (
        <div className="text-2xl font-bold text-white text-center">
            Find Fast Game

            {!gameActive && !currentPlayerIsReady && (
                <div>
                    <div>Press ready or you will be kicked with 5 sec...</div>
                    <ReadyButton gameId={room.roomId.toString()} player={player} />
                </div>)}

            {!gameActive && currentPlayerIsReady && (
                <div>Waiting for other players...</div>)}

            {gameActive && (
                <>
                    <div ref={gameContainerRef} />
                    {/* Display the timer */}
                    <div className="mt-4">
                        Time: {elapsedTime} seconds
                    </div>
                </>
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
