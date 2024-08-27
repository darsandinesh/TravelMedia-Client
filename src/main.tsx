import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import { GoogleOAuthProvider } from '@react-oauth/google';

// const clientId = process.env.REACT_APP_OAUTH_CLIENTID;

// if (!clientId) {
//   console.error("Google OAuth client ID is not defined. Please set REACT_APP_OAUTH_CLIENTID in your .env file.");
// }

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <GoogleOAuthProvider clientId={''}>
      <Toaster richColors position="top-right" />
      <App />
    </GoogleOAuthProvider>
  </BrowserRouter>,
);
