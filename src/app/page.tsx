"use client";

import { AllRooms } from "./components/AllRooms";
import { api } from "./react-query/routers";

const HomePage = () => {
  const { data: user, isLoading: userLoading } = api.users.getOrCreate.useQuery();
  const { isPending } = api.players.getOrCreate(user?.id);

  if (userLoading) return <div>Loading...</div>;

  const connectWallet = async () => {
    const userId = user?.id;
    if (!userId) return;
  };

  return (
    <main className="flex flex-col gap-3">
      <button onClick={connectWallet}>
        {isPending && "Connecting..."}
        {!isPending && "Connect Wallet"}
      </button>
      <AllRooms />
    </main>
  );
};

export default HomePage;
