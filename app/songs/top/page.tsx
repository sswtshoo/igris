'use client';

import { useState, useEffect, useRef } from 'react';
import { useTrackAudio } from '@/utils/TrackAudioProvider';
import { motion } from 'motion/react';
import { Suspense } from 'react';
import Loader from '@/components/ui/loader';
import { type Track } from '@/types/spotify';
import Lenis from 'lenis';
import Image from 'next/image';
import { Play } from '@phosphor-icons/react';
import { useSpotifyData } from '@/utils/SpotifyDataProvider';
import { div } from 'motion/react-client';

function TopSongsContent() {
  const timeRanges = [
    { value: 'short_term', label: '4 Weeks' },
    { value: 'medium_term', label: '6 Months' },
    { value: 'long_term', label: '1 Year' },
  ];

  const [timeRange, setTimeRange] = useState('short_term');
  const [activeTab, setActiveTab] = useState(timeRanges[0].value);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeTabElementRef = useRef<HTMLButtonElement>(null);

  const { playTrack, isPlaying, pauseTrack, currentSong } = useTrackAudio();
  const {
    topTracksShortTerm,
    topTracksMediumTerm,
    topTracksLongTerm,
    isLoading,
    error,
  } = useSpotifyData();

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

  useEffect(() => {
    const container = containerRef.current;

    if (activeTab && container) {
      const activeTabElement = activeTabElementRef.current;

      if (activeTabElement) {
        const { offsetLeft, offsetWidth } = activeTabElement;

        const clipLeft = offsetLeft;
        const clipRight = offsetWidth + clipLeft;

        container.style.clipPath = `inset(0 ${Number(100 - (clipRight / container.offsetWidth) * 100).toFixed()}% 0 ${Number((clipLeft / container.offsetWidth) * 100).toFixed()}% round 16px)`;
      }
    }
  }, [activeTab, activeTabElementRef, containerRef]);

  const getTracksForTimeRange = (): Track[] => {
    switch (timeRange) {
      case 'short_term':
        return topTracksShortTerm;
      case 'medium_term':
        return topTracksMediumTerm;
      case 'long_term':
        return topTracksLongTerm;
      default:
        return topTracksShortTerm;
    }
  };

  const handlePlay = (track: Track) => {
    if (currentSong?.id === track.id && isPlaying) {
      pauseTrack();
    } else {
      playTrack(track, songs);
    }
  };

  const songs = getTracksForTimeRange();

  if (isLoading)
    return (
      <div className="h-full z-50">
        <Loader />
      </div>
    );

  if (error)
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-red-500">Error loading top tracks</div>
      </div>
    );

  return (
    <div className="px-8 md:px-8 py-4 sm:py-6 max-w-[1560px] mx-auto w-full mt-8 sm:mt-16">
      <div className="flex flex-col sm:flex-row w-full items-start justify-between gap-8 mb-4">
        <div className="wrapper relative flex flex-col w-fit ml-4">
          <ul className="relative flex w-full justify-center gap-2">
            {timeRanges.map((range) => (
              <li key={range.label}>
                <button
                  key={range.value}
                  ref={timeRange === range.value ? activeTabElementRef : null}
                  data-tab={range.label}
                  onClick={() => {
                    const url = new URL(window.location.href);
                    url.searchParams.set('range', range.value);
                    window.history.pushState({}, '', url);
                    setTimeRange(range.value);
                    setActiveTab(range.value);
                  }}
                  className="flex h-8 items-center gap-2 rounded-none p-4 text-xs font-medium text-dark"
                >
                  {range.label}
                </button>
              </li>
            ))}
          </ul>
          <div aria-hidden className="clip-path-container" ref={containerRef}>
            <ul className="relative flex w-full justify-center gap-2 bg-darker">
              {timeRanges.map((range) => (
                <li key={range.label}>
                  <button
                    data-tab={range.label}
                    onClick={() => {
                      setActiveTab(range.value);
                    }}
                    className="flex h-8 items-center gap-2 rounded-none p-4 text-xs font-medium text-white"
                    tabIndex={-1}
                  >
                    {range.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div
        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 sm:gap-16 mb-24 [perspective:1000px]"
        key={timeRange}
      >
        {songs.map((song, index) => {
          const baseDelay = Math.min(0, Math.exp(index / 50) - 0.75);

          return (
            <motion.div
              key={index}
              onClick={() => handlePlay(song)}
              initial={{
                opacity: 0,
                y: 20,
                filter: 'blur(5px)',
              }}
              animate={{
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
              }}
              transition={{
                duration: 0.5,
                type: 'spring',
                bounce: 0,
                delay: baseDelay,
              }}
              className="group p-2 sm:p-4 place-self-center w-full cursor-default transiton focus:outline-none [transform-style:preserve-3d] hover:cursor-pointer"
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
                        className="object-cover absolute inset-0 border border-zinc-300/25 rounded-xl group-hover:opacity-75 transition-opacity duration-300"
                        loading="eager"
                      />
                    </div>
                    <div className="absolute opacity-0 p-3 rounded-full backdrop-blur-xl inset-0 place-self-center bg-zinc-950/80 bg-opacity-0 group-hover:opacity-100 group-hover:bg-opacity-100 transition duration-300 z-20">
                      <Play weight="fill" size={25} className="text-white/90" />
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
                  <p className="text-[0.6rem] font-medium text-zinc-500 mt-2">
                    {index + 1 < 10 ? '0' + (index + 1) : index + 1}.
                  </p>
                  <div className="flex items-center justify-between">
                    <h2 className="w-[90%] font-medium text-[0.75rem] truncate text-zinc-700">
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
