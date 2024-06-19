import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Manrope } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-manrope',
})

export const metadata: Metadata = {
  title: "TapTap Casino",
  description: "TapTap Casino",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      <script src="https://telegram.org/js/telegram-web-app.js"></script>
      </head>
      <body className={manrope.className}>{children}</body>
    </html>
  );
}
