import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, IconButton, InputBase, List, ListItem, ListItemAvatar, ListItemText, Avatar, Button, Modal } from '@mui/material';
import { VideoCall, AttachFile, Mic, Send, CallEnd } from '@mui/icons-material';
import Navbar from '../Home/NavBar/NavBar';
import { HiUserAdd } from "react-icons/hi";
import { BsChatDots } from "react-icons/bs";
import { useLocation } from 'react-router-dom';
import SearchUser from './SearchUser';

const Chat = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([
        { text: 'Hello!', user: 'John Doe' },
        { text: 'Hi there!', user: 'Jane Smith' },
    ]);
    const [users, setUsers] = useState([]);
    const [file, setFile] = useState<File | null>(null);
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
    const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [openSearchUser, setOpenSearchUser] = useState(false);

    const location = useLocation();
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const endOfMessagesRef = useRef<HTMLDivElement | null>(null); // Ref for scrolling

    // Function to handle sending message
    const handleSendMessage = () => {
        if (message.trim()) {
            setMessages([...messages, { text: message, user: 'Me' }]);
            setMessage('');
        }
    };

    // Function to handle voice messages
    const handleVoiceMessage = () => {
        console.log('Voice message');
    };

    // Function to handle file upload
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files ? e.target.files[0] : null;
        setFile(selectedFile);
        if (selectedFile) {
            console.log('Uploaded file:', selectedFile);
        }
    };

    // Function to open the video modal and ask for camera access
    const handleVideoCall = () => {
        setIsVideoModalOpen(true);
        navigator.mediaDevices.getUserMedia({ video: isVideoEnabled, audio: isAudioEnabled })
            .then(stream => {
                setCameraStream(stream);
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            })
            .catch(error => {
                console.error('Error accessing camera:', error);
                // Optional: Show an error message to the user
            });
    };

    // Function to toggle video
    const toggleVideo = () => {
        if (cameraStream) {
            cameraStream.getVideoTracks().forEach(track => {
                track.enabled = !track.enabled;
                setIsVideoEnabled(track.enabled);
            });
        }
    };

    // Function to toggle audio
    const toggleAudio = () => {
        if (cameraStream) {
            cameraStream.getAudioTracks().forEach(track => {
                track.enabled = !track.enabled;
                setIsAudioEnabled(track.enabled);
            });
        }
    };

    // Clean up camera stream when modal closes
    const closeVideoModal = () => {
        if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
        }
        setCameraStream(null);
        setIsVideoEnabled(true);
        setIsAudioEnabled(true);
        setIsVideoModalOpen(false);
    };

    // Scroll to the bottom when messages change
    useEffect(() => {
        if (endOfMessagesRef.current) {
            endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const basepath = location.pathname === '/chats'; // Corrected variable name

    console.log('basepath:', basepath); // Debugging statement

    return (
        <div style={{ height: '100vh', backgroundColor: '#2d3748' }}>
            <Navbar />
            <Box sx={{ display: 'flex', height: '90%', width: '100%', marginTop: '70px', position: 'fixed' }}>
                {/* Sidebar */}
                <div style={{ width: '70px', height: '100vh', backgroundColor: '#4a5568' }}>
                    <div title='Chat' style={{ marginLeft: '4px', backgroundColor: '#1a202c', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40px', borderRadius: '12px', marginTop: '10px', width: '60px', cursor: 'pointer' }}>
                        <BsChatDots size={20} />
                    </div>
                    <hr />
                    <div onClick={() => setOpenSearchUser(true)} title='Add Chat' style={{ marginLeft: '4px', backgroundColor: '#1a202c', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40px', borderRadius: '12px', marginTop: '10px', width: '60px', cursor: 'pointer' }}>
                        <HiUserAdd size={20} />
                    </div>
                </div>

                <Box
                    sx={{
                        width: { xs: '100%', sm: 240 },
                        bgcolor: '#2d3748',
                        borderRight: { sm: '1px solid #4a5568' },
                        overflowY: 'auto',
                        color: 'white',
                    }}
                >

                    <Typography variant="h6" sx={{ p: 2, marginLeft: '20%' }}>Users</Typography>
                    <hr />
                    <List>
                        {
                            users.length === 0
                                ?
                                <div style={{ padding: '60px' }}>
                                    Select user
                                </div>
                                :
                                <div>
                                    {
                                        users.map((user, index) => (
                                            <ListItem key={index} button>
                                                <ListItemAvatar>
                                                    <Avatar
                                                        src={user.profilePic || 'https://via.placeholder.com/50'}
                                                        sx={{ bgcolor: '#4a5568', width: 50, height: 50 }}
                                                    />
                                                </ListItemAvatar>
                                                <ListItemText primary={user?.name} sx={{ color: 'white' }} />
                                            </ListItem>
                                        ))
                                    }
                                </div>
                        }

                    </List>
                </Box>

                {/* Main Chat Area */}
                {
                    basepath
                        ?
                        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', backgroundColor: '#2d3748' }}>
                            <Typography variant="h6">Select a chat to start</Typography>
                        </Box>
                        :
                        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', bgcolor: '#2d3748' }}>
                            {/* Header */}
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    p: 2,
                                    borderBottom: '1px solid #4a5568',
                                    bgcolor: '#2d3748',
                                    color: 'white',
                                }}
                            >
                                <Avatar
                                    src="https://via.placeholder.com/50"
                                    sx={{
                                        mr: 2,
                                        width: 50,
                                        height: 50,
                                        bgcolor: '#4a5568',
                                        backgroundImage: 'url(https://via.placeholder.com/150)',
                                    }}
                                />
                                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                    UserName
                                    <br />
                                    <span style={{ fontSize: '0.8em', color: '#a0aec0' }}>online // offline</span>
                                </Typography>
                                <IconButton sx={{ color: 'white' }} onClick={handleVideoCall}>
                                    <VideoCall />
                                </IconButton>
                            </Box>

                            {/* Chat Area */}
                            <Box
                                sx={{
                                    flex: 1,
                                    p: 2,
                                    overflowY: 'auto',
                                    backgroundColor: '#1a202c',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'flex-end',
                                    maxHeight: 'calc(100vh - 200px)', // Leave space for input
                                }}
                            >
                                {messages.map((msg, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            mb: 2,
                                            textAlign: msg.user === 'Me' ? 'right' : 'left',
                                        }}
                                    >
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                display: 'inline-block',
                                                backgroundColor: msg.user === 'Me' ? '#4a5568' : '#2d3748',
                                                color: 'white',
                                                borderRadius: '12px',
                                                padding: '10px',
                                            }}
                                        >
                                            {msg.text}
                                        </Typography>
                                    </Box>
                                ))}
                                <div ref={endOfMessagesRef} /> {/* For scrolling */}
                            </Box>

                            {/* Input Area */}
                            <Box
                                sx={{
                                    p: 2,
                                    borderTop: '1px solid #4a5568',
                                    bgcolor: '#2d3748',
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                <IconButton color="inherit" component="label">
                                    <input type="file" hidden onChange={handleFileUpload} />
                                    <AttachFile />
                                </IconButton>
                                <InputBase
                                    sx={{
                                        flex: 1,
                                        ml: 1,
                                        bgcolor: '#4a5568',
                                        borderRadius: '4px',
                                        color: 'white',
                                        p: '4px 8px',
                                    }}
                                    placeholder="Type a message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                />
                                <IconButton color="inherit" onClick={handleVoiceMessage}>
                                    <Mic />
                                </IconButton>
                                <IconButton color="inherit" onClick={handleSendMessage}>
                                    <Send />
                                </IconButton>
                            </Box>
                        </Box>
                }
            </Box>

            {/* Video Call Modal */}
            <Modal
                open={isVideoModalOpen}
                onClose={closeVideoModal}
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
                <Box
                    sx={{
                        width: '80%',
                        height: '80%',
                        bgcolor: '#1a202c',
                        borderRadius: '8px',
                        p: 2,
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        color: 'white',
                    }}
                >
                    <video
                        ref={videoRef}
                        autoPlay
                        muted
                        style={{ width: '100%', height: '80%', objectFit: 'cover', borderRadius: '8px' }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mt: 2 }}>
                        <IconButton onClick={toggleAudio} color="inherit">
                            {isAudioEnabled ? <Mic /> : <Mic />}
                        </IconButton>
                        <IconButton onClick={toggleVideo} color="inherit">
                            {isVideoEnabled ? <VideoCall /> : <VideoCall />}
                        </IconButton>
                        <IconButton onClick={closeVideoModal} color="inherit">
                            <CallEnd />
                        </IconButton>
                    </Box>
                </Box>
            </Modal>

            {/** search user modal */}

            {openSearchUser && (
                <SearchUser onClose={() => setOpenSearchUser(false)} />
            )}
        </div>
    );
};

export default Chat;
