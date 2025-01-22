import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
    error?: any;
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
