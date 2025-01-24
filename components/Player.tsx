'use client';

import { useTrackAudio } from '@/utils/TrackAudioProvider';
import { Play, Pause, SkipForward, SkipBack } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { useSession } from 'next-auth/react';

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
      },
    },
    expanded: {
      width: 'auto',
      transition: {
        type: 'spring',
        stiffness: 1000,
        damping: 50,
        when: 'beforeChildren',
        duration: 0.2,
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
    <div className="fixed bottom-4 sm:bottom-4 left-1/2 -translate-x-1/2 z-20">
      <div className="px-4 py-6">
        <motion.div
          className="px-2 py-2 bg-white backdrop-blur-2xl border-[1px] border-opacity-25 border-zinc-400  rounded-lg flex flex-row items-center gap-x-4 justify-center cursor-default"
          variants={containerVariants}
          initial="collapsed"
          animate={isExpanded ? 'expanded' : 'collapsed'}
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
          layout
        >
          <motion.div className="flex items-center justify-end gap-x-2" layout>
            <img
              src={currentSong.album.images[0]?.url}
              alt={currentSong.name}
              className="h-10 rounded-[0.250rem] aspect-square mr-0 object-cover"
            />
            <motion.div
              className="track-details max-w-48 sm:max-w-64 min-w-12 flex flex-col items-start justify-center gap-y-0 ml-1 h-full overflow-hidden"
              layout
            >
              <motion.h2
                className="text-base font-semibold text-zinc-800 truncate"
                layout
              >
                {currentSong.name}
              </motion.h2>
              <motion.p
                className="text-xs text-zinc-800 font-normal truncate max-w-full"
                layout
              >
                {currentSong.artists.map((artist) => artist.name).join(', ')}
              </motion.p>
            </motion.div>
          </motion.div>

          <div className="flex sm:hidden items-center justify-center gap-2">
            <SkipBack
              size={16}
              className="text-zinc-700 active:scale-90 transition"
              onClick={previousTrack}
              weight="fill"
            />
            <button onClick={handlePlayPause}>
              {isPlaying ? (
                <Pause
                  size={20}
                  className="text-zinc-700 active:scale-90 transition"
                  weight="fill"
                />
              ) : (
                <Play
                  size={20}
                  className="text-zinc-700 active:scale-90 transition"
                  weight="fill"
                />
              )}
            </button>
            <SkipForward
              size={16}
              className="text-zinc-700 active:scale-90 transition"
              onClick={() => nextTrack()}
              weight="fill"
            />
          </div>

          <AnimatePresence mode="popLayout">
            {isExpanded && (
              <motion.div
                className="hidden sm:flex items-center justify-center gap-2"
                variants={controlsVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                layout
              >
                <SkipBack
                  size={16}
                  className="text-zinc-700 hover:scale-110 transition duration-200"
                  onClick={previousTrack}
                  weight="fill"
                />
                <button onClick={handlePlayPause}>
                  {isPlaying ? (
                    <Pause
                      size={20}
                      className="text-zinc-700 hover:scale-110 transition duration-200"
                      weight="fill"
                    />
                  ) : (
                    <Play
                      size={20}
                      className="text-zinc-700 hover:scale-110 transition duration-200"
                      weight="fill"
                    />
                  )}
                </button>
                <SkipForward
                  size={16}
                  className="text-zinc-700 hover:scale-110 transition duration-200"
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
