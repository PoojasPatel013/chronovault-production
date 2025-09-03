// frontend/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

// You can load the client ID from environment variable (via Vite) or hardcode for now
// const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '382180651353-opbg8pmci5rk5qtdu21leabtabhpcvvb.apps.googleusercontent.com';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
  <GoogleOAuthProvider clientId="382180651353-opbg8pmci5rk5qtdu21leabtabhpcvvb.apps.googleusercontent.com">
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </GoogleOAuthProvider>
</React.StrictMode>
);

