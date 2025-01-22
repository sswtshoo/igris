'use client';

import { SessionProvider } from 'next-auth/react';
import { TrackAudioProvider } from '@/utils/TrackAudioProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <TrackAudioProvider>{children}</TrackAudioProvider>
    </SessionProvider>
  );
}
