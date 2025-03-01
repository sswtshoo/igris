'use client';

import { type Track } from '@/types/spotify';
import { useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import { fetcher } from '@/utils/fetcher';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Loader from '@/components/ui/loader';
import { useTrackAudio } from '@/utils/TrackAudioProvider';
import { motion } from 'motion/react';
import { Suspense } from 'react';
import Lenis from 'lenis';
import Link from 'next/link';

import Image from 'next/image';

function SongsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const { playTrack, pauseTrack, currentSong, isPlaying } = useTrackAudio();
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);

  const { data: session, status: sessionStatus } = useSession({
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

  const handleImageLoad = (songId: string) => {
    setLoadedImages((prev) => {
      const newSet = new Set(prev);
      newSet.add(songId);
      return newSet;
    });
  };

  useEffect(() => {
    if (!data?.tracks) return;
    if (loadedImages.size === data.tracks.length) {
      setAllImagesLoaded(true);
    }
  }, [loadedImages, data?.tracks]);

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

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="p-6 flex h-full w-full items-center justify-center text-center">
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
    <div className="px-8 md:px-8 py-4 sm:py-6 max-w-[1560px] mx-auto w-full mt-16 sm:mt-20">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 sm:gap-16 mb-16 [perspective:1000px]">
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
              className="p-2 sm:p-4 place-self-center w-full cursor-default transiton focus:outline-none [transform-style:preserve-3d]"
            >
              <div className="flex flex-col items-start justify-center gap-y-2 w-full">
                {song.album.images[0] && (
                  <div className="image-icon relative group w-full h-auto aspect-square">
                    <div className="w-full h-0 pb-[100%] relative">
                      <Image
                        src={song.album.images[0].url}
                        alt={song.name}
                        fill
                        sizes="(max-width: 640px) 160px, 240px"
                        className="object-cover absolute inset-0 border border-black/5"
                        loading="eager"
                        onLoad={() => handleImageLoad(song.id)}
                      />
                    </div>
                    <Link
                      className="absolute top-2 right-2 h-6 w-auto px-1 bg-zinc-600/25 backdrop-blur-lg flex items-center justify-center rounded-full text-zinc-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                      href={song.external_urls.spotify}
                      prefetch={false}
                      target="_blank"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <motion.div
                        className="flex items-center gap-x-1"
                        initial={{ width: 'auto' }}
                        whileHover={{ width: 'auto' }}
                      >
                        <Image
                          src="/Primary_Logo_White_CMYK.svg"
                          alt="Spotify"
                          width={12}
                          height={12}
                        />
                        <p className="text-[0.6rem] font-semibold text-white">
                          OPEN IN SPOTIFY
                        </p>
                      </motion.div>
                    </Link>
                  </div>
                )}
                {allImagesLoaded && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: 0.3,
                      delay: baseDelay + 0.3,
                    }}
                    className="flex flex-col min-w-0 w-full mt-2"
                  >
                    <h2 className="font-medium text-[0.6rem] truncate text-zinc-900">
                      {song.name}
                    </h2>
                    <p className="text-[0.6rem] text-zinc-400 font-normal truncate">
                      {song.artists.map((artist) => artist.name).join(', ')}
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
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
