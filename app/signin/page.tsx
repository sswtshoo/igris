'use client';

import { signIn, useSession } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import Loader from '@/components/ui/loader';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';

function SignInContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const { data: session, status } = useSession();
  const router = useRouter();
  const [pageEnable, setPageEnable] = useState(false);

  console.log('Auth State:', {
    session,
    status,
    error: searchParams.get('error'),
    callbackUrl: searchParams.get('callbackUrl'),
  });

  useEffect(() => {
    if (status === 'authenticated') {
      console.log('Redirecting to /songs because session exists');
      router.push('/songs');
    }
  }, [status, router]);

  return (
    <div className="flex flex-col gap-4 items-center">
      <h1 className="text-2xl sm:text-3xl font-medium text-center text-zinc-50">
        Igris for Spotify
      </h1>
      {error && (
        <div className="text-red-500 text-sm mb-2">
          Authentication error. Please try again.
        </div>
      )}
      <motion.button
        onClick={() => signIn('spotify', { callbackUrl: '/songs' })}
        initial={{
          backgroundColor: 'rgb(255, 255, 255)',
          color: 'rgb(9, 9, 11)',
        }}
        whileHover={{
          backgroundColor: 'rgb(228, 228, 231)',
          scale: 1,
        }}
        whileTap={{
          backgroundColor: 'rgb(24, 24, 27)',
          color: 'rgb(228, 228, 231)',
          scale: 0.95,
        }}
        transition={{ duration: 0.15, ease: 'easeInOut' }}
        className="border-[1px] border-zinc-400 hover:bg-zinc-100 border-opacity-10 bg-white text-sm p-2 rounded-md shadow-md font-[450] transition-colors"
      >
        Sign in with Spotify
      </motion.button>
      {pageEnable && (
        <div className="fixed inset-0 z-20 bg-white/80 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-zinc-950 p-6 rounded-lg shadow-lg max-w-md mx-4">
            <div className="flex flex-col gap-4 text-base">
              <p className="text-zinc-950">
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
                className="bg-zinc-50 text-zinc-950 rounded-md px-4 py-2 hover:bg-black/90 transition-colors"
                onClick={() => setPageEnable(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SignInPage() {
  return (
    <div className="p-4 flex items-center justify-center h-screen bg-[#111110]">
      <Suspense fallback={<Loader />}>
        <SignInContent />
      </Suspense>
    </div>
  );
}
