/**
 * v0 by Vercel.
 * @see https://v0.dev/t/dXi1GL68ypM
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client";

import { SVGProps, useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "../ui/Button";
import CreateRoomModal from "../CreateRoomModal2";
import { api } from "../../react-query/routers";


export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: user } = api.users.getOrCreate.useQuery();
  // const { data: player } = api.players.getOrCreate.useQuery(user?.id);
  const { data: player } = api.players.getOrCreate(user?.id);
  

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <header className="bg-gray-100 dark:bg-gray-800 text-gray-950 dark:text-gray-100 py-4 px-6 md:px-8">
      <div className="container mx-auto flex items-center justify-between">
        <div className="text-2xl font-bold">TapTap Casino</div>
        <nav
          className={`flex flex-col gap-4 absolute top-16 left-0 w-full bg-gray-100 dark:bg-gray-800 p-4 rounded-b-lg shadow-lg z-10 ${
            isMenuOpen ? "block" : "hidden"
          } md:flex md:flex-row md:static md:bg-transparent md:p-0 md:shadow-none md:rounded-none`}
        >
          <Link
            href="/"
            className="hover:text-gray-600 dark:hover:text-gray-400 transition-colors duration-300"
            prefetch={false}
          >
            Home
          </Link>
          <Link
            href="#"
            className="hover:text-gray-600 dark:hover:text-gray-400 transition-colors duration-300"
            prefetch={false}
            onClick={toggleModal}
          >
            Create Room
          </Link>
          <Link
            href="#"
            className="hover:text-gray-600 dark:hover:text-gray-400 transition-colors duration-300"
            prefetch={false}
          >
            Leaderboard
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <MenuIcon className="w-6 h-6" />
          </Button>
          <div className="md:block text-sm font-medium">{player?.name}</div>
          <div className="md:block text-sm font-medium">Balance: {player?.balance}</div>
        </div>
      </div>
      <CreateRoomModal isOpen={isModalOpen} onClose={toggleModal} player={player} />
    </header>
  );
}

function MenuIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}