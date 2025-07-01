import type { Metadata } from 'next';
import { Providers } from '@/components/Providers';
import './globals.css';
import Navbar from '@/components/Navbar';
import Player from '@/components/Player';

export const metadata: Metadata = {
  title: 'igris',
  description: 'igris player for Spotify',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning className="bg-lighter">
        <Providers>
          <Navbar />
          <main className="min-h-[100dvh]">{children}</main>
          <Player />
        </Providers>
      </body>
    </html>
  );
}
