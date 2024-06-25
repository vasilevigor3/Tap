import type { Metadata } from "next";
import "./styles/globals.css";
import ReactQueryProvider from "./react-query/Provider";
import Footer from "./components/layout/Footer";
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
        {/* <script src="https://telegram.org/js/telegram-web-app.js"   /> */}
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
      </head>
      <body>
        <ReactQueryProvider>
          {/* <Header /> */}
          {children}
        </ReactQueryProvider>
        <Footer />
      </body>
    </html>
  );
}
