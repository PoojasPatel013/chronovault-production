export const googleAuthConfig = {
  clientId: process.env.VITE_GOOGLE_CLIENT_ID || '382180651353-opbg8pmci5rk5qtdu21leabtabhpcvvb.apps.googleusercontent.com',
  scope: 'email profile',
  redirectUri: 'http://localhost:8000/api/auth/google/callback',
  origin: 'http://localhost:5173'
};
