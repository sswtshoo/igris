'use client';

import { useSession } from 'next-auth/react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

export function Landing() {
  const { data: session } = useSession();

  if (session) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-6">Welcome to Igris</h1>
          <p>You are logged in as {session.user?.name}</p>
          <button className="border border-zinc-600 px-4 py-2 bg-zinc-200 rounded-md">
            <Link href={'/songs'}>Go to songs</Link>
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen min-w-screen flex-col items-center justify-between p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-6">Welcome to Igris</h1>
        <button
          onClick={() => signIn('spotify')}
          className="px-6 py-3 rounded-full bg-green-600 text-white hover:bg-green-700 transition-colors"
        >
          Sign in with Spotify
        </button>
      </div>
    </main>
  );
}
