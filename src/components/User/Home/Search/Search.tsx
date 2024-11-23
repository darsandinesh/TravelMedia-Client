import { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    InputBase,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    Button,
    Select,
    MenuItem,
    CircularProgress,
    Tabs,
    Tab,
} from '@mui/material';
import { toast } from 'sonner';
import axiosInstance from '../../../../constraints/axios/userAxios';
import { userEndpoints } from '../../../../constraints/endpoints/userEndpoints';
import { postEndpoints } from '../../../../constraints/endpoints/postEndpoints';
import { useNavigate } from 'react-router-dom';

interface UserData {
    _id: string;
    profilePicture?: string;
    name: string;
}

interface PostData {
    _id: string;
    userId: string;
    imageUrl?: string[];
    description: string;
    location?: string;
    likes?: { UserId: string; createdAt: Date }[];
    created_at: string;
}

const CombinedSearch = () => {
    const [searchType, setSearchType] = useState<'users' | 'posts'>('users');
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
    const [filteredPosts, setFilteredPosts] = useState<PostData[]>([]);
    const [filter, setFilter] = useState('description');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Debounce input for better performance
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    // Trigger search when debounced search term changes
    useEffect(() => {
        if (debouncedSearchTerm) {
            if (searchType === 'users') {
                handleSearchUsers();
            } else if (searchType === 'posts') {
                handleSearchPosts();
            }
        }
    }, [debouncedSearchTerm]);

    const handleSearchUsers = async () => {
        setLoading(true);
        try {
            const result = await axiosInstance.post(userEndpoints.searchUser, {
                search: debouncedSearchTerm,
            });

            if (result.data.success) {
                if (result.data.data.length === 0) {
                    toast.info('No users found');
                }
                setFilteredUsers(result.data.data);
            } else {
                toast.info(result.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error('Error while fetching user data');
        } finally {
            setLoading(false);
        }
    };

    const handleSearchPosts = async () => {
        setLoading(true);
        try {
            const result = await axiosInstance.post(postEndpoints.searchPost, {
                searchTerm: debouncedSearchTerm,
                filter,
            });
            console.log(result.data, '---------------')
            if (result.data.success) {
                if (result.data.data.length === 0) {
                    toast.info('No posts found');
                }
                setFilteredPosts(result.data.data);
            } else {
                toast.info(result.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error('Error while fetching post data');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (event: any) => {
        setFilter(event.target.value);
    };

    const handleKeyDown = (event: any) => {
        if (event.key === 'Enter') {
            setDebouncedSearchTerm(searchTerm);
        }
    };

    const handelClickUser = (id: string) => {
        navigate(`/userProfile`, { state: { userId: id } });
    }

    const handelClickPost = (podtId: string, id: string) => {
        navigate('/viewPost', { state: { postId: podtId, userId: id } })
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
                width: { xs: '90%', sm: '70%', md: '50%' }, // Adjust width based on screen size
                height: { xs: '70%', md: '80%' }, // Adjust height for smaller screens
                zIndex: 1300,
                boxShadow: 34,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Typography variant="h6" color="white" sx={{ mb: 2, fontSize: { xs: '1rem', md: '1.25rem' } }}>
                Search
            </Typography>

            {/* Tabs for switching between user and post search */}
            <Tabs
                value={searchType}
                onChange={(e, value) => {
                    setSearchType(value);
                    console.log(e)
                }}
                textColor="secondary"
                indicatorColor="secondary"
                centered
                sx={{
                    mb: 2,
                    bgcolor: '#213547',
                    borderRadius: '8px',
                    width: '100%', // Full width for responsiveness
                }}
            >
                <Tab
                    label="Users"
                    value="users"
                    sx={{
                        color: 'white',
                        '&.Mui-selected': {
                            color: '#4caf50',
                            fontWeight: 'bold',
                        },
                        '&:hover': {
                            color: '#b2dfdb',
                        },
                    }}
                />
                <Tab
                    label="Posts"
                    value="posts"
                    sx={{
                        color: 'white',
                        '&.Mui-selected': {
                            color: '#4caf50',
                            fontWeight: 'bold',
                        },
                        '&:hover': {
                            color: '#b2dfdb',
                        },
                    }}
                />
            </Tabs>

            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    mb: 2,
                    flexDirection: { xs: 'column', sm: 'row' }, // Stack inputs on smaller screens
                }}
            >
                {/* Filter only for post search */}
                {searchType === 'posts' && (
                    <Select
                        value={filter}
                        onChange={handleFilterChange}
                        sx={{
                            color: 'white',
                            bgcolor: '#2d3748',
                            borderRadius: '4px',
                            p: '4px 8px',
                            mr: { xs: 0, sm: 1 },
                            mb: { xs: 1, sm: 0 },
                            width: { xs: '100%', sm: 'auto' },
                        }}
                    >
                        <MenuItem value="description">Description</MenuItem>
                        <MenuItem value="location">Location</MenuItem>
                    </Select>
                )}
                <InputBase
                    sx={{
                        bgcolor: '#2d3748',
                        borderRadius: '4px',
                        color: 'white',
                        p: '4px 8px',
                        flex: 1,
                        mr: { xs: 0, sm: 1 },
                        mb: { xs: 1, sm: 0 },
                        width: { xs: '100%', sm: 'auto' },
                    }}
                    placeholder={`Search ${searchType}...`}
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
                        '&:hover': { bgcolor: '#2d3748' },
                        width: { xs: '100%', sm: 'auto' },
                    }}
                >
                    Search
                </Button>
            </Box>

            {loading ? (
                <Typography color="white" style={{ marginTop: '20%' }}>
                    <CircularProgress />
                </Typography>
            ) : searchType === 'users' ? (
                <List
                    sx={{
                        width: '100%',
                        maxHeight: 'calc(100% - 160px)',
                        overflowY: 'auto',
                        px: { xs: 1, sm: 2 },
                    }}
                >
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                            <ListItem
                                key={user._id}
                                onClick={() => console.log(`User clicked: ${user._id}`)}
                                sx={{ cursor: 'pointer' }}
                            >
                                <ListItemAvatar>
                                    <Avatar
                                        src={user.profilePicture}
                                        sx={{ bgcolor: '#4a5568', width: 50, height: 50 }}
                                    />
                                </ListItemAvatar>
                                <ListItemText primary={user.name} sx={{ color: 'white' }} onClick={() => handelClickUser(user._id)} />
                            </ListItem>
                        ))
                    ) : (
                        <Typography color="white">No users found</Typography>
                    )}
                </List>
            ) : (
                <List
                    sx={{
                        width: '100%',
                        maxHeight: 'calc(100% - 160px)',
                        overflowY: 'auto',
                        px: { xs: 1, sm: 2 },
                    }}
                >
                    {filteredPosts.length > 0 ? (
                        filteredPosts.map((post) => (
                            <ListItem
                                key={post._id}
                                // onClick={() => console.log(`Post clicked: ${post._id}`)}
                                onClick={() => handelClickPost(post._id, post.userId)}
                                sx={{ cursor: 'pointer' }}
                            >
                                <ListItemAvatar>
                                    <Avatar
                                        src={post.imageUrl ? post.imageUrl[0] : undefined}
                                        sx={{ bgcolor: '#4a5568', width: 50, height: 50 }}
                                    />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        filter === 'likes'
                                            ? `${post.likes?.length || 0} likes`
                                            : post.description
                                    }
                                    secondary={post.location || 'Unknown Location'}
                                    sx={{
                                        color: 'white',
                                        '& .MuiListItemText-secondary': {
                                            color: 'white',
                                        },
                                    }}
                                />

                            </ListItem>
                        ))
                    ) : (
                        <Typography color="white">No posts found</Typography>
                    )}
                </List>
            )}
        </Box>
    );
};

export default CombinedSearch;
