'use client';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  if (!session) return null;

  return (
    <nav className="fixed top-0 right-0 left-0 h-8 bg-white border-opacity-25 shadow-zinc-200 z-50">
      <div className="px-4 h-full">
        <div className="flex h-full items-center justify-between">
          <div className="flex items-center justify-start w-1/6 gap-2 sm:gap-4">
            <Link
              href="/songs"
              className="group font-medium sm:font-medium text-zinc-700"
            >
              <span
                className={`text-[0.7rem] font-medium text-zinc-950 bg-left-bottom bg-gradient-to-r from-zinc-700 to-zinc-700 bg-no-repeat ${
                  pathname === '/songs'
                    ? 'bg-[length:100%_1px]'
                    : 'bg-[length:0%_1px] group-hover:bg-[length:100%_1px]'
                } transition-all duration-500 ease-out`}
              >
                Liked Songs
              </span>
            </Link>
          </div>
          <div className="flex items-center justify-center w-1/6">
            <Link
              href="/songs/top"
              className="group text-zinc-700 transition-all duration-300 ease-in-out"
            >
              <span
                className={`text-[0.7rem] font-medium text-zinc-950 bg-left-bottom bg-gradient-to-r from-zinc-700 to-zinc-700 bg-no-repeat ${
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
            className="flex group items-center justify-end gap-x-1 w-2/3"
            onClick={() => signOut({ callbackUrl: '/signin' })}
          >
            <button className="text-[0.7rem] font-medium hover:text-zinc-900 bg-left-bottom bg-gradient-to-r from-zinc-700 to-zinc-700 bg-no-repeat bg-[length:0%_1px] group-hover:bg-[length:100%_1px] transition-all duration-500 ease-out">
              <p>Logout</p>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
