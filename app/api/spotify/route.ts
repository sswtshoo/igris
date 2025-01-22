import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const response = await fetch(
      'https://api.spotify.com/v1/me/tracks?limit=50',
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json',
        },
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('Spotify API error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch tracks from Spotify' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const tracks = data.items.map((item: any) => item.track);

    return NextResponse.json({ tracks });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
