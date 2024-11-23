// GlobalIncomingCallHandler.tsx
import React, { useEffect, useState } from "react";
import { useWebRTC } from "../../../context/ProviderWebRTC";
import { useSelector } from "react-redux";
import io from 'socket.io-client';
import { RootState } from "../../../redux/store/sotre";

const socket = io('https://travelmedia.fun');

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
            maxWidth: '320px', // equivalent to 'md:w-80'
            backgroundColor: 'white',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
            overflow: 'hidden',
        }}>
            <div style={{ padding: '16px' }}>
                <h4 style={{ fontWeight: 'bold', fontSize: '1.125rem' }}>{callerName}</h4>
                <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>Incoming video call...</p>
            </div>
            <div style={{ display: 'flex' }}>
                <button
                    onClick={onAccept}
                    style={{
                        flex: 1,
                        backgroundColor: '#10B981', // green-500
                        color: 'white',
                        padding: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s',
                    }}
                // onMouseOver={(e) => e.target.style.backgroundColor = '#059669'} // green-600
                // onMouseOut={(e) => e.target.style.backgroundColor = '#10B981'} // green-500
                >
                    Accept
                </button>
                <button
                    onClick={onReject}
                    style={{
                        flex: 1,
                        backgroundColor: '#EF4444', // red-500
                        color: 'white',
                        padding: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s',
                    }}
                // onMouseOver={(e) => e.target.style = '#DC2626'} // red-600
                // onMouseOut={(e) => e.target.style.backgroundColor = '#EF4444'} // red-500
                >
                    Reject
                </button>
            </div>
        </div>

    );
};

const GlobalIncomingCallHandler: React.FC = () => {
    const { acceptCall, endCall } = useWebRTC();
    const [incomingCall, setIncomingCall] = useState<{ from: string; callerName: string; offer: RTCSessionDescriptionInit } | null>(null);
    const userId = useSelector((store: RootState) => store.userAuth.userData?._id) || '';

    useEffect(() => {
        const handleIncomingCall = (data: { from: string; callerName: string; offer: RTCSessionDescriptionInit }) => {
            console.log('Incoming call data:', data.from);
            console.log('userId:', userId);
            if (data.from != userId) {
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