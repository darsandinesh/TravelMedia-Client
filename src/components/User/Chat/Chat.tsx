import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, IconButton, InputBase, List, ListItem, ListItemAvatar, ListItemText, Avatar, Modal } from '@mui/material';
import { VideoCall, AttachFile, Mic, Send, CallEnd } from '@mui/icons-material';
import Navbar from '../Home/NavBar/NavBar';
import { HiUserAdd } from "react-icons/hi";
import { BsChatDots } from "react-icons/bs";
import { useLocation, useNavigate } from 'react-router-dom';
import SearchUser from './SearchUser';
import { ChatData, ImageData, Message } from '../../../interface/Message/IMessage';
import axiosInstance from '../../../constraints/axios/userAxios';
import { messageEndpoints } from '../../../constraints/endpoints/messageEndpoints';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/sotre';
import { toast } from 'sonner';
import socketService from '../../../socket/SocketService';
// import axios from 'axios';

const Chat = () => {
    const [message, setMessage] = useState('');
    // const [users, setUsers] = useState([]);
    const [file, setFile] = useState<File | null>(null);
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
    const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [openSearchUser, setOpenSearchUser] = useState(false);

    const location = useLocation();
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const endOfMessagesRef = useRef<HTMLDivElement | null>(null);

    const navigate = useNavigate()

    //socker implementation

    const [chats, setChats] = useState<ChatData[]>([]);
    const [, setNewMessageChatIds] = useState<Set<string>>(new Set());
    const [data, setData] = useState<ImageData | null>(null);

    const userId = useSelector((store: RootState) => store.userAuth.userData?._id);

    const loadConversation = async () => {
        try {
            const response = await axiosInstance.get(
                `${messageEndpoints.getConversationData}?userId=${userId}`
            );
            console.log(response.data)
            if (response.data.success) {
                console.log(response.data.data)
                const sortedChats = response.data.data.sort(
                    (a: ChatData, b: ChatData) =>
                        new Date(b.lastMessage?.createdAt || 0).getTime() -
                        new Date(a.lastMessage?.createdAt || 0).getTime()
                );
                console.log(sortedChats, '--------------c----------')
                setChats(sortedChats);
            }
        } catch (error) {
            console.log("Error occurred loading conversation users", error);
            // toast("Error occurred, try later");
        }
    };

    const chat = location.state?.chat;
    console.log('chat', chat)

    useEffect(() => {
        loadConversation();
        socketService.connect();

        if (userId) {
            socketService.emitUserOnline(userId);
        }

        socketService.onUserStatusChanged((data) => {
            setChats((prevChats) =>
                prevChats.map((chat) => {
                    const updatedUsers = chat.users.map((user) =>
                        user.id === data.userId
                            ? { ...user, isOnline: data.isOnline }
                            : user
                    );
                    return { ...chat, users: updatedUsers };
                })
            );
        });

        socketService.onNewMessage((message) => {
            setChats((prevChats) => {
                const updatedChats = prevChats.map((chat) =>
                    chat._id === message.chatId
                        ? {
                            ...chat,
                            lastMessage: {
                                ...message,
                                createdAt: new Date().toISOString(),
                            },
                        }
                        : chat
                );
                return updatedChats.sort(
                    (a, b) =>
                        new Date(b.lastMessage?.createdAt || 0).getTime() -
                        new Date(a.lastMessage?.createdAt || 0).getTime()
                );
            });

            if (message.receiverId === userId) {
                setNewMessageChatIds((prev) => new Set(prev).add(message.chatId));
            }
        });

        // Clean up the socket connection
        return () => {
            socketService.disconnect();
        };
    }, [userId]);



    // message area implementation


    async function getMessages() {
        try {
            console.log('getMessage function called')
            if (!userId || !chat) {
                console.error("Missing userId or chat data");
                return;
            }

            const receiverId = location.state.userId;

            if (!receiverId) {
                console.error("Could not determine receiverId");
                return;
            }


            const response = await axiosInstance.get(`${messageEndpoints.getMessage}?userId=${userId}&receiverId=${receiverId}`);
            console.log('message fetched from the backedn', response.data)
            if (response.data.success) {

                setData(response.data.data);
            } else {
                console.error("Error fetching messages:", response.data.message);
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    }

    useEffect(() => {
        if (location.state?.userId) {
            getMessages();
        }

        socketService.connect();

        if (userId) {
            socketService.emitUserOnline(userId);
        }

        const otherUser = location.state?.userId

        socketService.onUserStatusChanged((data) => {
            if (data.userId === otherUser?.id) {
                // setIsOtherUserOnline(data.isOnline);
            }
        });

        return () => {
            socketService.disconnect();
        };
    }, [location.state]);


    useEffect(() => {
        if (chat?._id) {
            socketService.connect();
            socketService.joinConversation(chat._id);

            // const receiverId = chat.lastMessage?.receiverId || chat.users.find(user => user.id !== userId)?.id;

            socketService.onNewMessage((message) => {
                setData(prevData => {
                    const newMessage: Message = {
                        _id: message._id || Date.now().toString(),
                        senderId: message.senderId,
                        receiverId: message.receiverId,
                        content: message.content,
                        chatId: message.chatId,
                        createdAt: message.createdAt || new Date().toISOString(),
                        updatedAt: message.updatedAt || new Date().toISOString(),
                        __v: message.__v || 0
                    };
                    return {
                        ...prevData,
                        messages: [...(prevData?.messages || []), newMessage]
                    };
                });
            });

            return () => {
                console.log("Disconnecting socket");
                socketService.disconnect();
            };
        }
    }, [chat?._id, userId]);


    // const getFormattedDate = (date: string) => {
    //     const today = new Date().toISOString().split('T')[0];
    //     const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    //     if (date === today) return 'Today';
    //     if (date === yesterday) return 'Yesterday';

    //     return new Date(date).toLocaleDateString();
    // };


    const handleSendMessage = async () => {
        try {
            const receiverId = location.state.userId;
            if ((message.trim()) && chat._id && userId && receiverId) {

                socketService.sendMessage({
                    chatId: location.state.chat._id,
                    senderId: userId,
                    receiverId: receiverId,
                    content: message,
                });
                setMessage('');


                // here i am clearing recorded audio and close voice toggle

            } else {
                toast.error("Error something is missing, try later");
                console.error("Missing required data for sending message:", { chatId: chat._id, userId, receiverId, message });
            }
        } catch (error) {
            console.log("Error happened sending message", error);
            toast.error("Error occurred, try later");
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
    }, [message]);


    const handelSelectuser = async (id: string, avatar: string, name: string) => {
        try {
            const response = await axiosInstance.post(`${messageEndpoints.createChatId}?userId=${userId}&recieverId=${id}`);
            console.log(response.data.data, 'selet user for chat');
            navigate('/chats', { state: { userId, avatar, name, chat: response.data.data } })
        } catch (error) {

        }
    }

    let basepath = true
    if (location.state?.userId) {
        basepath = false;
    }


    console.log('basepath:', basepath);
    console.log(location.state)
    // let currentDate = '';

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
                            chats.length === 0
                                ?
                                <div style={{ padding: '60px' }}>
                                    No chats
                                </div>
                                :
                                <div>
                                    {chats.map((chat, chatIndex) => (
                                        <div key={chatIndex}>
                                            {chat.users.map((user, userIndex) => (
                                                <ListItem key={userIndex} onClick={() => handelSelectuser(user.id, user.avatar, user.name)} sx={{cursor:'pointer'}}>
                                                    <ListItemAvatar>
                                                        <Avatar
                                                            src={user.avatar || 'https://via.placeholder.com/50'}
                                                            sx={{ bgcolor: '#4a5568', width: 50, height: 50 }}
                                                        />
                                                    </ListItemAvatar>
                                                    <ListItemText primary={user.name} sx={{ color: 'white' }} />
                                                </ListItem>
                                            ))}
                                        </div>
                                    ))}
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
                                    src={location.state.avatar}
                                    sx={{
                                        mr: 2,
                                        width: 50,
                                        height: 50,
                                        bgcolor: '#4a5568',
                                        backgroundImage: 'url(https://via.placeholder.com/150)',
                                    }}
                                />
                                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                    {location.state?.name}
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
                                {
                                    !data || !data?.messages
                                        ?
                                        'no chats'
                                        :
                                        data?.messages.map((message, index) => {

                                            // const messageDate = new Date(message.createdAt).toISOString().split('T')[0];
                                            // const showDate = messageDate !== currentDate;
                                            // currentDate = messageDate;

                                            return (
                                                <Box
                                                    key={index}
                                                    sx={{
                                                        mb: 2,
                                                        textAlign: message.senderId === userId ? 'right' : 'left',
                                                    }}
                                                >
                                                    <Typography
                                                        variant="body1"
                                                        sx={{
                                                            display: 'inline-block',
                                                            backgroundColor: message.senderId === userId ? '#4a5568' : '#2d3748',
                                                            color: 'white',
                                                            borderRadius: '12px',
                                                            padding: '10px',
                                                        }}
                                                    >
                                                        {message.content}
                                                    </Typography>
                                                </Box>
                                            )
                                        }
                                        )

                                }
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
