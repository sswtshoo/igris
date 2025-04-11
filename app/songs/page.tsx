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
      lenis.destroy();
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
    <div className="px-8 md:px-8 py-4 sm:py-6 max-w-screen-2xl mx-auto w-full mt-16 sm:mt-20 overflow-hidden">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 sm:gap-16 mb-16 [perspective:1000px]">
        {songs.map((song, index) => {
          return (
            <motion.div
              key={index}
              onClick={() => handlePlay(song)}
              initial={{
                opacity: 0,
                scale: 1.1,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                duration: 0.5,
                type: 'spring',
                bounce: 0.1,
              }}
              className="p-2 sm:p-4 place-self-center w-full cursor-default transiton focus:outline-none [transform-style:preserve-3d]"
            >
              <div className="flex flex-col items-start justify-center gap-y-2 w-full">
                {song.album.images[0] && (
                  <div className="image-icon relative w-full h-auto aspect-square">
                    <div className="w-full h-0 pb-[100%] relative">
                      <Image
                        src={song.album.images[0].url}
                        alt={song.name}
                        fill
                        sizes="(max-width: 640px) 160px, 240px"
                        className="object-cover absolute inset-0 border border-white/10 rounded-xl"
                        loading="eager"
                        onLoad={() => handleImageLoad(song.id)}
                      />
                    </div>
                  </div>
                )}

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: 0.3,
                  }}
                  className="flex flex-col min-w-0 w-full mt-2"
                >
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

export default function Songs() {
  return (
    <Suspense fallback={<Loader />}>
      <SongsContent />
    </Suspense>
  );
}
