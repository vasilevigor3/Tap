import type { Metadata } from "next";
import "./styles/globals.css";
import ReactQueryProvider from "./react-query/Provider";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import Script from "next/script";

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
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
      </head>
      <body>
        <ReactQueryProvider>
          <Header />
          {children}
          <Footer />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
