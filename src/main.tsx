import ReactDOM from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import  store,{persistor} from './redux/store/sotre'; // Correct path

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_REACT_APP_OAUTH_CLIENTID}>
          <Toaster richColors position="top-right" />
          <App />
        </GoogleOAuthProvider>
      </PersistGate>
    </Provider>
  </BrowserRouter>
);
