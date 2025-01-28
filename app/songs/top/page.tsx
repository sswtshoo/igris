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
import Image from 'next/image';
import { Link as LinkIcon } from '@phosphor-icons/react';

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
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-red-500">Error loading top tracks</div>
      </div>
    );

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
    <div className="px-2 sm:px-4 md:px-8 py-4 sm:py-6 max-w-[1320px] mx-auto w-full mt-16 sm:mt-20">
      <div className="flex flex-col sm:flex-row sm:justify-between mx-4 items-center gap-4 mb-6">
        <div className="flex items-center gap-2 sm:gap-4">
          <h1 className="text-2xl sm:text-4xl font-medium sm:font-semibold text-zinc-950">
            Top 50 Songs
          </h1>
          <Link
            href="/songs"
            className="text-zinc-600 text-[10px] sm:text-base hover:text-zinc-800 hover:underline"
          >
            ← Liked Songs
          </Link>
        </div>
        <div className="flex items-center justify-center gap-1 p-[6px] bg-white shadow-md border border-zinc-950 border-opacity-5 rounded-full">
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
                  className={`block py-[6px] font-semibold text-xs rounded-full w-full ${
                    timeRange === range.value
                      ? 'bg-zinc-950 text-zinc-100'
                      : 'hover:bg-zinc-200 text-zinc-500'
                  }`}
                  animate={{
                    backgroundColor:
                      timeRange === range.value
                        ? 'rgb(9, 9, 11)'
                        : 'transparent',
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
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4 mb-16">
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
            whileHover={{
              scale: 1.05,
            }}
            whileTap={{ scale: 0.95, rotate: '5deg' }}
            transition={{
              duration: 0.3,
              type: 'spring',
              stiffness: 300,
              damping: 20,
              mass: 0.6,
            }}
            className="p-2 sm:p-4 max-w-60 cursor-default transiton focus:outline-none"
          >
            <div className="flex flex-col items-start gap-y-2">
              {song.album.images[0] && (
                <div className="image-icon relative group flex-shrink-0">
                  <Image
                    src={song.album.images[0].url}
                    alt={song.name}
                    width={300}
                    height={300}
                    className="w-full h-full rounded-[0.250rem] object-cover aspect-square shadow-xl"
                    loading="eager"
                  />
                  <Link
                    className="absolute top-2 right-2 h-8 w-8 bg-zinc-600 bg-opacity-25 backdrop-blur-lg flex items-center justify-center rounded-full text-zinc-100 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 z-10"
                    href={song.external_urls.spotify}
                    prefetch={false}
                    target="_blank"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <LinkIcon size={20} className="" weight="bold" />
                  </Link>
                </div>
              )}
              <div className="flex flex-col min-w-0 max-w-full">
                <h2 className="font-bold text-sm truncate text-zinc-950">
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
