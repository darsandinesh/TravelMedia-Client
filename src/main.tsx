// import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import { BrowserRouter } from 'react-router-dom'
// import { ToastContainer } from "react-toastify";
import { Toaster } from 'sonner';
import "react-toastify/dist/ReactToastify.css";
import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    {/* <React.StrictMode> */}
    <GoogleOAuthProvider clientId="710357521790-bsujsi09kgooq8kctm0ohupinj7ko6cc.apps.googleusercontent.com">
      <Toaster richColors position="top-right" />
      <App />
      {/* <ToastContainer /> */}
      {/* </React.StrictMode> */}
    </GoogleOAuthProvider>
  </BrowserRouter>,
)
