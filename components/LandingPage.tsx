'use client';

import { useSession } from 'next-auth/react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { motion } from 'motion/react';

export function Landing() {
  const { data: session } = useSession();

  if (session) {
    return (
      <main className="flex h-screen flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-zinc-800">Welcome to Igris</h1>
          <p className="mb-4">You are logged in as {session.user?.name}</p>
          <motion.button
            initial={{
              backgroundColor: 'rgb(228, 228, 231)',
              color: 'rgb(24, 24, 27)',
            }}
            whileHover={{
              backgroundColor: 'rgb(24, 24, 27)',
              color: 'rgb(228, 228, 231)',
              scale: 1.05,
            }}
            whileTap={{
              backgroundColor: 'rgb(24, 24, 27)',
              color: 'rgb(228, 228, 231)',
              scale: 0.95,
              rotate: '5deg',
            }}
            transition={{
              duration: 0.1,
              type: 'spring',
              stiffness: 300,
              damping: 20,
            }}
            className="border-2 border-opacity-5 border-zinc-800 px-4 py-2 bg-zinc-100 rounded-md"
          >
            <Link href={'/songs'}>Go to songs</Link>
          </motion.button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-6 text-zinc-700">
          Welcome to Igris
        </h1>
        <motion.button
          onClick={() => signIn('spotify')}
          initial={{
            backgroundColor: 'rgb(255, 255, 255)',
            color: 'rgb(82, 82, 91)',
          }}
          whileHover={{
            backgroundColor: 'rgb(24, 24, 27)',
            color: 'rgb(228, 228, 231)',
            scale: 1.05,
          }}
          whileTap={{
            backgroundColor: 'rgb(24, 24, 27)',
            color: 'rgb(228, 228, 231)',
            scale: 0.95,
            rotate: '5deg',
          }}
          transition={{
            duration: 0.1,
            type: 'spring',
            stiffness: 300,
            damping: 20,
          }}
          className="px-6 py-3 rounded-md text-zinc-900 bg-zinc-100 transition-colors border-2 border-zinc-800 border-opacity-25"
        >
          Sign in with Spotify
        </motion.button>
      </div>
    </main>
  );
}
