'use client';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { image } from 'motion/react-client';

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  if (!session) return null;

  const imgUrl = session.user.image;

  return (
    <nav className="top-0 right-0 left-0 h-16 bg-black/0 backdrop-blur-xl border-opacity-25 shadow-zinc-800 z-50 border-b border-black/15">
      <div className="px-4 h-full">
        <div className="flex h-full items-center justify-between px-2">
          <div className="flex flex-row items-center gap-4">
            <div className="flex items-center">
              <Link
                href="/songs"
                className="group transition-all duration-300 ease-in-out"
              >
                <span
                  className={`text-[11px] sm:text-sm font-normal bg-left-bottom bg-no-repeat ${
                    pathname === '/songs'
                      ? 'text-darker'
                      : ' group-hover:text-darker text-dark'
                  } transition-all duration-300 ease-out`}
                >
                  Liked Songs
                </span>
              </Link>
            </div>
            <div className="flex items-center">
              <Link
                href="/songs/top"
                className="group transition-all duration-300 ease-in-out"
              >
                <span
                  className={`text-[11px] sm:text-sm font-normal bg-left-bottom bg-no-repeat ${
                    pathname === '/songs/top'
                      ? 'text-darker'
                      : ' group-hover:text-dark text-darker'
                  } transition-all duration-300 ease-out`}
                >
                  Top Songs
                </span>
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button
              onClick={() => signOut({ callbackUrl: '/signin' })}
              className="group text-zinc-200"
            >
              <Image
                src={imgUrl as string}
                alt={session.user.name as string}
                width={10}
                height={10}
                className=" h-4 w-4 sm:h-6 sm:w-6 aspect-square rounded-md"
              />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
