import React, { useEffect, useRef, useState } from "react";
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
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(31, 41, 55, 0.9)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
        }}>

            {!remoteStream && (
                <div style={{ color: 'white', fontSize: '24px', marginBottom: '16px',height:'100px',width:'100px' ,marginTop:'50%'}}>
                    Calling...
                </div>
            )}

            <video
                ref={remoteVideoRef}
                autoPlay
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                }}
            />


            <video
                ref={localVideoRef}
                autoPlay
                muted
                style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    width: '33%',
                    borderWidth: '2px',
                    borderColor: 'white',
                    borderRadius: '0.5rem',
                    zIndex: 10
                }}
            />


            <div style={{
                position: 'absolute',
                bottom: '16px', // Equivalent to bottom-4
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '8px', // Equivalent to space-x-2
            }}>
                <button
                    onClick={handleToggleCamera}
                    style={{
                        backgroundColor: '#3B82F6', // Equivalent to bg-blue-500
                        color: 'white',
                        padding: '8px', // Equivalent to p-2
                        borderRadius: '9999px' // Equivalent to rounded-full
                    }}
                >
                    {isCameraOff ? <MdVideocamOff size={24} /> : <MdVideocam size={24} />}
                </button>
                <button
                    onClick={handleToggleMic}
                    style={{
                        backgroundColor: '#3B82F6', // Equivalent to bg-blue-500
                        color: 'white',
                        padding: '8px', // Equivalent to p-2
                        borderRadius: '9999px' // Equivalent to rounded-full
                    }}
                >
                    {isMicOff ? <MdMicOff size={24} /> : <MdMic size={24} />}
                </button>
                <button
                    onClick={onEndCall}
                    style={{
                        backgroundColor: '#EF4444', // Equivalent to bg-red-500
                        color: 'white',
                        padding: '8px', // Equivalent to p-2
                        borderRadius: '9999px' // Equivalent to rounded-full
                    }}
                >
                    <MdCallEnd size={24} />
                </button>
            </div>
        </div>

    );
};

export default VideoCall;