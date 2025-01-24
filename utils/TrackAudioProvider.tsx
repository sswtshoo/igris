'use client';

import { type Track } from '@/types/spotify';
import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  createContext,
} from 'react';
import { useSession } from 'next-auth/react';
import {
  type WebPlaybackState,
  PlayerState,
  SpotifyReadyEvent,
} from '@/types/spotifyPlayer';

interface TypeTrackAudioContext {
  currentSong: Track | null;
  isPlaying: boolean;
  seek: (position: number) => void;
  pauseTrack: () => void;
  playTrack: (track?: Track, tracks?: Track[]) => Promise<void>;
  nextTrack: () => void;
  previousTrack: () => void;
  trackProgress: number;
}
declare global {
  interface Window {
    Spotify: {
      Player: {
        new (options: {
          name: string;
          getOAuthToken: (cb: (token: string) => void) => void;
          volume: number;
        }): Spotify.Player;
      };
    };
    onSpotifyWebPlaybackSDKReady: () => void;
  }
}

declare namespace Spotify {
  interface Player {
    connect: () => Promise<boolean>;
    disconnect: () => void;
    addListener: (
      event: string,
      callback: (state: WebPlaybackState) => void
    ) => void;
    removeListener: (
      event: string,
      callback: (state: WebPlaybackState) => void
    ) => void;
    pause: () => Promise<void>;
    resume: () => Promise<void>;
    seek: (position_ms: number) => Promise<void>;
    getCurrentState: () => Promise<WebPlaybackState | null>;
    setVolume: (volume: number) => Promise<void>;
  }
}

export const TrackAudioContext = createContext<TypeTrackAudioContext | null>(
  null
);

export const TrackAudioProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [currentSong, setCurrentSong] = useState<Track | null>(null);
  const [player, setPlayer] = useState<Spotify.Player | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackProgress, setTrackProgress] = useState(0);
  const [queue, setQueue] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [isReady, setIsReady] = useState(false);

  const { data: session } = useSession();
  const progressInterval = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    if (!session?.accessToken) return;

    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: 'igris Player',
        getOAuthToken: (cb) => {
          cb(session.accessToken as string);
        },
        volume: 0.5,
      });

      setPlayer(player);

      player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        setDeviceId(device_id);
        setIsReady(true);

        fetch('https://api.spotify.com/v1/me/player', {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            device_ids: [device_id],
            play: false,
          }),
        });
      });

      player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
        setIsReady(false);
      });

      player.addListener('player_state_changed', async (state) => {
        if (!state) return;

        setCurrentSong(state.track_window.current_track);
        setIsPlaying(!state.paused);
        setTrackProgress(state.position);

        try {
          const response = await fetch(
            'https://api.spotify.com/v1/me/player/queue',
            {
              headers: {
                Authorization: `Bearer ${session?.accessToken}`,
              },
            }
          );

          if (response.ok) {
            const queueData = await response.json();
            if (queueData.queue && Array.isArray(queueData.queue)) {
              const currentTrack = state.track_window.current_track;
              const allTracks = [currentTrack, ...queueData.queue];
              setQueue(allTracks);
              setCurrentIndex(0);
            }
          }
        } catch (error) {
          console.error('Error fetching queue:', error);
        }
      });

      player.connect();
    };

    return () => {
      if (player) {
        player.disconnect();
      }
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [session?.accessToken]);

  useEffect(() => {
    if (isPlaying) {
      progressInterval.current = setInterval(() => {
        setTrackProgress((prev) => prev + 1000);
      }, 1000);
    } else if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [isPlaying]);

  const playTrack = useCallback(
    async (track?: Track, tracks: Track[] = []) => {
      if (!player || !deviceId || !isReady) {
        console.log('Player not ready:', { player, deviceId, isReady });
        return;
      }

      try {
        if (track) {
          const trackIndex = tracks.findIndex((t) => t.id === track.id);
          if (trackIndex !== -1) {
            setQueue(tracks);
            setCurrentIndex(trackIndex);
          }

          const response = await fetch(
            `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
            {
              method: 'PUT',
              headers: {
                Authorization: `Bearer ${session?.accessToken}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                uris: tracks.map((t) => t.uri),
                offset: { position: trackIndex },
              }),
            }
          );

          if (!response.ok) {
            const errorData = await response.json();
            console.error('Spotify play error:', errorData);
            throw new Error(errorData.error?.message || 'Failed to play track');
          }

          setCurrentSong(track);
        } else {
          await player.resume();
        }
        setIsPlaying(true);
      } catch (error) {
        console.error('Error playing track:', error);
      }
    },
    [player, deviceId, session?.accessToken, isReady]
  );

  const pauseTrack = useCallback(async () => {
    if (!player) return;
    await player.pause();
    setIsPlaying(false);
  }, [player]);

  const nextTrack = useCallback(async () => {
    try {
      await fetch('https://api.spotify.com/v1/me/player/next', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });
    } catch (error) {
      console.error('Error skipping to next track:', error);
    }
  }, [session?.accessToken]);

  const previousTrack = useCallback(async () => {
    try {
      await fetch('https://api.spotify.com/v1/me/player/previous', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });
    } catch (error) {
      console.error('Error going to previous track:', error);
    }
  }, [session?.accessToken]);
  const seek = useCallback(
    async (position: number) => {
      if (!player) return;
      await player.seek(position);
      setTrackProgress(position);
    },
    [player]
  );

  const value = {
    currentSong,
    isPlaying,
    seek,
    pauseTrack,
    playTrack,
    trackProgress,
    nextTrack,
    previousTrack,
  };

  return (
    <TrackAudioContext.Provider value={value}>
      {children}
    </TrackAudioContext.Provider>
  );
};

export const useTrackAudio = () => {
  const context = React.useContext(TrackAudioContext);
  if (!context) {
    throw new Error('useTrackAudio must be used within a TrackAudioProvider');
  }
  return context;
};
