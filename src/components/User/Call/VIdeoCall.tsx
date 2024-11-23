import React, { useEffect, useRef, useState } from "react";
import { IconButton } from '@mui/material';
import { MdVideocamOff, MdVideocam, MdMicOff, MdMic, MdCallEnd } from "react-icons/md";

interface VideoCallProps {
    localStream: MediaStream | null;
    remoteStream: MediaStream | null;
    onEndCall: () => void;
}

const VideoCall: React.FC<VideoCallProps> = ({ localStream, remoteStream, onEndCall }) => {
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const [isCameraOff, setIsCameraOff] = useState(false);
    const [isMicOff, setIsMicOff] = useState(false);

    useEffect(() => {
        if (localVideoRef.current && localStream) {
            localVideoRef.current.srcObject = localStream;
        }
    }, [localStream]);

    useEffect(() => {
        if (remoteVideoRef.current && remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream;
        }
    }, [remoteStream]);

    const handleToggleCamera = () => {
        if (localStream) {
            localStream.getVideoTracks().forEach(track => track.enabled = !track.enabled);
            setIsCameraOff(!isCameraOff);
        }
    };

    const handleToggleMic = () => {
        if (localStream) {
            localStream.getAudioTracks().forEach(track => track.enabled = !track.enabled);
            setIsMicOff(!isMicOff);
        }
    };

    return (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(31, 41, 55, 0.9)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            {/* Remote video (full screen) */}
            <video
                ref={remoteVideoRef}
                autoPlay
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />

            {/* Local video (picture-in-picture) */}
            <video
                ref={localVideoRef}
                autoPlay
                muted
                style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    width: '25%',
                    border: '2px solid white',
                    borderRadius: '12px',
                    zIndex: 10,
                }}
            />

            {/* Control buttons */}
            <div style={{ position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '16px' }}>
                <IconButton onClick={handleToggleCamera} style={{ backgroundColor: '#3b82f6', color: 'white' }}>
                    {isCameraOff ? <MdVideocamOff size={24} /> : <MdVideocam size={24} />}
                </IconButton>
                <IconButton onClick={handleToggleMic} style={{ backgroundColor: '#3b82f6', color: 'white' }}>
                    {isMicOff ? <MdMicOff size={24} /> : <MdMic size={24} />}
                </IconButton>
                <IconButton onClick={onEndCall} style={{ backgroundColor: '#ef4444', color: 'white' }}>
                    <MdCallEnd size={24} />
                </IconButton>
            </div>
        </div>
    );
};

export default VideoCall;