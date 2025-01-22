'use client';

import { type Track } from '@/types/spotify';
import { useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import { fetcher } from '@/utils/fetcher';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import Loader from '@/components/ui/loader';
import { useTrackAudio } from '@/utils/TrackAudioProvider';
import { motion } from 'motion/react';

export default function Songs() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const { playTrack, pauseTrack, currentSong, isPlaying } = useTrackAudio();

  const { data, error, isLoading } = useSWR(
    session?.accessToken ? `/api/spotify?q=${encodeURIComponent(query)}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  const handlePlay = (track: Track) => {
    if (currentSong?.id === track.id && isPlaying) {
      pauseTrack();
    } else {
      playTrack(track, songs);
    }
  };

  useEffect(() => {
    if (error) {
      console.error('Error fetching songs', error);
    }
  }, [error]);

  if (status === 'loading') {
    return <Loader />;
  }

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500 mb-2">
          {error.message || 'Error loading songs'}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="text-sm text-zinc-400 hover:text-zinc-300"
        >
          Try again
        </button>
      </div>
    );
  }

  const songs: Track[] = data?.tracks || [];
  return (
    <div className="p-6">
      <h1 className="text-2xl font-medium mb-6 text-zinc-100 ml-6">
        Liked Songs
      </h1>

      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
        {songs.map((song) => (
          <motion.div
            key={song.id}
            onClick={() => handlePlay(song)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95, rotate: '-2.5deg' }}
            transition={{
              duration: 0.2,
              ease: 'easeIn',
            }}
            className="p-4 rounded-lg cursor-pointer transiton"
          >
            <div className="flex flex-col items-start gap-y-2">
              {song.album.images[0] && (
                <img
                  src={song.album.images[0].url}
                  alt={song.name}
                  className="w-auto max-w-64 rounded-md object-cover aspect-square shadow-xl"
                />
              )}
              <div className="flex flex-col min-w-0 max-w-full">
                <h2 className="font-semibold text-sm truncate text-zinc-100">
                  {song.name}
                </h2>
                <p className="text-sm text-zinc-200 truncate">
                  {song.artists.map((artist) => artist.name).join(', ')}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
