const scopes = [
  'user-read-private',
  'user-library-read',
  'user-read-currently-playing',
  'user-read-recently-played',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-top-read',
  'streaming',
];

const refreshAccessToken = async (token: any) => {
  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      cache: 'no-cache',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString('base64')}`,
      },
      body: new URLSearchParams({
        client_id: process.env.SPOTIFY_CLIENT_ID as string,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET as string,
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken as string,
      }).toString(),
    });

    const refreshedToken = await response.json();

    if (!response.ok) {
      console.log('Error refreshing token');
      throw refreshedToken;
    }

    return {
      ...token,
      accessToken: refreshedToken.access_token,
      expiresAt: Date.now() + refreshedToken.expires_in * 1000,
      refreshToken: refreshedToken.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.log(error);

    return {
      ...token,
      error: 'RefreshError',
    };
  }
};

export { scopes, refreshAccessToken };
