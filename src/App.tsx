import { Route, Routes } from 'react-router-dom';
import UserRoutes from './routes/UserRoutes';
import AdminRoutes from './routes/AdminRoutes';
import { WebRTCProvider, useWebRTC } from './context/ProviderWebRTC';
import VideoCall from "./components/User/Call/VIdeoCall";
import GlobalIncomingCallHandler from "./components/User/Call/IncommingVideCall";

function App() {
  return (
    <div className="w-full min-h-screen">
      <WebRTCProvider>
        <Routes>
          <Route path='/admin/*' element={<AdminRoutes />} />
          <Route path='/*' element={<UserRoutes />} />
        </Routes>
        <GlobalIncomingCallHandler />
        <GlobalVideoCallHandler />
      </WebRTCProvider>
    </div>
  );
}

const GlobalVideoCallHandler: React.FC = () => {
  const { localStream, remoteStream, inCall, endCall } = useWebRTC();

  if (!inCall) return null;

  return (
    <VideoCall
      localStream={localStream}
      remoteStream={remoteStream}
      onEndCall={endCall}
    />
  );
}

export default App;
