// import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import { BrowserRouter } from 'react-router-dom'
// import { ToastContainer } from "react-toastify";
import { Toaster } from 'sonner';
import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    {/* <React.StrictMode> */}
    <Toaster richColors  position="top-right"/>
      <App />
      {/* <ToastContainer /> */}
    {/* </React.StrictMode> */}
  </BrowserRouter>,
)
