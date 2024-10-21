import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, IconButton, InputBase, List, ListItem, ListItemAvatar, ListItemText, Avatar, Modal } from '@mui/material';
import { VideoCall, AttachFile, Mic, Send } from '@mui/icons-material';
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
import Button from "@mui/material/Button";
import moment from 'moment';
// import axios from 'axios';
// video call 
import { useWebRTC } from "../../../context/ProviderWebRTC";

const Chat = () => {
    const [message, setMessage] = useState('');
    const [openSearchUser, setOpenSearchUser] = useState(false);
    const [typing, setTyping] = useState(false);
    const [isOtherUserOnline, setIsOtherUserOnline] = useState(false);

    // Define the necessary states
    const [selectedFile, setSelectedFile] = React.useState<File | null>(null); // URL of the selected fill
    const [selectedFileType, setSelectedFileType] = React.useState<string>(''); // MIME type of the selected file
    const [isPreviewModalOpen, setIsPreviewModalOpen] = React.useState<boolean>(false); // Modal open/close state


    const location = useLocation();
    const endOfMessagesRef = useRef<HTMLDivElement | null>(null);

    const navigate = useNavigate()

    // calling functionla

    const { startCall } = useWebRTC();

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
                const sortedChats = response.data.data.
                    sort(
                        (a: ChatData, b: ChatData) =>
                            new Date(b.lastMessage?.createdAt || 0).getTime() -
                            new Date(a.lastMessage?.createdAt || 0).getTime()
                    );
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
            console.log('---------------------------------', data, '------------------data online users')
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
            console.log('user status changed')
            if (data.userId === otherUser?.id) {
                setIsOtherUserOnline(data.isOnline);
            }
        });

        return () => {
            socketService.disconnect();
        };
    }, [location.state]);

    useEffect(() => {
        socketService.onTyping(location.state?.userId);
    }, [message]);

    useEffect(() => {
        socketService.onUserTyping(() => {
            setTyping(true)
        });
        return () => {
            setTimeout(() => {
                setTyping(false)
            }, 1000)

        }
    })


    useEffect(() => {
        if (chat?._id) {
            socketService.connect();
            socketService.joinConversation(chat._id);

            socketService.onNewMessage((message) => {

                console.log(message, '-new message live')
                setData(prevData => {
                    const newMessage: Message = {
                        _id: message._id || Date.now().toString(),
                        senderId: message.senderId,
                        receiverId: message.receiverId,
                        content: message.content || null,
                        imagesUrl: message?.image,
                        videoUrl: message?.video,
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

    const formatMessageDate = (dateString: string) => {
        const date = moment(dateString);
        if (moment().isSame(date, 'day')) {
            return 'Today';
        } else if (moment().subtract(1, 'days').isSame(date, 'day')) {
            return 'Yesterday';
        } else if (moment().subtract(7, 'days').isBefore(date)) {
            return date.format('dddd'); // Display the day of the week (e.g., Monday, Tuesday)
        } else {
            return date.format('MMM D, YYYY'); // Display the full date (e.g., Oct 12, 2023)
        }
    };


    const uploadMedia = async () => {
        const receiverId = location.state?.userId;
        if (!selectedFile) {
            return;
        }
        let response;
        let image = []
        if (selectedFileType?.includes('image')) {
            const formData = new FormData();
            formData.append('images', selectedFile);
            console.log(selectedFile, '--------------', formData)
            response = await axiosInstance.post(`${messageEndpoints.sendImages}?chatId=${chat._id}&senderId=${userId}&receiverId=${receiverId}`, formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                }
            );
            image = response.data.data
        }
        let video = []
        if (selectedFileType?.includes('video')) {
            const formData = new FormData();
            formData.append('images', selectedFile);
            response = await axiosInstance.post(`${messageEndpoints.sendVideo}?chatId=${chat._id}&senderId=${userId}&receiverId=${receiverId}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                }
            );
            video = response.data.data
        }

        console.log(response, '------------response after ')
        if (response?.data.success && userId) {
            socketService.sendMedia({
                chatId: location.state.chat._id,
                senderId: userId,
                receiverId: receiverId,
                image,
                video,
            });
        }
        return [];
    };

    const handleSendMessage = async () => {
        try {

            const receiverId = location.state.userId
            if ((message.trim()) && chat._id && userId && receiverId) {


                socketService.sendMessage({
                    chatId: location.state.chat._id,
                    senderId: userId,
                    receiverId: receiverId,
                    content: message,
                });
                setMessage('');

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
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];

            setSelectedFile(file);  // Store the file URL for preview
            setSelectedFileType(file.type);  // Store the file MIME type
            setIsPreviewModalOpen(true);  // Open the preview modal
        }
    };



    const closePreviewModal = () => {
        setSelectedFile(null);  // Clear the file URL
        setSelectedFileType('');  // Clear the file type
        setIsPreviewModalOpen(false);  // Close the modal
    };


    // Scroll to the bottom when messages change
    useEffect(() => {
        if (endOfMessagesRef.current) {
            endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [data?.messages]);


    const handelSelectuser = async (id: string, avatar: string, name: string) => {
        try {
            const response = await axiosInstance.post(`${messageEndpoints.createChatId}?userId=${userId}&recieverId=${id}`);
            console.log(response.data.data, 'selet user for chat');
            navigate('/chats', { state: { userId: id, avatar, name, chat: response.data.data } })
        } catch (error) {

        }
    }

    let basepath = true
    if (location.state?.userId) {
        basepath = false;
    }

    const formatMessageTime = (dateString: string) => {
        return moment(dateString).format('hh:mm A'); // Format time as hh:mm AM/PM
    };

    return (
        <div style={{ height: '100vh', backgroundColor: '#2d3748' }}>
            <Navbar />
            <Box sx={{ display: 'flex', height: '90%', width: '100%', marginTop: '70px', position: 'fixed', flexDirection: { xs: 'column', sm: 'row' } }}>
                {/* Sidebar */}
                <div style={{ width: '70px', backgroundColor: '#4a5568', display: 'flex', flexDirection: 'column' }}>
                    <div title='Chat' style={sidebarIconStyle}>
                        <BsChatDots size={20} />
                    </div>
                    <hr />
                    <div onClick={() => setOpenSearchUser(true)} title='Add Chat' style={sidebarIconStyle}>
                        <HiUserAdd size={20} />
                    </div>
                </div>

                {/* User List */}
                <Box sx={{ width: { xs: '100%', sm: 240 }, bgcolor: '#2d3748', borderRight: { sm: '1px solid #4a5568' }, overflowY: 'auto', color: 'white' }}>
                    <Typography variant="h6" sx={{ p: 2, marginLeft: '20%' }}>Users</Typography>
                    <hr />
                    <List>
                        {chats.length === 0 ? (
                            <div style={{ padding: '60px' }}>No chats</div>
                        ) : (
                            chats.map((chat, chatIndex) => (
                                <div key={chatIndex}>
                                    {chat.users.map((user, userIndex) => (
                                        <ListItem key={userIndex} onClick={() => handelSelectuser(user.id, user.avatar, user.name)} sx={{ cursor: 'pointer' }}>
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
                            ))
                        )}
                    </List>
                </Box>

                {/* Main Chat Area */}
                {basepath ? (
                    <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', backgroundColor: '#2d3748' }}>
                        <Typography variant="h6">Select a chat to start</Typography>
                    </Box>
                ) : (
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', bgcolor: '#2d3748' }}>
                        {/* Header */}
                        <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderBottom: '1px solid #4a5568', bgcolor: '#2d3748', color: 'white' }}>
                            <Avatar src={location.state.avatar} sx={{ mr: 2, width: 50, height: 50, bgcolor: '#4a5568' }} />
                            <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                {location.state?.name}
                                <br />
                                <span style={{ fontSize: '0.8em', color: '#a0aec0' }}>
                                    {typing ? 'typing....' : ''}
                                </span>
                            </Typography>
                            <IconButton sx={{ color: 'white' }} onClick={() => location.state.userId && startCall(location.state.userId)}>
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
                                maxHeight: '600px',
                                minHeight: '400px',
                                '&::-webkit-scrollbar': {
                                    display: 'none',
                                },
                                scrollbarWidth: 'none',
                            }}
                        >
                            {!data || !data?.messages ? (
                                'No chats'
                            ) : (
                                data?.messages.map((message, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            mb: 2,
                                            textAlign: message.senderId === userId ? 'right' : 'left',
                                            maxWidth: '100%',
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                display: 'inline-block',
                                                backgroundColor: message.senderId === userId ? '#4a5568' : '#2d3748',
                                                color: 'white',
                                                borderRadius: '12px',
                                                padding: '10px',
                                            }}
                                        >


                                            {/* Display text content if available */}
                                            {message.content && <div style={{ marginBottom: '10px' }}>
                                                {message.content}
                                                <span style={{ fontSize: '12px', color: '#a0aec0', marginLeft: '10px' }}>
                                                    {formatMessageTime(message.createdAt)}
                                                </span>
                                            </div>}

                                            {/* Display images if available */}
                                            {message.imagesUrl && message.imagesUrl.length === 1 && (
                                                <>
                                                    <img
                                                        src={message.imagesUrl[0]}
                                                        alt="media"
                                                        style={{
                                                            maxWidth: '100%',
                                                            maxHeight: '200px',
                                                            borderRadius: '12px',
                                                            marginBottom: '10px',
                                                        }}
                                                    />
                                                    <span style={{ fontSize: '12px', color: '#a0aec0', marginLeft: '10px' }}>
                                                        {formatMessageTime(message.createdAt)}
                                                    </span>
                                                </>


                                            )}

                                            {/* Display video if available */}
                                            {message.videoUrl && message.videoUrl.length === 1 && (
                                                <>
                                                    <video
                                                        controls
                                                        style={{
                                                            maxWidth: '100%',
                                                            maxHeight: '200px',
                                                            borderRadius: '12px',
                                                        }}
                                                    >
                                                        <source src={message.videoUrl[0]} type="video/mp4" />
                                                        Your browser does not support the video tag.
                                                    </video>
                                                    <span style={{ fontSize: '12px', color: '#a0aec0', marginLeft: '10px' }}>
                                                        {formatMessageTime(message.createdAt)}
                                                    </span>
                                                </>

                                            )}
                                        </Typography>
                                    </Box>
                                ))
                            )}
                            <div ref={endOfMessagesRef} />
                        </Box>

                        {/* Input Area */}
                        <Box sx={{ p: 2, borderTop: '1px solid #4a5568', bgcolor: '#2d3748', display: 'flex', alignItems: 'center' }}>
                            <IconButton color="inherit" component="label">
                                <input type="file" hidden onChange={handleFileUpload} accept="image/*,video/*" />
                                <AttachFile />
                            </IconButton>
                            <InputBase
                                sx={{ flex: 1, ml: 1, bgcolor: '#4a5568', borderRadius: '4px', color: 'white', p: '4px 8px' }}
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
                )}
            </Box>

            {/* Modal for Previewing the Selected File */}
            <Modal
                open={isPreviewModalOpen}
                onClose={closePreviewModal}
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
                <Box
                    sx={{
                        width: { xs: '80%', sm: '40%' }, // Responsive width
                        bgcolor: '#1a202c', // Dark background
                        borderRadius: '8px', // Rounded corners
                        p: 2,
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)', // Subtle shadow for depth
                        position: 'relative', // For close button placement
                    }}
                >
                    {/* Modal Title */}
                    <Typography
                        variant="h6"
                        sx={{ color: 'white', textAlign: 'center', mb: 2, fontWeight: 'bold' }}
                    >
                        File Preview
                    </Typography>

                    {/* Close Button */}
                    <IconButton
                        sx={{
                            color: 'white',
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            bgcolor: '#ff4757', // Red close button
                            '&:hover': { bgcolor: '#e84118' }, // Hover effect
                            borderRadius: '50%', // Circular button
                            width: 30,
                            height: 30,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontSize: 16, // Adjust font size for 'X'
                        }}
                        onClick={closePreviewModal}
                    >
                        X
                    </IconButton>

                    {/* File Preview (Image or Video) */}
                    {selectedFile && (
                        <Box
                            sx={{
                                mt: 2,
                                display: 'flex',
                                justifyContent: 'center',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            {/* Conditionally render an image or video based on file type */}
                            {selectedFileType?.includes('image') ? (
                                <img
                                    src={URL.createObjectURL(selectedFile)}
                                    alt="Preview"
                                    style={{
                                        width: '100%',
                                        maxHeight: '300px',
                                        borderRadius: '8px',
                                        objectFit: 'contain',
                                    }}
                                />
                            ) : selectedFileType?.includes('video') ? (
                                <video
                                    controls
                                    src={URL.createObjectURL(selectedFile)}
                                    style={{
                                        width: '100%',
                                        maxHeight: '300px',
                                        borderRadius: '8px',
                                        objectFit: 'contain',
                                    }}
                                />
                            ) : (
                                <Typography sx={{ color: 'white' }}>
                                    Unsupported file type
                                </Typography>
                            )}

                            {/* Send Button */}
                            <Button
                                variant="contained"
                                sx={{
                                    mt: 2,
                                    bgcolor: '#38a169', // Green button
                                    '&:hover': { bgcolor: '#2f855a' }, // Hover effect
                                    color: 'white',
                                    fontWeight: 'bold',
                                    borderRadius: '8px',
                                    width: '100%',
                                    maxWidth: 200,
                                    py: 1,
                                }}
                                onClick={uploadMedia}
                            >
                                Send
                            </Button>
                        </Box>
                    )}
                </Box>
            </Modal>

            {/* Search User Modal */}
            {
                openSearchUser && (
                    <SearchUser onClose={() => setOpenSearchUser(false)} />
                )
            }
        </div >

    );
};

export default Chat;

const sidebarIconStyle = {
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: 'white'
};
