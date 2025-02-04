'use client';

import { useSession } from 'next-auth/react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { useState } from 'react';

export function Landing() {
  const { data: session } = useSession();
  const [pageEnable, setPageEnable] = useState(false);

  if (session) {
    return (
      <main className="flex h-screen flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-zinc-800"></h1>
          <p className="mb-4">You are logged in as {session.user?.name}</p>
          <motion.button
            initial={{
              backgroundColor: 'rgb(255, 255, 255)',
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
            className="border border-black/5 px-4 py-2 bg-white rounded-lg shadow-md"
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
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-medium mb-2 text-zinc-950">
          Igris - Your Liked and Top Played Tracks
        </h1>
        <motion.button
          onClick={() => signIn('spotify')}
          initial={{
            backgroundColor: 'rgb(255, 255, 255)',
            color: 'rgb(9, 9, 11)',
          }}
          whileHover={{
            backgroundColor: 'rgb(24, 24, 27)',
            color: 'rgb(228, 228, 231)',
          }}
          whileTap={{
            backgroundColor: 'rgb(24, 24, 27)',
            color: 'rgb(228, 228, 231)',
          }}
          transition={{
            duration: 0.1,
            type: 'spring',
            stiffness: 300,
            damping: 20,
          }}
          className="px-4 py-2 rounded-sm font-[450] text-zinc-900 bg-zinc-100 transition-colors border border-black/5 shadow-md"
        >
          Sign in with Spotify
        </motion.button>
      </div>
      <div className=" fixed bottom-8 right-8 flex items-center justify-center">
        <p className="font-normal text-xs text-black">
          Privacy policy{' '}
          <span
            className="font-normal text-black underline cursor-pointer"
            onClick={() => {
              console.log('clicked');
              setPageEnable(true);
            }}
          >
            here
          </span>
        </p>
      </div>
      {pageEnable && (
        <div className="fixed inset-0 z-20 bg-white/80 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-4">
            <div className="flex flex-col gap-4 text-base">
              <p className="text-black">
                This project does not save any Spotify data. When you log-in
                with your Spotify account, it creates a special, one-time token
                to read your top played tracks, as well as your liked tracks.
                That access goes away until you come back.
              </p>
              <p>
                {`To remove ties between your Spotify account and this project, click
          remove access for "igris" on Spotify's 3rd Party app page `}
                <span className="underline">
                  <Link href="https://www.spotify.com/account/apps/">here</Link>
                </span>
              </p>
              <button
                className="bg-black text-white rounded-md px-4 py-2 hover:bg-black/90 transition-colors"
                onClick={() => setPageEnable(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
