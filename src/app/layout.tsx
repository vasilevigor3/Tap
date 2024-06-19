import type { Metadata } from "next";
import "./styles/globals.css";

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
      <body>{children}</body>
    </html>
  );
}
