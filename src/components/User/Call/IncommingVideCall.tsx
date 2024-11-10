import React, { useEffect, useState } from "react";
import { useWebRTC } from "../../../context/ProviderWebRTC";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/sotre";
import io from 'socket.io-client';

const socket = io(import.meta.env.VITE_FRONTEN_URL);

interface IncomingCallNotificationProps {
    callerId: string;
    callerName: string;
    onAccept: () => void;
    onReject: () => void;
}

const IncomingCallNotification: React.FC<IncomingCallNotificationProps> = ({ callerName, onAccept, onReject }) => {
    return (
        <div style={{
            position: 'fixed',
            bottom: '16px',
            right: '16px',
            left: '16px',
            backgroundColor: 'white',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            borderRadius: '0.5rem',
            overflow: 'hidden',
            width: 'auto',
            maxWidth: '320px',
            marginLeft: 'auto',
        }}>
            <div style={{
                padding: '16px',
            }}>
                <h4 style={{
                    fontWeight: 'bold',
                    fontSize: '1.125rem'
                }}>
                    {callerName}
                </h4>
                <p style={{
                    fontSize: '0.875rem',
                    color: '#6B7280'
                }}>
                    Incoming video call...
                </p>
            </div>

            <div style={{
                display: 'flex',
            }}>
                <button
                    onClick={onAccept}
                    style={{
                        flex: 1,
                        backgroundColor: '#10B981',
                        color: 'white',
                        padding: '12px',
                        fontWeight: '600',
                        transition: 'background-color 0.2s',
                        cursor: 'pointer',
                        border: 'none',
                    }}
                    onMouseEnter={(e: any) => e.target.style.backgroundColor = '#059669'}
                    onMouseLeave={(e: any) => e.target.style.backgroundColor = '#10B981'}
                >
                    Accept
                </button>
                <button
                    onClick={onReject}
                    style={{
                        flex: 1,
                        backgroundColor: '#EF4444',
                        color: 'white',
                        padding: '12px',
                        fontWeight: '600',
                        transition: 'background-color 0.2s',
                        cursor: 'pointer',
                        border: 'none',
                    }}
                    onMouseEnter={(e: any) => e.target.style.backgroundColor = '#DC2626'}
                    onMouseLeave={(e: any) => e.target.style.backgroundColor = '#EF4444'}
                >
                    Reject
                </button>
            </div>
        </div>


    );
};



const GlobalIncomingCallHandler: React.FC = () => {
    const { acceptCall, endCall } = useWebRTC();
    const [incomingCall, setIncomingCall] = useState<{ from: string; callerName: string; offer: RTCSessionDescriptionInit, userToCall: string } | null>(null);
    const userId = useSelector((store: RootState) => store.userAuth.userData?._id) || '';

    useEffect(() => {
        const handleIncomingCall = (data: { from: string; callerName: string; offer: RTCSessionDescriptionInit, userToCall: string }) => {
            console.log('Incoming call data:', data);
            console.log('userId:', userId);
            if (userId == data.userToCall) {
                setIncomingCall(data);
            }
        };

        socket.on('incomingCall', handleIncomingCall);

        return () => {
            socket.off('incomingCall', handleIncomingCall);
        };
    }, []);

    const handleAccept = () => {
        if (incomingCall) {
            acceptCall(userId, incomingCall.from, incomingCall.offer);
            setIncomingCall(null);
        }
    };

    const handleReject = () => {
        endCall();
        setIncomingCall(null);
    };

    if (!incomingCall) return null;

    return (
        <IncomingCallNotification
            callerId={incomingCall.from}
            callerName={incomingCall.callerName}
            onAccept={handleAccept}
            onReject={handleReject}
        />
    );
};

export default GlobalIncomingCallHandler;