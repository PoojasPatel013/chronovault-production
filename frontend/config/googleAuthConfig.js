export const googleAuthConfig = {
  clientId: import.meta.VITE_GOOGLE_CLIENT_ID || '382180651353-opbg8pmci5rk5qtdu21leabtabhpcvvb.apps.googleusercontent.com',
  scope: 'email profile',
  redirectUri: 'https://chronovault-production.onrender.com/api/auth/google/callback',
  origin: 'https://chronovault-web-app-omega.vercel.app'
};
