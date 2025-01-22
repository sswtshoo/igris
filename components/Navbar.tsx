'use client';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { SignOut } from '@phosphor-icons/react';

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="fixed top-0 right-0 left-0 h-16 bg-zinc-950 border-b-[1px] border-zinc-200 border-opacity-25 shadow-zinc-200 backdrop-blur-2xl bg-opacity-25 z-50">
      <div className="mx-auto px-12 sm:px-6 lg:px-4">
        <div className="flex justify-between h-16 items-center ml-4">
          {session && (
            <div className="flex items-center mr-4 gap-x-2">
              <span className="text-sm text-zinc-300 font-medium cursor-default">
                {session.user?.name}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: '/signin' })}
                className="text-sm rounded-md hover:text-zinc-900 transition-colors"
              >
                <SignOut className="text-zinc-300" size={15} weight="fill" />
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
