'use client';

import { useSpotifyData } from '@/utils/SpotifyDataProvider';
import { useSession } from 'next-auth/react';
import Loader from '@/components/ui/loader';

export function LoadingIndicator() {
  const { isLoading } = useSpotifyData();
  const { status } = useSession();

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-zinc-900 p-6 rounded-lg shadow-xl">
          <Loader />
          <p className="text-zinc-300 mt-4 text-center">
            Loading your Spotify data...
          </p>
        </div>
      </div>
    );
  }

  return null;
}
