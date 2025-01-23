'use client';
import { useSession, signOut } from 'next-auth/react';
import { SignOut } from '@phosphor-icons/react';

export default function Navbar() {
  const { data: session } = useSession();

  if (!session) return null;

  return (
    <nav className="fixed top-0 right-0 left-0 h-16 bg-zinc-200  border-opacity-25 shadow-zinc-200 bg-opacity-0 z-50">
      <div className="px-4 h-full">
        <div className=" flex h-full items-center justify-end">
          {session && (
            <div className="flex items-center right-8 gap-x-1 rounded-full bg-zinc-200 px-2 py-1 hover:scale-105 duration-200">
              <span className="text-sm text-zinc-500 font-medium cursor-default">
                {session.user?.name}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: '/signin' })}
                className="text-xs rounded-md hover:text-zinc-900 transition-colors"
              >
                <SignOut className="text-zinc-500" size={12} weight="fill" />
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
