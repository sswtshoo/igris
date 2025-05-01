'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useSession } from 'next-auth/react';
import { Track } from '@/types/spotify';
import { fetcher } from '@/utils/fetcher';

interface SpotifyDataContextType {
  allTracks: Track[];
  topTracksShortTerm: Track[];
  topTracksMediumTerm: Track[];
  topTracksLongTerm: Track[];
  isLoading: boolean;
  error: Error | null;
  refreshData: () => Promise<void>;
}

const SpotifyDataContext = createContext<SpotifyDataContextType | undefined>(
  undefined
);

export function useSpotifyData() {
  const context = useContext(SpotifyDataContext);
  if (context === undefined) {
    throw new Error('useSpotifyData must be used within a SpotifyDataProvider');
  }
  return context;
}

export function SpotifyDataProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [allTracks, setAllTracks] = useState<Track[]>([]);
  const [topTracksShortTerm, setTopTracksShortTerm] = useState<Track[]>([]);
  const [topTracksMediumTerm, setTopTracksMediumTerm] = useState<Track[]>([]);
  const [topTracksLongTerm, setTopTracksLongTerm] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAllData = async () => {
    if (status !== 'authenticated' || !session?.accessToken) return;

    setIsLoading(true);
    setError(null);

    try {
      const tracksResponse = await fetcher('/api/spotify');
      setAllTracks(tracksResponse?.tracks || []);

      const shortTermResponse = await fetcher(
        '/api/spotify/top?range=short_term'
      );
      setTopTracksShortTerm(shortTermResponse?.tracks || []);

      const mediumTermResponse = await fetcher(
        '/api/spotify/top?range=medium_term'
      );
      setTopTracksMediumTerm(mediumTermResponse?.tracks || []);

      const longTermResponse = await fetcher(
        '/api/spotify/top?range=long_term'
      );
      setTopTracksLongTerm(longTermResponse?.tracks || []);
    } catch (err) {
      console.error('Error fetching Spotify data:', err);
      setError(
        err instanceof Error ? err : new Error('Failed to fetch Spotify data')
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated' && session?.accessToken) {
      fetchAllData();
    }
  }, [status, session?.accessToken]);

  const value = {
    allTracks,
    topTracksShortTerm,
    topTracksMediumTerm,
    topTracksLongTerm,
    isLoading,
    error,
    refreshData: fetchAllData,
  };

  return (
    <SpotifyDataContext.Provider value={value}>
      {children}
    </SpotifyDataContext.Provider>
  );
}
