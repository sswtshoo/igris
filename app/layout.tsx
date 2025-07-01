import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Player from "@/components/Player";

export const metadata: Metadata = {
  title: "Igris",
  description: "...",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    viewportFit: "cover",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <Providers>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Player />
        </Providers>
      </body>
    </html>
  );
}
