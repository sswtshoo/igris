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
import Lenis from 'lenis';
import { useEffect } from 'react';
import Image from 'next/image';

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
      lenis.destroy();
    };
  }, []);

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

  if (isLoading) return <Loader />;
  if (error)
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-red-500">Error loading top tracks</div>
      </div>
    );

  return (
    <div className="px-8 md:px-8 py-4 sm:py-6 max-w-[1560px] mx-auto w-full mt-16 sm:mt-20">
      <div className="flex flex-col sm:flex-row w-full items-center justify-between gap-8 mb-4">
        <div className="flex items-center">
          {timeRanges.map((range) => (
            <button
              key={range.value}
              onClick={() => {
                const url = new URL(window.location.href);
                url.searchParams.set('range', range.value);
                window.history.pushState({}, '', url);
              }}
              className="w-20"
            >
              <motion.span
                className={`block text-xs w-full ${
                  timeRange === range.value
                    ? 'text-zinc-950 font-[550]'
                    : 'hover:text-zinc-700 text-zinc-400 font-normal text-xs'
                }`}
                animate={{
                  color:
                    timeRange === range.value
                      ? 'rgb(244, 244, 245)'
                      : 'rgb(113, 113, 122)',
                }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 20,
                }}
                layout
              >
                {range.label}
              </motion.span>
            </button>
          ))}
        </div>
      </div>

      <div
        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 sm:gap-16 mb-16 [perspective:1000px]"
        key={timeRange}
      >
        {songs.map((song, index) => {
          const baseDelay = 1.1 - 1 / Math.pow(1.1, index);

          return (
            <motion.div
              key={song.id}
              onClick={() => handlePlay(song)}
              initial={{
                opacity: 0,
                scale: 1.1,
                y: -5,
                z: -100,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                z: 0,
              }}
              transition={{
                duration: 1.2,
                delay: baseDelay,
                ease: [0.23, 1, 0.32, 1],
              }}
              className="p-2 sm:p-4 w-full place-self-center cursor-default transiton focus:outline-none [transform-style:preserve-3d]"
            >
              <div className="flex flex-col items-start gap-y-2 w-full">
                {song.album.images[0] && (
                  <div className="image-icon relative w-full h-auto aspect-square">
                    <div className="w-full h-0 pb-[100%] relative">
                      <Image
                        src={song.album.images[0].url}
                        alt={song.name}
                        fill
                        sizes="(max-width: 640px) 160px, 240px"
                        className="object-cover absolute inset-0 border border-black/5 rounded-xl"
                        loading="eager"
                      />
                    </div>
                  </div>
                )}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: 0.3,
                    delay: baseDelay + 0.8,
                  }}
                  className="flex flex-col min-w-0 w-full mt-2"
                >
                  <p className="text-[0.6rem] font-medium text-zinc-500 mt-2">
                    {index + 1 < 10 ? '0' + (index + 1) : index + 1}.
                  </p>
                  <div className="flex items-center justify-between">
                    <h2 className="w-[90%] font-medium text-[0.75rem] truncate text-zinc-100">
                      {song.name}
                    </h2>
                  </div>
                  <p className="text-[0.6rem] text-zinc-400 font-normal truncate">
                    {song.artists.map((artist) => artist.name).join(', ')}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          );
        })}
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
