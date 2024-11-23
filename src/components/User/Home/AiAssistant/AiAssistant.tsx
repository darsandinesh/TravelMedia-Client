import { useState } from 'react';
import { Box, Dialog, DialogContent, Fab, Typography, IconButton, Avatar, TextField, CircularProgress, Paper, Switch } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AssistantIcon from '@mui/icons-material/Assistant';
import SendIcon from '@mui/icons-material/Send';
import travel from '../../../../assets/ss-login.png';
import axios from 'axios';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

interface ChatMessage {
    sender: 'user' | 'ai';
    message: string;
}

const AIAssistant = () => {
    const [open, setOpen] = useState(false);
    const [userQuestion, setUserQuestion] = useState('');
    const [loading, setLoading] = useState(false);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [darkMode, setDarkMode] = useState(true);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setChatMessages([]);
    };

    const handleThemeToggle = () => setDarkMode((prev) => !prev);

    const getAIResponse = (question: string) => {
        setLoading(true);
        async function fetchData() {
            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${import.meta.env.VITE_AI_KEY}`,
                {
                    contents: [
                        {
                            parts: [
                                {
                                    text: `You are a TravelBuddy assistant. Please greet the user, introduce yourself as the TravelBuddy assistant, and answer only questions related to TravelBuddy, such as adding posts, reporting posts, finding buddies, or accessing premium features. If a user asks something unrelated to TravelBuddy, respond with: 'Sorry, I can only answer questions related to TravelBuddy.' Here is the user's question: ${question}`
                                }
                            ]
                        },
                    ],
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    params: {
                        key: `${import.meta.env.VITE_AI_KEY}`,
                    },
                }

            );
            console.log(response.data.candidates[0].content.parts[0].text)
            const botReply = response.data.candidates[0].content.parts[0].text || "Sorry, I couldn't generate a response.";
            setLoading(false);
            setChatMessages(prevMessages => [
                ...prevMessages,
                { sender: 'ai', message: botReply }
            ]);
        }
        fetchData();

    };

    const handleUserQuestionSubmit = () => {
        if (userQuestion.trim()) {
            setChatMessages(prevMessages => [
                ...prevMessages,
                { sender: 'user', message: userQuestion }
            ]);
            getAIResponse(userQuestion);
            setUserQuestion('');
        }
    };

    return (
        <Box>
            <Fab
                color="primary"
                aria-label="ai-assistant"
                onClick={handleOpen}
                sx={{
                    position: 'fixed',
                    bottom: 24,
                    right: 24,
                    backgroundColor: darkMode ? '#213547' : '#f0e62d',
                    color: darkMode ? 'white' : '#213547',
                    '&:hover': { backgroundColor: darkMode ? '#1b2a38' : '#ffeb3b' },
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
                    transition: 'background-color 0.3s, box-shadow 0.3s',
                }}
            >
                <AssistantIcon />
            </Fab>

            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth
                maxWidth="sm"
                PaperProps={{
                    style: {
                        borderRadius: '12px',
                        overflow: 'hidden',
                        backgroundSize: 'cover',
                        backgroundColor: darkMode ? '#213547' : '#ffffff',
                        color: darkMode ? '#fff' : '#000',
                    },
                }}
            >
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    p={2}
                    bgcolor={darkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(240, 240, 240, 0.7)'}
                >
                    <Typography variant="h6" sx={{ color: darkMode ? '#fdfe6e' : '#213547' }}>
                        TravelMedia Assistance
                    </Typography>

                    {/* Theme toggle with icons */}
                    <Box display="flex" alignItems="center">
                        <DarkModeIcon sx={{ color: darkMode ? '#fdfe6e' : '#999', mr: 1 }} />
                        <Switch
                            checked={darkMode}
                            onChange={handleThemeToggle}
                            color="default"
                        />
                        <LightModeIcon sx={{ color: !darkMode ? '#213547' : '#999', ml: 1 }} />
                    </Box>

                    <IconButton onClick={handleClose} sx={{ color: darkMode ? '#fff' : '#000' }}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                <DialogContent
                    sx={{
                        backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.5)' : 'rgba(240, 240, 240, 0.5)',
                        borderRadius: '12px',
                    }}
                >
                    <Box textAlign="center">
                        <Avatar
                            sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }}
                            src={travel}
                        />
                        <Typography variant="body1" sx={{ color: darkMode ? '#fdfe6e' : '#213547', mb: 2 }}>
                            Ask questions to interact with AI-generated data!
                        </Typography>

                        <Typography
                            sx={{
                                color: darkMode ? '#fdfe6e' : '#213547',
                                mb: 3,
                                fontSize: '14px',
                                fontStyle: 'italic',
                            }}
                        >
                            Welcome to TravelMedia! Discover the latest travel posts, share your experiences,
                            and interact with fellow travelers. Ask questions and get instant AI assistance on your travel queries!
                        </Typography>

                        {/* Chat Box */}
                        <Box sx={{ maxHeight: '250px', overflowY: 'auto', mb: 3 }}>
                            {chatMessages.map((msg, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        display: 'flex',
                                        flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
                                        alignItems: 'center',
                                        mb: 2,
                                    }}
                                >
                                    <Paper
                                        sx={{
                                            maxWidth: '70%',
                                            p: 2,
                                            borderRadius: '10px',
                                            backgroundColor: msg.sender === 'user' ? (darkMode ? '#fdfe6e' : '#f0e62d') : (darkMode ? '#1b2a38' : '#f0f0f0'),
                                            color: msg.sender === 'user' ? (darkMode ? '#213547' : '#000') : (darkMode ? '#fdfe6e' : '#000'),
                                        }}
                                    >
                                        {msg.message}
                                    </Paper>
                                </Box>
                            ))}
                        </Box>

                        {loading && (
                            <Box sx={{ mb: 2, color: darkMode ? '#fdfe6e' : '#213547', fontSize: '14px', fontStyle: 'italic' }}>
                                <Typography>Processing your question...</Typography>
                            </Box>
                        )}

                        <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
                            <TextField
                                variant="outlined"
                                fullWidth
                                label="Ask your question"
                                value={userQuestion}
                                onChange={(e) => setUserQuestion(e.target.value)}
                                sx={{
                                    backgroundColor: darkMode ? '#fff' : '#f0f0f0',
                                    borderRadius: 1,
                                    input: { color: darkMode ? '#213547' : '#000' },
                                    mr: 2,
                                }}
                                disabled={loading}
                            />
                            <IconButton
                                color="primary"
                                onClick={handleUserQuestionSubmit}
                                disabled={loading}
                                sx={{
                                    backgroundColor: darkMode ? '#fdfe6e' : '#f0e62d',
                                    color: darkMode ? '#213547' : '#000',
                                    '&:hover': { backgroundColor: darkMode ? '#f0e62d' : '#ffeb3b' },
                                }}
                            >
                                {loading ? <CircularProgress size={24} sx={{ color: darkMode ? '#213547' : '#000' }} /> : <SendIcon />}
                            </IconButton>
                        </Box>
                    </Box>
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default AIAssistant;


