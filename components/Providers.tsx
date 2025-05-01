'use client';

import { SessionProvider } from 'next-auth/react';
import { TrackAudioProvider } from '@/utils/TrackAudioProvider';
import { SpotifyDataProvider } from '@/utils/SpotifyDataProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SpotifyDataProvider>
        <TrackAudioProvider>{children}</TrackAudioProvider>
      </SpotifyDataProvider>
    </SessionProvider>
  );
}
