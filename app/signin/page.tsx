'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

export default function SignInPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const handleSignIn = async () => {
    try {
      await signIn('spotify', {
        callbackUrl: '/songs',
        redirect: true,
      });
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };
  return (
    <div className="p-4 flex items-center justify-center h-screen">
      <div className="flex flex-col gap-4 items-center">
        <h1 className="text-2xl font-bold text-center">Igris for Spotify</h1>
        {error && (
          <div className="text-red-500 text-sm mb-4">
            Authentication error. Please try again.
          </div>
        )}
        <button
          onClick={handleSignIn}
          className="border-[0.5px] border-zinc-500 border-opacity-25 bg-zinc-200 text-zinc-900 text-sm px-4 py-2 rounded-md shadow-md hover:bg-zinc-300 transition-colors"
        >
          Sign in with Spotify
        </button>
      </div>
    </div>
  );
}
