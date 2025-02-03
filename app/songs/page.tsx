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
import { Suspense } from 'react';
import Lenis from 'lenis';
import Link from 'next/link';
import { Link as LinkIcon, CaretRight } from '@phosphor-icons/react';
import Image from 'next/image';

function SongsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const { playTrack, pauseTrack, currentSong, isPlaying } = useTrackAudio();

  const { data: session, status } = useSession({
    required: true,
  });

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
    <div className="px-2 sm:px-4 md:px-8 py-4 sm:py-6 max-w-[1560px] mx-auto w-full mt-16 sm:mt-20">
      <div className="flex items-baseline justify-center sm:justify-start gap-2 sm:gap-4 mb-4">
        <Link
          href="/songs"
          className="text-sm group font-medium sm:font-medium text-zinc-950 ml-2 sm:ml-4"
        >
          <span className="text-sm font-medium bg-left-bottom bg-gradient-to-r from-zinc-700 to-zinc-700 bg-no-repeat bg-[length:100%_2px] transition-all duration-500 ease-out">
            Liked Songs
          </span>
        </Link>
        <Link
          className="group text-zinc-500 transition-all duration-300 ease-in-out"
          href="/songs/top"
        >
          <span className="text-sm font-normal sm:font-normal bg-left-bottom bg-gradient-to-r from-zinc-700 to-zinc-700 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
            Top Songs
          </span>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-8 mb-8">
        {songs.map((song) => (
          <motion.div
            key={song.id}
            onClick={() => handlePlay(song)}
            initial={{
              opacity: 0,
              scale: 0.8,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            whileTap={{ scale: 0.95, rotate: '5deg' }}
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
                <h2 className="font-medium text-xs truncate text-zinc-900">
                  {song.name}
                </h2>
                <p className="text-xs text-zinc-400 font-medium truncate">
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

export default function Songs() {
  return (
    <Suspense fallback={<Loader />}>
      <SongsContent />
    </Suspense>
  );
}
