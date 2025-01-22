'use client';

import { useTrackAudio } from '@/utils/TrackAudioProvider';
import { Play, Pause, SkipForward, SkipBack } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

export default function Player() {
  const {
    currentSong,
    isPlaying,
    seek,
    pauseTrack,
    playTrack,
    trackProgress,
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
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20 px-2 py-2 bg-zinc-950 bg-opacity-25 border-[1px] border-opacity-25 border-zinc-200 backdrop-blur-2xl rounded-md flex items-center gap-x-8 justify-center"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="track-details max-w-48 min-w-min flex flex-col items-start justify-center h-full p-1">
        <h2 className="text-xs font-bold text-zinc-100 truncate">
          {currentSong.name}
        </h2>
        <p className="text-xs text-zinc-100 font-normal truncate">
          {currentSong.artists.map((artist) => artist.name).join(', ')}
        </p>
      </div>
      <img
        src={currentSong.album.images[0]?.url}
        alt={currentSong.name}
        className="h-10 rounded-md aspect-square mr-0 object-cover"
      />
      {isExpanded && (
        <div className="flex items-center gap-2">
          <SkipBack
            weight="fill"
            size={16}
            className="text-zinc-100"
            onClick={previousTrack}
          />
          <button onClick={handlePlayPause}>
            {isPlaying ? (
              <Pause size={16} weight="fill" className="text-zinc-100" />
            ) : (
              <Play size={16} weight="fill" className="text-zinc-100" />
            )}
          </button>

          <SkipForward
            weight="fill"
            size={16}
            className="text-zinc-100"
            onClick={() => nextTrack()}
          />
        </div>
      )}
    </motion.div>
  );
}
