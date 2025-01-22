import type { Metadata } from 'next';
import { Providers } from '@/components/Providers';
import './globals.css';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Player from '@/components/Player';

export const metadata: Metadata = {
  title: 'igris',
  description: 'igris player for Spotify',
};

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="bg-zinc-950">
        <Providers>
          <Navbar />
          <main className="pt-16">{children}</main>
          <Player />
        </Providers>
      </body>
    </html>
  );
}
