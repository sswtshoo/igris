'use client';

import { signIn, useSession } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import Loader from '@/components/ui/loader';
import { motion } from 'motion/react';
import { useEffect } from 'react';
import { redirect } from 'next/navigation';

function SignInContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const { data: session, status } = useSession();
  const router = useRouter();

  console.log('Auth State:', {
    session,
    status,
    error: searchParams.get('error'),
    callbackUrl: searchParams.get('callbackUrl'),
  });

  const handleSignIn = async () => {
    try {
      const result = await signIn('spotify', {
        callbackUrl: '/songs',
        redirect: false,
      });

      if (result?.error) {
        console.error('Sign in error:', result.error);
      } else if (result?.url) {
        window.location.href = result.url;
      }
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      console.log('Redirecting to /songs because session exists');
      router.push('/songs');
    }
  }, [status, router]);

  return (
    <div className="flex flex-col gap-4 items-center">
      <h1 className="text-2xl sm:text-3xl font-medium text-center text-zinc-950">
        Igris for Spotify
      </h1>
      {error && (
        <div className="text-red-500 text-sm mb-2">
          Authentication error. Please try again.
        </div>
      )}
      <motion.button
        onClick={handleSignIn}
        initial={{
          backgroundColor: 'rgb(255, 255, 255)',
          color: 'rgb(9, 9, 11)',
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
        transition={{ duration: 0.15, ease: 'easeIn' }}
        className="border-[1px] border-zinc-400 border-opacity-10 bg-white text-base p-2 rounded-md shadow-md font-normal hover:bg-zinc-300 transition-colors"
      >
        Sign in with Spotify
      </motion.button>
    </div>
  );
}

export default function SignInPage() {
  return (
    <div className="p-4 flex items-center justify-center h-screen">
      <Suspense fallback={<Loader />}>
        <SignInContent />
      </Suspense>
    </div>
  );
}
