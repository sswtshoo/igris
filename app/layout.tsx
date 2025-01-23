import type { Metadata } from 'next';
import { Providers } from '@/components/Providers';
import './globals.css';
import Navbar from '@/components/Navbar';
import Player from '@/components/Player';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';

export const metadata: Metadata = {
  title: 'igris',
  description: 'igris player for Spotify',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="bg-zinc-100">
        <Providers>
          <Navbar />
          <main className="pt-16">{children}</main>
          <Player />
        </Providers>
      </body>
    </html>
  );
}
