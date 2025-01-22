import { type Track, Image, Artist } from './spotify';

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

export interface WebPlaybackState {
  device_id: string | null;
  paused: boolean;
  track_window: {
    current_track: Track & {
      id: string;
      album: {
        name: string;
        id: string;
        images: Image[];
      };
      artists: Artist[];
      name: string;
      uri: string;
    };
  };
  position: number;
  duration: number;
}

export interface PlayerState {
  deviceId: string | null;
  isPaused: boolean;
  isActive: boolean;
  currentTrack: Track;
  position: number;
  duration: number;
  volume: number;
}

export interface SpotifyReadyEvent {
  device: string;
}
