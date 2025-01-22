'use client';

import { useTrackAudio } from '@/utils/TrackAudioProvider';
import { Play, Pause, SkipForward, SkipBack } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

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

  if (!currentSong) return null;

  const handlePlayPause = () => {
    if (isPlaying) {
      pauseTrack();
    } else {
      playTrack();
    }
  };

  return (
    <motion.div
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20 px-2 py-2 bg-zinc-950 bg-opacity-25 border-[1px] border-opacity-25 border-zinc-200 backdrop-blur-2xl rounded-md flex flex-col items-center gap-y-8 justify-center"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="flex items-center justify-end gap-x-4">
        <div className="track-details max-w-48 min-w-12 flex flex-col items-start justify-center h-full overflow-hidden">
          <h2 className="text-sm font-semibold text-zinc-100 truncate">
            {currentSong.name}
          </h2>
          <p className="text-xs text-zinc-100 font-normal truncate max-w-full">
            {currentSong.artists.map((artist) => artist.name).join(', ')}
          </p>
        </div>
        <img
          src={currentSong.album.images[0]?.url}
          alt={currentSong.name}
          className="h-12 rounded-md aspect-square mr-0 object-cover"
        />
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="flex items-center gap-2 mb-2"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SkipBack
              size={16}
              className="text-zinc-100"
              onClick={previousTrack}
              weight="fill"
            />
            <button onClick={handlePlayPause}>
              {isPlaying ? (
                <Pause size={20} className="text-zinc-100" weight="fill" />
              ) : (
                <Play size={20} className="text-zinc-100" weight="fill" />
              )}
            </button>

            <SkipForward
              size={16}
              className="text-zinc-100"
              onClick={() => nextTrack()}
              weight="fill"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
