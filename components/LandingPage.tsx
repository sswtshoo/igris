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

  // const modalVariants = {
  //   collapsed: {
  //     width: '0',
  //     height: '0',
  //     zIndex: '0',
  //     opacity: '0',
  //     inset: '0',
  //     transition: {
  //       type: 'spring',
  //       bounce: 0.25,
  //     },
  //   },
  //   expanded: {
  //     width: 'auto',
  //     height: 'auto',
  //     zIndex: '20',
  //     opacity: '1',
  //     inset: '0',
  //     transition: {
  //       type: 'spring',
  //       bounce: 0.25,
  //     },
  //   },
  // };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.25,
        ease: 'easeOut',
      },
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.25,
        ease: 'easeOut',
      },
    },
  };

  const PrivacyModal = () => (
    <motion.div
      className="fixed inset-0 z-20 bg-white/80 backdrop-blur-sm flex items-center justify-center"
      initial={false}
      animate={{ opacity: showPrivacy ? 1 : 0 }}
      transition={{ duration: 0.2 }}
      style={{ pointerEvents: showPrivacy ? 'auto' : 'none' }}
    >
      <motion.div
        className="bg-white p-6 rounded-sm shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] max-w-md mx-4"
        variants={modalVariants}
        initial="hidden"
        animate={showPrivacy ? 'visible' : 'hidden'}
      >
        <div className="flex flex-col gap-4 text-base">
          <h2 className="text-xl font-bold">Privacy Policy</h2>
          <p className="text-black font-normal">
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
      </motion.div>
    </motion.div>
  );

  const TermsModal = () => (
    <motion.div
      className="fixed inset-0 z-20 bg-white/80 backdrop-blur-sm flex items-center justify-center"
      initial={false}
      animate={{ opacity: showTerms ? 1 : 0 }}
      transition={{ duration: 0.2 }}
      style={{ pointerEvents: showTerms ? 'auto' : 'none' }}
    >
      <motion.div
        className="bg-white p-6 rounded-sm shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] max-w-md mx-4"
        variants={modalVariants}
        initial="hidden"
        animate={showTerms ? 'visible' : 'hidden'}
      >
        <div className="flex flex-col gap-4 text-base">
          <h2 className="text-xl font-bold">Terms of Service</h2>
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
      </motion.div>
    </motion.div>
  );
  if (session) {
    return (
      <main className="flex h-screen flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-zinc-800"></h1>
          <p className="mb-4">You are logged in as {session.user?.name}</p>
          <motion.button
            onClick={() => {
              setTimeout(() => {
                signIn('spotify', {
                  callbackUrl: window.location.origin + '/songs',
                });
              }, 100);
            }}
            initial={{
              backgroundColor: 'rgb(250, 250, 250)',
              color: 'rgb(50, 51, 51)',
            }}
            whileHover={{
              backgroundColor: 'rgb(255, 255, 255)',
              scale: 1,
            }}
            whileTap={{
              scale: 0.95,
            }}
            transition={{ duration: 0.15, ease: 'easeInOut' }}
            className="border-[1px] border-zinc-600/10 text-light text-sm p-2 rounded-md shadow-sm font-[450] transition-colors"
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
        <h1 className="text-xl sm:text-xl lg:text-2xl font-medium mb-2 text-darker">
          Igris - Your Liked and Top Played Tracks
        </h1>
        <motion.button
          onClick={() => {
            setTimeout(() => {
              signIn('spotify', {
                callbackUrl: window.location.origin + '/songs',
              });
            }, 100);
          }}
          initial={{
            backgroundColor: 'rgb(250, 250, 250)',
            color: 'rgb(50, 51, 51)',
          }}
          whileHover={{
            backgroundColor: 'rgb(255, 255, 255)',
            scale: 1,
          }}
          whileTap={{
            scale: 0.95,
          }}
          transition={{ duration: 0.15, ease: 'easeInOut' }}
          className="border-[1px] border-zinc-600/10 text-light text-sm p-2 rounded-md shadow-sm font-[450] transition-colors"
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
