'use client';

import { useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import { fetcher } from '@/utils/fetcher';
import { useSession } from 'next-auth/react';
import { useTrackAudio } from '@/utils/TrackAudioProvider';
import { motion } from 'motion/react';
import { Suspense } from 'react';
import Loader from '@/components/ui/loader';
import { type Track } from '@/types/spotify';
import Link from 'next/link';
import Lenis from 'lenis';
import { useEffect } from 'react';

function TopSongsContent() {
  const searchParams = useSearchParams();
  const timeRange = searchParams.get('range') ?? 'short_term';

  const { playTrack, isPlaying, pauseTrack, currentSong } = useTrackAudio();
  const { data: session } = useSession({ required: true });

  const { data, error, isLoading } = useSWR(
    session?.accessToken ? `/api/spotify/top?range=${timeRange}` : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy;
    };
  }, []);

  if (isLoading) return <Loader />;
  if (error)
    return <div className="text-red-500">Error loading top tracks</div>;

  const handlePlay = (track: Track) => {
    if (currentSong?.id === track.id && isPlaying) {
      pauseTrack();
    } else {
      playTrack(track, songs);
    }
  };

  const timeRanges = [
    { value: 'short_term', label: '4 Weeks' },
    { value: 'medium_term', label: '6 Months' },
    { value: 'long_term', label: '1 Year' },
  ];

  const songs: Track[] = data?.tracks || [];

  return (
    <div className="px-4 sm:px-8 py-6 max-w-[1320px] mx-auto w-full mt-16 sm:mt-20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4 mb-4">
          <h1 className="text-3xl font-semibold text-zinc-950 ml-4">
            Top Songs
          </h1>
          <Link href="/songs" className="text-zinc-600 hover:text-zinc-800">
            ← View Liked Songs
          </Link>
        </div>
        <div className="flex items-center gap-4 px-2 py-1 mr-4 bg-white shadow-lg shadow-zinc-200 border-[1px] border-zinc-800 border-opacity-5 rounded-lg">
          {timeRanges.map((range) => (
            <button
              key={range.value}
              onClick={() => {
                const url = new URL(window.location.href);
                url.searchParams.set('range', range.value);
                window.history.pushState({}, '', url);
              }}
              className={`px-2 py-1 font-medium text-sm rounded-md transition-all ${
                timeRange === range.value
                  ? 'bg-zinc-950 text-zinc-100'
                  : 'hover:bg-zinc-800/5 text-zinc-600'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 mb-16">
        {songs.map((song) => (
          <motion.div
            key={song.id}
            onClick={() => handlePlay(song)}
            initial={{
              y: -20,
              scale: 0.8,
            }}
            animate={{
              y: 0,
              scale: 1,
            }}
            whileTap={{ scale: 0.95, rotate: '15deg' }}
            transition={{
              duration: 0.3,
              type: 'spring',
              stiffness: 300,
              damping: 20,
            }}
            className="p-2 sm:p-4 max-w-60 rounded-lg cursor-default transiton focus:outline-none"
          >
            <div className="flex flex-col items-start gap-y-2">
              {song.album.images[0] && (
                <img
                  src={song.album.images[0].url}
                  alt={song.name}
                  className="w-full h-full rounded-md object-cover aspect-square shadow-xl"
                  loading="eager"
                />
              )}
              <div className="flex flex-col min-w-0 max-w-full">
                <h2 className="font-semibold text-sm truncate text-zinc-900">
                  {song.name}
                </h2>
                <p className="text-sm text-zinc-700 truncate">
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

export default function TopSongs() {
  return (
    <Suspense fallback={<Loader />}>
      <TopSongsContent />
    </Suspense>
  );
}
