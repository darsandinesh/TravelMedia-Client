import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { RootState } from "../redux/store/sotre";
import { useSelector } from "react-redux";
import io from 'socket.io-client';

const socket = io('http://localhost:32000', { withCredentials: true });

interface WebRTCContextProps {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  inCall: boolean;
  startCall: (userId: string) => void;
  acceptCall: (userId: string, from: string, offer: RTCSessionDescriptionInit) => void;
  endCall: () => void;
}

const WebRTCContext = createContext<WebRTCContextProps | undefined>(undefined);

export const WebRTCProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [guestId, setGuestId] = useState<string>('');
  const [inCall, setInCall] = useState(false);
  const username = useSelector((store: RootState) => store.userAuth.userData?.name);
  const currentUser = useSelector((store: RootState) => store.userAuth.userData?._id);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const isInitiator = useRef<boolean>(false);

  useEffect(() => {
    if (currentUser) {
      socket.emit('userConnected', currentUser);
      return () => {
        socket.emit('userDisconnected', currentUser);
        socket.disconnect();
      };
    }
  }, [currentUser]);

  const createPeerConnection = () => {
    if (peerConnection.current) {
      peerConnection.current.close();
    }
    peerConnection.current = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });

    peerConnection.current.ontrack = (event) => {
      if (event.streams && event.streams.length > 0) {
        setRemoteStream(event.streams[0]);
      }
    };

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('signal', { userId: guestId, type: 'candidate', candidate: event.candidate, context: 'webRTC' });
      }
    };

    return peerConnection.current;
  };

  const startCall = async (userId: string) => {
    try {
      isInitiator.current = true;
      setGuestId(userId);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      setLocalStream(stream);

      const pc = createPeerConnection();
      isInitiator.current = true;

      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socket.emit('callUser', { userToCall: userId, from: username, offer, fromId: currentUser });
      setInCall(true);
    } catch (error) {
      isInitiator.current = false;
      console.error('Error starting call:', error);
    }
  };

  const acceptCall = async (userId: string, from: string, offer: RTCSessionDescriptionInit) => {
    try {
      setGuestId(userId);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      setLocalStream(stream);
  
      const pc = createPeerConnection();
      isInitiator.current = false;
  
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));
  
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
  
      socket.emit('callAccepted', { userId: from, answer, context: 'webRTC', acceptedBy: currentUser });
      setInCall(true);
    } catch (error) {
      console.error('Error accepting call:', error);
    }
  };

  const endCall = useCallback(() => {
    try {
      // Cleanup peer connection
      if (peerConnection.current) {
        peerConnection.current.close();
        peerConnection.current = null;
      }

      // Stop local stream tracks
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
        setLocalStream(null);
      }

      // Stop remote stream tracks
      if (remoteStream) {
        remoteStream.getTracks().forEach((track) => track.stop());
        setRemoteStream(null);
      }

      // Emit callEnded signal
      socket.emit('callEnded', guestId);

      setInCall(false);
      isInitiator.current = false;
      setGuestId('');
    } catch (error) {
      console.error('Error ending call:', error);
    }
  }, [guestId, localStream, remoteStream]);

  useEffect(() => {
    const handleSignal = async (data: { type: string; candidate?: RTCIceCandidateInit; answer?: RTCSessionDescriptionInit; userId: string }) => {
      try {
        if (peerConnection.current) {
          if (data.type === 'candidate' && data.candidate) {
            await peerConnection.current.addIceCandidate(new RTCIceCandidate(data.candidate));
          } else if (data.type === 'answer' && data.answer && !isInitiator.current) {
            await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.answer));
          }
        }
      } catch (error) {
        console.error('Error handling signal:', error);
      }
    };

    const handleCallAcceptedSignal = async (data: { answer: RTCSessionDescriptionInit; acceptedBy: string }) => {
      try {
        if (peerConnection.current && isInitiator.current && data.acceptedBy !== currentUser) {
          await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.answer));
        }
      } catch (error) {
        console.error('Error handling callAcceptedSignal:', error);
      }
    };

    const handleCallEndedSignal = () => {
      if (inCall) {
        endCall();
      }
    };

    socket.on('signal', handleSignal);
    socket.on('callAcceptedSignal', handleCallAcceptedSignal);
    socket.on('callEndedSignal', handleCallEndedSignal);

    return () => {
      console.log('Cleaning up socket listeners');
      socket.off('signal', handleSignal);
      socket.off('callAcceptedSignal', handleCallAcceptedSignal);
      socket.off('callEndedSignal', handleCallEndedSignal);
    };
  }, [endCall, inCall]);

  return (
    <WebRTCContext.Provider value={{ localStream, remoteStream, inCall, startCall, acceptCall, endCall }}>
      {children}
    </WebRTCContext.Provider>
  );
};

export const useWebRTC = (): WebRTCContextProps => {
  const context = useContext(WebRTCContext);
  if (!context) {
    throw new Error('useWebRTC must be used within a WebRTCProvider');
  }
  return context;
};