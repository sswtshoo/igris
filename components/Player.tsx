'use client';

import { useTrackAudio } from '@/utils/TrackAudioProvider';
import { Play, Pause, SkipForward, SkipBack } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

export default function Player() {
  const {
    currentSong,
    isPlaying,

    pauseTrack,
    playTrack,

    nextTrack,
    previousTrack,
  } = useTrackAudio();
  const [isExpanded, setIsExpanded] = useState(false);
  const { data: session } = useSession();

  if (!session) return null;

  if (!currentSong) return null;

  const handlePlayPause = () => {
    if (isPlaying) {
      pauseTrack();
    } else {
      playTrack();
    }
  };

  const containerVariants = {
    collapsed: {
      width: 'auto',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25,
        duration: 0.2,
        mass: 0.6,
      },
    },
    expanded: {
      width: 'auto',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25,
        when: 'beforeChildren',
        duration: 0.2,
        mass: 0.6,
      },
    },
  };

  const controlsVariants = {
    initial: {
      opacity: 0,
      width: 0,
      marginLeft: 0,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
    animate: {
      opacity: 1,
      width: 'auto',
      marginLeft: '1rem',
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      width: 0,
      marginLeft: 0,
      transition: {
        duration: 0.1,
        ease: 'easeOut',
      },
    },
  };

  return (
    <div className="fixed bottom-0 sm:bottom-6 left-1/2 -translate-x-1/2 z-20">
      <div className="px-3 py-6">
        <motion.div
          className="px-2 py-2 bg-white backdrop-blur-2xl border border-black/5 shadow-2xl flex flex-row items-center justify-between gap-x-2 cursor-default"
          variants={containerVariants}
          initial="collapsed"
          animate={isExpanded ? 'expanded' : 'collapsed'}
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
          layout
        >
          <motion.div className="flex items-center gap-x-2 min-w-0" layout>
            <div className="flex-shrink-0">
              <Image
                src={currentSong.album.images[0]?.url}
                alt={currentSong.name}
                height={300}
                width={300}
                className="sm:h-10 sm:w-10 w-8 h-8 aspect-square mr-0 object-cover"
              />
            </div>

            <motion.div
              className="track-details flex flex-col items-start justify-center gap-y-0.5 min-w-0 max-w-48 sm:max-w-72"
              layout
            >
              <motion.p
                className="text-[0.7rem] font-medium text-zinc-950 w-full overflow-hidden text-ellipsis whitespace-nowrap"
                layout
              >
                {currentSong.name}
              </motion.p>
              <motion.p
                className="text-[0.6rem] text-zinc-500 font-medium w-full overflow-hidden text-ellipsis whitespace-nowrap"
                layout
              >
                {currentSong.artists.map((artist) => artist.name).join(', ')}
              </motion.p>
            </motion.div>
          </motion.div>

          <div className="flex sm:hidden items-center justify-center gap-2 text-zinc-800">
            <SkipBack
              className="active:scale-90 transition h-3 sm:h-4"
              onClick={previousTrack}
              weight="fill"
            />
            <button onClick={handlePlayPause}>
              {isPlaying ? (
                <Pause
                  className=" active:scale-90 transition h-4 sm:h-5"
                  weight="fill"
                />
              ) : (
                <Play className="active:scale-90 transition" weight="fill" />
              )}
            </button>
            <SkipForward
              className="active:scale-90 transition h-3 sm:h-4"
              onClick={() => nextTrack()}
              weight="fill"
            />
          </div>

          <AnimatePresence mode="popLayout">
            {isExpanded && (
              <motion.div
                className="hidden sm:flex items-center justify-center gap-2 text-zinc-800 "
                variants={controlsVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                layout
              >
                <SkipBack
                  size={16}
                  className="hover:scale-110 transition duration-200"
                  onClick={previousTrack}
                  weight="fill"
                />
                <button onClick={handlePlayPause}>
                  {isPlaying ? (
                    <Pause
                      size={20}
                      className="hover:scale-110 transition duration-200"
                      weight="fill"
                    />
                  ) : (
                    <Play
                      size={20}
                      className="hover:scale-110 transition duration-200"
                      weight="fill"
                    />
                  )}
                </button>
                <SkipForward
                  size={16}
                  className="hover:scale-110 transition duration-200"
                  onClick={() => nextTrack()}
                  weight="fill"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
