import { useEffect, useState } from 'react';
import { Box, Typography, InputBase, List, ListItem, ListItemAvatar, ListItemText, Avatar, Button } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { toast } from 'sonner';
import axiosInstance from '../../../../constraints/axios/userAxios';
import { userEndpoints } from '../../../../constraints/endpoints/userEndpoints';
import { useNavigate } from 'react-router-dom';

interface UserData {
    _id: string,
    profilePicture?: string,
    name: string
}

const Search = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

    const navigate = useNavigate();

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
            console.log(debouncedSearchTerm, '---------');
            const result = await axiosInstance.post(userEndpoints.searchUser, {
                search: debouncedSearchTerm
            });
            if (result.data.success) {
                if (result.data.data.length === 0) {
                    toast.info("No user found");
                }
                console.log(result.data.data, 'data from searched');
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

    const handelClick = (userId: string) => {

        navigate(`/userProfile`, { state: { userId: userId } });
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
                p: 2,
                width: '50%',
                height: '80%',
                zIndex: 1300,
                boxShadow: 34,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Typography variant="h6" color="white" sx={{ mb: 2 }}>
                Search User
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <InputBase
                    sx={{
                        bgcolor: '#2d3748',
                        borderRadius: '4px',
                        color: 'white',
                        p: '4px 8px',
                        flex: 1,
                        mr: 1,
                    }}
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <Button
                    variant="contained"
                    onClick={() => setDebouncedSearchTerm(searchTerm)} // Trigger search on button click
                    sx={{
                        bgcolor: '#4a5568',
                        color: 'white',
                        '&:hover': { bgcolor: '#2d3748' }
                    }}
                >
                    Search
                </Button>
            </Box>
            {
                loading ? (
                    <Typography color='white' style={{ marginTop: '20%' }}><CircularProgress /></Typography>
                ) : (
                    <List sx={{ width: '100%', maxHeight: 'calc(100% - 100px)', overflowY: 'auto' }}>
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <ListItem key={user._id} >
                                    <ListItemAvatar>
                                        <Avatar
                                            src={user.profilePicture}
                                            sx={{ bgcolor: '#4a5568', width: 50, height: 50 }}
                                        />
                                    </ListItemAvatar>
                                    <ListItemText primary={user.name} sx={{ color: 'white',cursor:'pointer' }} onClick={() => handelClick(user._id)} />
                                </ListItem>
                            ))
                        ) : (
                            <Typography color="white">No users found</Typography>
                        )}
                    </List>
                )
            }
        </Box>
    );
};

export default Search;


