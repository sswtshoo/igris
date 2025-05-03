'use client';

import { useTrackAudio } from '@/utils/TrackAudioProvider';
import { Play, Pause, SkipForward, SkipBack } from '@phosphor-icons/react';
import { motion, AnimatePresence, MotionConfig } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { prominent } from 'color.js';
import { useMediaQuery } from '@/utils/useMediaQuery';

const formatTime = (ms: number) => {
  if (!ms || isNaN(ms)) return '0:00';
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export default function Player() {
  const {
    currentSong,
    isPlaying,
    pauseTrack,
    playTrack,
    seek,
    nextTrack,
    previousTrack,
    trackProgress,
  } = useTrackAudio();

  const [isClicked, setIsClicked] = useState(false);
  const { data: session } = useSession();
  const [dominantColor, setDominantColor] = useState(
    'rgba(255, 255, 255, 0.6)'
  );

  const isMobile = useMediaQuery('(max-width: 768px)');
  // console.log('is mobile', isMobile);

  const progressRef = useRef<HTMLDivElement>(null);
  const progressPercentage = currentSong?.duration_ms
    ? (trackProgress / currentSong.duration_ms) * 100
    : 0;

  const handlePlayPause = () => {
    if (isPlaying) {
      pauseTrack();
    } else {
      playTrack();
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !currentSong?.duration_ms) return;

    const rect = progressRef.current.getBoundingClientRect();
    const position = (e.clientX - rect.left) / rect.width;
    const seekPosition = Math.floor(position * currentSong.duration_ms);
    seek(seekPosition);
  };

  useEffect(() => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
    }

    if (currentSong) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentSong.name,
        artist: currentSong.artists?.map((a) => a.name).join(', '),
        artwork: currentSong.album?.images?.map((img) => ({
          src: img.url,
          sizes: `${img.width}x${img.height}`,
          type: 'image/jpeg',
        })),
      });
    }
  }, [isPlaying, currentSong]);

  useEffect(() => {
    if (currentSong?.album.images[0]?.url) {
      extractDominantColor(currentSong.album.images[0].url);
    }
  }, [currentSong]);

  useEffect(() => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('play', () => {
        if (!isPlaying) {
          playTrack();
        }
      });

      navigator.mediaSession.setActionHandler('pause', () => {
        if (isPlaying) {
          pauseTrack();
        }
      });

      navigator.mediaSession.setActionHandler('nexttrack', nextTrack);
      navigator.mediaSession.setActionHandler('previoustrack', previousTrack);

      return () => {
        navigator.mediaSession.setActionHandler('play', null);
        navigator.mediaSession.setActionHandler('pause', null);
        navigator.mediaSession.setActionHandler('nexttrack', null);
        navigator.mediaSession.setActionHandler('previoustrack', null);
      };
    }
  }, [isPlaying, playTrack, pauseTrack, nextTrack, previousTrack]);

  const extractDominantColor = async (imageUrl: string) => {
    try {
      const colors = await prominent(imageUrl, { amount: 1 });

      const [r, g, b] = colors;
      const rgbaColor = `rgba(${r}, ${g}, ${b}, 0.6)`;

      setDominantColor(rgbaColor);
      // console.log('Extracted color:', rgbaColor);
    } catch (error) {
      console.error('Error extracting color:', error);
    }
  };

  if (!session) return null;

  if (!currentSong) return null;

  return (
    <MotionConfig transition={{ type: 'spring', duration: 0.5, bounce: 0 }}>
      <AnimatePresence mode="popLayout">
        {!isClicked && (
          <div className="fixed bottom-0 sm:bottom-6 left-1/2 -translate-x-1/2 z-20">
            <div className="px-3 py-6">
              <motion.div
                className="backdrop-blur-2xl shadow-2xl rounded-lg flex flex-row items-center justify-between gap-2 p-2 relative overflow-hidden bg-opacity-10 w-full max-w-md"
                style={{
                  backgroundImage: `url(${currentSong.album.images[0]?.url})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
                layoutId="player-wrapper"
              >
                <motion.div
                  className={`absolute inset-0 bg-opacity-10 backdrop-blur-[80px]`}
                  style={{ backgroundColor: dominantColor }}
                  layoutId="dominant-color"
                />
                <motion.div
                  className="absolute inset-0 bg-black/15"
                  layoutId="black-overlay"
                />
                <motion.div
                  className="flex items-center gap-x-2 min-w-0 flex-1"
                  layout
                >
                  <motion.div
                    className="flex-shrink-0 z-10"
                    layoutId={'song-image'}
                  >
                    <motion.img
                      src={currentSong.album.images[0]?.url}
                      alt={currentSong.name}
                      className="sm:h-14 sm:w-14 w-10 h-10 aspect-square mr-0 object-cover rounded-[4px]"
                      onClick={() => !isMobile && setIsClicked(true)}
                    />
                  </motion.div>

                  <motion.div
                    className="track-details flex flex-col items-start justify-center gap-y-0.5 min-w-0 flex-shrink flex-grow max-w-52 sm:max-w-60 md:max-w-72 z-10"
                    layout
                  >
                    <motion.p
                      className="text-sm font-medium sm:font-bold text-zinc-50 w-full drop-shadow-2xl overflow-hidden text-ellipsis whitespace-nowrap"
                      layoutId="currentsong"
                    >
                      {currentSong.name}
                    </motion.p>
                    <motion.p
                      className="text-[0.6rem] text-zinc-50 font-semibold drop-shadow-2xl w-full overflow-hidden text-ellipsis whitespace-nowrap"
                      layoutId="currentartist"
                      key={currentSong.artists[0].id}
                    >
                      {currentSong.artists
                        .map((artist) => artist.name)
                        .join(', ')}
                    </motion.p>
                  </motion.div>
                </motion.div>

                <div className="flex items-center justify-end gap-1 sm:gap-2 text-zinc-50 z-10 flex-shrink-0">
                  <motion.div layoutId="skipback">
                    <SkipBack
                      className="active:scale-90 transition"
                      onClick={previousTrack}
                      weight="fill"
                      size={16}
                    />
                  </motion.div>

                  <button onClick={handlePlayPause}>
                    {isPlaying ? (
                      <motion.div layoutId="pause">
                        <Pause
                          className=" active:scale-90 transition drop-shadow-md"
                          weight="fill"
                          size={22}
                        />
                      </motion.div>
                    ) : (
                      <motion.div layoutId="play">
                        <Play
                          className="active:scale-90 transition"
                          weight="fill"
                          size={22}
                        />
                      </motion.div>
                    )}
                  </button>
                  <motion.div layoutId="skipforward">
                    <SkipForward
                      className="active:scale-90 transition"
                      onClick={() => nextTrack()}
                      weight="fill"
                      size={16}
                    />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
        {isClicked && (
          <motion.div className="fixed bottom-0 sm:bottom-6 left-1/2 -translate-x-1/2 z-20">
            <motion.div className="">
              <motion.div
                className="backdrop-blur-2xl shadow-2xl rounded-3xl flex flex-col items-center justify-center gap-y-4 p-3 relative overflow-hidden bg-opacity-10"
                style={{
                  backgroundImage: `url(${currentSong.album.images[0]?.url})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundBlendMode: 'hue',
                }}
                layoutId="player-wrapper"
              >
                <motion.div
                  className={`absolute inset-0 bg-opacity-10 backdrop-blur-[80px]`}
                  style={{ backgroundColor: dominantColor }}
                  layoutId="dominant-color"
                />
                <motion.div
                  className="absolute inset-0 bg-black/10"
                  layoutId="black-overlay"
                />
                <motion.div
                  className="flex-shrink-0 z-10"
                  layoutId={'song-image'}
                >
                  <motion.img
                    src={currentSong.album.images[0]?.url}
                    alt={currentSong.name}
                    height={300}
                    width={300}
                    className="sm:h-60 sm:w-60 w-16 h-16 aspect-square mr-0 object-cover rounded-xl shadow-lg"
                    onClick={() => setIsClicked(false)}
                  />
                </motion.div>
                <motion.div
                  className="track-details flex flex-col items-center justify-center text-center min-w-0 flex-shrink-0 max-w-40 sm:max-w-72 md:max-w-96 z-50"
                  layout
                >
                  <motion.p
                    className="text-lg font-semibold max-w-56 marquee text-zinc-50 drop-shadow-md w-full overflow-hidden text-ellipsis whitespace-nowrap"
                    layoutId="currentsong"
                    key={currentSong.name}
                  >
                    {currentSong.name}
                  </motion.p>
                  <motion.p
                    className="text-xs text-zinc-200 font-medium w-full drop-shadow-md overflow-hidden text-ellipsis whitespace-nowrap"
                    layoutId="currentartist"
                    key={currentSong.artists[0].id}
                  >
                    {currentSong.artists
                      .map((artist) => artist.name)
                      .join(', ')}
                  </motion.p>
                </motion.div>
                <div className="flex items-center w-full px-2 gap-0 z-10">
                  <span className="text-xs text-zinc-50 font-medium flex-shrink-0 min-w-[40px] text-center">
                    {formatTime(trackProgress)}
                  </span>
                  <div
                    ref={progressRef}
                    onClick={handleProgressClick}
                    className="relative grow h-2 group cursor-pointer"
                  >
                    <div className="absolute h-1 w-full bg-zinc-400/50 rounded-full top-1/2 -translate-y-1/2">
                      <div
                        className="absolute h-full bg-zinc-50 rounded-full transition-all duration-150"
                        style={{
                          width: `${Math.min(progressPercentage + 1, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-zinc-50 font-medium flex-shrink-0 min-w-[40px] text-center">
                    {formatTime(currentSong.duration_ms)}
                  </span>
                </div>

                <div className="flex items-center justify-center gap-8 text-zinc-50 mt-2 mb-4 z-10">
                  <motion.button layoutId="skipback" onClick={previousTrack}>
                    <SkipBack weight="fill" size={24} />
                  </motion.button>

                  <button onClick={handlePlayPause}>
                    {isPlaying ? (
                      <motion.div layoutId="pause">
                        <Pause weight="fill" size={32} />
                      </motion.div>
                    ) : (
                      <motion.div layoutId="play">
                        <Play weight="fill" size={32} />
                      </motion.div>
                    )}
                  </button>

                  <motion.div layoutId="skipforward">
                    <SkipForward
                      onClick={() => nextTrack()}
                      weight="fill"
                      size={24}
                    />
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
