"use client";

import { type Track } from "@/types/spotify";
import { useEffect, useState } from "react";
import Loader from "@/components/ui/loader";
import { useTrackAudio } from "@/utils/TrackAudioProvider";
import { motion } from "motion/react";
import { Suspense } from "react";
import Lenis from "lenis";
import { Play } from "@phosphor-icons/react";
import Image from "next/image";
import { useSpotifyData } from "@/utils/SpotifyDataProvider";
import { useSession, signIn } from "next-auth/react";

function SongsContent() {
  const { allTracks, isLoading, error } = useSpotifyData();
  const { playTrack, pauseTrack, currentSong, isPlaying } = useTrackAudio();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
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

  const { data: session, status: sessionStatus } = useSession({
    required: true,
  });

  const handlePlay = (track: Track) => {
    if (currentSong?.id === track.id && isPlaying) {
      pauseTrack();
    } else {
      playTrack(track, songs);
    }
  };

  useEffect(() => {
    if (error) {
      console.error("Error fetching songs", error);
    }
  }, [error]);

  if (isLoading)
    return (
      <div className="h-full z-50">
        <Loader />
      </div>
    );
  if (error) {
    return (
      <div className="p-6 flex h-screen flex-col w-full items-center justify-center text-center">
        <p className="text-red-500 mb-2 text-lg">
          {error.message || "Error loading songs"}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="text-base bg-zinc-200 border border-black/10 shadow-lg px-3 py-2 rounded-md text-zinc-600 hover:text-zinc-800 hover:scale-105 transition duration-300"
        >
          <span>Try Again</span>
        </button>
      </div>
    );
  }

  const songs: Track[] = allTracks || [];
  return (
    <div className="px-8 md:px-8 py-4 sm:py-6 max-w-screen-2xl mx-auto w-full mt-16 sm:mt-20 overflow-hidden">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 sm:gap-16 mb-24 [perspective:1000px]">
        {songs.map((song, index) => {
          const baseDelay = Math.min(0, Math.exp(index / 50) - 0.75);
          return (
            <motion.div
              key={index}
              onClick={() => handlePlay(song)}
              initial={{
                opacity: 0,
                y: 20,
                filter: "blur(5px)",
              }}
              animate={{
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
              }}
              transition={{
                duration: 0.5,
                type: "spring",
                bounce: 0,
                delay: baseDelay,
              }}
              className="group p-2 sm:p-4 place-self-center w-full cursor-default transiton focus:outline-none [transform-style:preserve-3d] hover:cursor-pointer"
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
                        className="object-cover absolute inset-0 border rounded-xl shadow-md group-hover:opacity-80 border-zinc-300/25 transition-opacity duration-300"
                        loading="eager"
                      />
                    </div>
                    <div className="absolute opacity-0 p-3 rounded-full backdrop-blur-xl inset-0 place-self-center bg-zinc-950/80 bg-opacity-0 group-hover:opacity-100 group-hover:bg-opacity-100 transition duration-300 z-50">
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
                  <div className="flex items-center justify-between">
                    <h2 className="w-[90%] font-medium text-[0.75rem] truncate text-zinc-700">
                      {song.name}
                    </h2>
                  </div>
                  <p className="text-[0.6rem] text-zinc-500 font-normal truncate">
                    {song.artists.map((artist) => artist.name).join(", ")}
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
