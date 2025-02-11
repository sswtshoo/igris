'use client';

import { useSession } from 'next-auth/react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { useState } from 'react';

export function Landing() {
  const { data: session } = useSession();
  const [pageEnable, setPageEnable] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const PrivacyModal = () => (
    <div className="fixed inset-0 z-20 bg-white/80 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-4">
        <div className="flex flex-col gap-4 text-base">
          <h2 className="text-xl font-semibold">Privacy Policy</h2>
          <p className="text-black">
            This project does not save any Spotify data. When you log-in with
            your Spotify account, it creates a special, one-time token to read
            your top played tracks, as well as your liked tracks. That access
            goes away until you come back.
          </p>
          <div className="flex flex-col"></div>
          <p>We do not:</p>
          <ul className="list-disc pl-4">
            <li>Store any personal information</li>
            <li>Share any data with third parties</li>
            <li>Track user behavior</li>
            <li>Use cookies for advertising</li>
          </ul>
          <p>
            {`To remove access, visit Spotify's Apps page `}
            <Link
              href="https://www.spotify.com/account/apps/"
              className="underline"
              target="_blank"
            >
              here
            </Link>
          </p>
          <button
            className="bg-black text-white rounded-md px-4 py-2 hover:bg-black/90 transition-colors"
            onClick={() => setShowPrivacy(false)}
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );

  const TermsModal = () => (
    <div className="fixed inset-0 z-20 bg-white/80 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-4">
        <div className="flex flex-col gap-4 text-base">
          <h2 className="text-xl font-semibold">Terms of Service</h2>
          <p>By using igris, you agree to:</p>
          <ul className="list-disc pl-4 space-y-2">
            <li>{`Use the service for personal, non-commercial use only`}</li>
            <li>{`Not attempt to circumvent Spotify's terms of service`}</li>
            <li>{`Respect Spotify's intellectual property rights`}</li>
            <li>{`Not abuse or attempt to exploit the service`}</li>
          </ul>
          <p>This service is not affiliated with Spotify.</p>
          <button
            className="bg-black text-white rounded-md px-4 py-2 hover:bg-black/90 transition-colors"
            onClick={() => setShowTerms(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
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
            className="border border-black/5 px-4 py-2 bg-white rounded-sm font-[450] shadow-md"
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
        <h1 className="text-xl sm:text-xl lg:text-2xl font-medium mb-2 text-zinc-950">
          Igris - Your Liked and Top Played Tracks
        </h1>
        <motion.button
          onClick={() => signIn('spotify', { callbackUrl: '/songs' })}
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
      <div className="fixed bottom-8 right-8 flex items-center justify-center gap-4">
        <button
          onClick={() => setShowPrivacy(true)}
          className="text-xs text-black hover:underline"
        >
          Privacy Policy
        </button>
        <button
          onClick={() => setShowTerms(true)}
          className="text-xs text-black hover:underline"
        >
          Terms of Service
        </button>
      </div>

      {showPrivacy && <PrivacyModal />}
      {showTerms && <TermsModal />}
    </main>
  );
}
