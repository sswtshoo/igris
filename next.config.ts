import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      { hostname: 'i.scdn.co' },
      { hostname: 'mosaic.scdn.co' },
      { hostname: 't.scdn.co' },
    ],
  },
};

export default nextConfig;
