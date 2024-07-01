"use client";
import { api } from "@/app/react-query/routers";
import { useRouter } from "next/navigation";
import { RouletteGame } from "@/app/games/roulette";
import { FindFastGame } from "@/app/games/findFast";

type PageProps = {
  params: {
    roomId: string;
  };
};

const GameAreaPage = (props: PageProps) => {
  const router = useRouter();
  const roomId = props.params.roomId;
  const { data: room } = api.rooms.getById.useQuery(roomId);
  //TODO: some check if user/player could see this page
  const { data: fetchedPlayers } = api.playerIds.getPlayersByIds(room?.playerIds);

  if (!room?.isGameStarted) return <div className="text-2xl font-bold text-white text-center">Game has not started yet.</div>;

  const params = {
    room: room,
    fetchedPlayers:fetchedPlayers,
  }

  room.gameType = "FF"
  if (room.gameType == "ROULETTE") {
    return (
      <div>
        <RouletteGame params={params}/>
      </div>
    )
  }

  if (room.gameType == "FF") {
    return (
      <div>
        <FindFastGame params={params}/>
      </div>
    )
  }
};

export default GameAreaPage;
