import { useEffect, useState } from 'react';
import { Box, Typography, IconButton, InputBase, List, ListItem, ListItemAvatar, ListItemText, Avatar, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CircularProgress from '@mui/material/CircularProgress';
import { toast } from 'sonner';
import axiosInstance from '../../../constraints/axios/userAxios';
import { userEndpoints } from '../../../constraints/endpoints/userEndpoints';
import { useNavigate } from 'react-router-dom';
import { messageEndpoints } from '../../../constraints/endpoints/messageEndpoints';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/sotre';

interface UserData {
    _id: string,
    profilePicture?: string,
    name: string
}

interface fn {
    onClose(): void
}

const SearchUser = ({ onClose }: fn) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

    const navigate = useNavigate();

    const userId = useSelector((state: RootState) => state.userAuth.userData?._id)

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);
        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]);


    useEffect(() => {
        if (debouncedSearchTerm) {
            handleSearch();
        }
    }, [debouncedSearchTerm]);

    const handleSearch = async () => {
        setLoading(true);
        try {
            const result = await axiosInstance.post(userEndpoints.searchUser, {
                search: debouncedSearchTerm
            });
            if (result.data.success) {
                if (result.data.data.length === 0) {
                    toast.info("No user found");
                }
                setFilteredUsers(result.data.data);
            } else {
                toast.info(result.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error('Error while fetching user data');
        }
        setLoading(false);
    };

    const handleKeyDown = (event: any) => {
        if (event.key === 'Enter') {
            setDebouncedSearchTerm(searchTerm);
        }
    };

    const handelClick = async (id: string, avatar: string | undefined, name: string) => {


        try {
            const response = await axiosInstance.post(`${messageEndpoints.createChatId}?userId=${userId}&recieverId=${id}`);
            if (response.data.success) {
                const chatId = response.data.data._id;
                console.log("Chat ID from server:", chatId);
                navigate('/chats', { state: { userId: id, avatar, name, chat: response.data.data } })
                onClose()
            }
        } catch (error) {
            console.log("Error occurred while navigating message area", error);
        }
    }

    return (
        <Box
            sx={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                bgcolor: '#1a202c',
                borderRadius: '8px',
                p: { xs: 2, sm: 3 }, // Padding adjusts for smaller screens
                width: { xs: '90%', sm: '70%', md: '50%' }, // Width adjusts for different screen sizes
                height: { xs: '70%', sm: '80%' }, // Height adjusts for smaller screens
                zIndex: 1300,
                boxShadow: 34,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                overflow: 'hidden', // Prevents overflow issues
            }}
        >
            <IconButton
                sx={{ alignSelf: 'flex-end', mb: 1 }}
                onClick={onClose}
            >
                <CloseIcon sx={{ color: 'white' }} />
            </IconButton>

            <Typography
                variant="h6"
                color="white"
                sx={{
                    mb: { xs: 1, sm: 2 }, // Adjusts margin for smaller screens
                    fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' }, // Font size adjusts based on screen size
                }}
            >
                Search User
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 2 }}>
                <InputBase
                    sx={{
                        bgcolor: '#2d3748',
                        borderRadius: '4px',
                        color: 'white',
                        p: '4px 8px',
                        flex: 1,
                        mr: 1,
                        fontSize: { xs: '0.9rem', sm: '1rem' }, // Font size adjusts for responsiveness
                    }}
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <Button
                    variant="contained"
                    onClick={() => setDebouncedSearchTerm(searchTerm)}
                    sx={{
                        bgcolor: '#4a5568',
                        color: 'white',
                        fontSize: { xs: '0.8rem', sm: '1rem' }, // Button font size adjusts
                        '&:hover': { bgcolor: '#2d3748' },
                    }}
                >
                    Search
                </Button>
            </Box>

            {loading ? (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                    }}
                >
                    <CircularProgress />
                </Box>
            ) : (
                <List
                    sx={{
                        width: '100%',
                        maxHeight: { xs: 'calc(100% - 160px)', sm: 'calc(100% - 180px)' },
                        overflowY: 'auto',
                        px: { xs: 1, sm: 2 }, // Padding adjusts for responsiveness
                    }}
                >
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                            <ListItem key={user._id} sx={{ px: 0 }}>
                                <ListItemAvatar>
                                    <Avatar
                                        src={user.profilePicture}
                                        sx={{
                                            bgcolor: '#4a5568',
                                            width: { xs: 40, sm: 50 }, // Avatar size adjusts for screen size
                                            height: { xs: 40, sm: 50 },
                                        }}
                                    />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={user.name}
                                    sx={{
                                        color: 'white',
                                        cursor: 'pointer',
                                        fontSize: { xs: '0.9rem', sm: '1rem' },
                                    }}
                                    onClick={() =>
                                        handelClick(user._id, user?.profilePicture, user.name)
                                    }
                                />
                            </ListItem>
                        ))
                    ) : (
                        <Typography color="white" sx={{ textAlign: 'center' }}>
                            No users found
                        </Typography>
                    )}
                </List>
            )}
        </Box>

    );
};

export default SearchUser;
