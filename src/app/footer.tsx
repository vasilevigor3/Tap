"use client"

import {useState } from "react"
import Link from "next/link"


export { Footer };
export default function Footer() {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <footer className="bg-gray-100 dark:bg-gray-800 text-gray-950 dark:text-gray-100 py-4 px-6 md:px-8">
    <div className="container mx-auto flex items-center justify-between">
      <div className="text-sm">&copy; 2023 Bet & Win. All rights reserved.</div>
      <div className="flex items-center space-x-4">
        <Link
          href="#"
          className="hover:text-gray-600 dark:hover:text-gray-400 transition-colors duration-300"
          prefetch={false}
        >
          Terms
        </Link>
        <Link
          href="#"
          className="hover:text-gray-600 dark:hover:text-gray-400 transition-colors duration-300"
          prefetch={false}
        >
          Privacy
        </Link>
        <Link
          href="#"
          className="hover:text-gray-600 dark:hover:text-gray-400 transition-colors duration-300"
          prefetch={false}
        >
          Contact
        </Link>
      </div>
    </div>
  </footer>
  )
}