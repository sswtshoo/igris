// 'use server';

// import { auth, signIn, signOut } from '@/auth';

// export const handleSignIn = async () => {
//   await signIn('spotify');
// };

// export const handleSignOut = async () => {
//   await signOut();
// };

// export const refreshToken = async () => {
//   const session = await auth();
//   const res = await fetch('https://accounts.spotify.com/api/token', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded',
//       Authorization:
//         'Basic ' +
//         btoa(
//           `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
//         ),
//     },
//     body: new URLSearchParams({
//       grant_type: 'refresh_token',
//       refresh_token: session?.refresh_token as string,
//     }).toString(),
//   });
// };
