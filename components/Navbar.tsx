'use client';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  if (!session) return null;

  return (
    <nav className="fixed top-0 right-0 left-0 h-12 bg-black/5 backdrop-blur-xl border-opacity-25 shadow-zinc-200 z-50">
      <div className="px-4 h-full">
        <div className="flex h-full items-center justify-between">
          <div className="flex items-center justify-start w-1/4 sm:w-1/6 gap-2 sm:gap-4">
            <Link
              href="/songs"
              className="group font-medium sm:font-medium text-zinc-700"
            >
              <span
                className={`text-xs font-medium text-zinc-100 bg-left-bottom bg-gradient-to-r from-zinc-300 to-zinc-300 bg-no-repeat ${
                  pathname === '/songs'
                    ? 'bg-[length:100%_1px]'
                    : 'bg-[length:0%_1px] group-hover:bg-[length:100%_1px]'
                } transition-all duration-500 ease-out`}
              >
                Liked Songs
              </span>
            </Link>
          </div>
          <div className="flex items-center justify-center w-1/4 sm:w-1/6">
            <Link
              href="/songs/top"
              className="group text-zinc-700 transition-all duration-300 ease-in-out"
            >
              <span
                className={`text-xs font-medium text-zinc-100 bg-left-bottom bg-gradient-to-r from-zinc-300 to-zinc-300 bg-no-repeat ${
                  pathname === '/songs/top'
                    ? 'bg-[length:100%_1px]'
                    : 'bg-[length:0%_1px] group-hover:bg-[length:100%_1px]'
                } transition-all duration-500 ease-out`}
              >
                Top Songs
              </span>
            </Link>
          </div>

          <div
            className="flex items-center justify-end gap-x-1 w-2/4 sm:w-4/6"
            onClick={() => signOut({ callbackUrl: '/signin' })}
          >
            <button className="text-xs text-zinc-100 group font-medium hover:text-zinc-100 bg-left-bottom bg-gradient-to-r from-zinc-300 to-zinc-300 bg-no-repeat bg-[length:0%_1px] group-hover:bg-[length:100%_1px] transition-all duration-500 ease-out">
              <p className="bg-left-bottom bg-gradient-to-r from-zinc-300 to-zinc-300 bg-no-repeat bg-[length:0%_1px] group-hover:bg-[length:100%_1px] transition-all duration-500 ease-out">
                Logout
              </p>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
