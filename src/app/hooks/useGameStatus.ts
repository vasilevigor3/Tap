import { useEffect } from "react";
import { Client } from '@stomp/stompjs';
import { useRouter } from "next/navigation";

const useGameStatus = (roomId: number, userId?: number) => {
  const router = useRouter();

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

          if (gameStatus.status === "full") {
            // Игра началась, перенаправляем пользователя
            router.push(`/room/${roomId}`);
          }
        });
      },
      // Логику переподключения и другие настройки добавить по необходимости
    });

    stompClient.activate();

    return () => {
      stompClient.deactivate(); // Правильно деактивировать клиента при размонтировании компонента
    };
  }, [roomId, userId, router]);
};

export default useGameStatus;