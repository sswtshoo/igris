import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { NextResponse } from 'next/server';
import { type Track } from '@/types/spotify';

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

    const initialData = await response.json();

    const total = initialData.total;
    let tracks = initialData.items.map((item: any) => item.track);

    const numberofReq = Math.ceil(total / 50) - 1;
    for (let i = 1; i <= numberofReq; i++) {
      let response = await fetch(
        `https://api.spotify.com/v1/me/tracks?limit=50&offset=${i * 50}`,
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        console.error(`Failed to fetch page ${i}`);
        continue;
      }

      let data = await response.json();
      tracks = tracks.concat(data.items.map((item: any) => item.track));
    }

    return NextResponse.json({ tracks });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
