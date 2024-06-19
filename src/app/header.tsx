/**
 * v0 by Vercel.
 * @see https://v0.dev/t/dXi1GL68ypM
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client"

import { SVGProps, useState } from "react"
import Link from "next/link"
import { Button } from "./components/ui/Button";
import CreateRoomModal from './createRoomModal';


export { Header };
export default function Header() {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <header className="bg-gray-100 dark:bg-gray-800 text-gray-950 dark:text-gray-100 py-4 px-6 md:px-8">
      <div className="container mx-auto flex items-center justify-between">
        <div className="text-2xl font-bold">TapTap Casino</div>
        <nav
          className={`flex flex-col gap-4 absolute top-16 left-0 w-full bg-gray-100 dark:bg-gray-800 p-4 rounded-b-lg shadow-lg z-10 ${isMenuOpen ? "block" : "hidden"
            } md:flex md:flex-row md:static md:bg-transparent md:p-0 md:shadow-none md:rounded-none`}
        >
          <Link
            href="#"
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
          <Button variant="ghost" size="icon" onClick={() => setIsDarkMode(!isDarkMode)} >
            {isDarkMode ? <SunIcon className="w-6 h-6" /> : <MoonIcon className="w-6 h-6" />}
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <MenuIcon className="w-6 h-6" />
          </Button>
        </div>
      </div>
      <CreateRoomModal isOpen={isModalOpen} onClose={toggleModal} />
    </header>

  )
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
  )
}


function MoonIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  )
}


function SunIcon(props: SVGProps<SVGSVGElement>) {
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
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  )
}