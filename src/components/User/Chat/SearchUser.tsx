import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton, InputBase, List, ListItem, ListItemAvatar, ListItemText, Avatar, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CircularProgress from '@mui/material/CircularProgress';
import { toast } from 'sonner';
import axiosInstance from '../../../constraints/axios/userAxios';
import { userEndpoints } from '../../../constraints/endpoints/userEndpoints';


interface UserData {
    _id: string,
    profilePicture?: string,
    name: string
}

const SearchUser = ({ onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true)


    const handleSearch = async () => {
        try {
            console.log(searchTerm, '---------')
            const result = await axiosInstance.post(userEndpoints.searchUser, {
                search: searchTerm
            })
            if (result.data.success) {
                if(result.data.data.length === 0){
                    toast.info("No user found")
                }
                console.log(result.data.data, 'data from searched');
                setFilteredUsers(result.data.data);
                setLoading(false)
            } else {
                console.log('else')
                toast.info(result.data.message);
            }

        } catch (error) {
            console.log(error)
            toast.error('Error while fetching user data')
        }
    };

    console.log(filteredUsers, 'filteredUsers')

    const handleKeyDown = (event: any) => {
        if (event.key === 'Enter') {
            handleSearch();  // Trigger search when "Enter" is pressed
        }
    };


    return (
        <Box
            sx={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                bgcolor: '#1a202c',
                borderRadius: '8px',
                // opacity:'0.5',
                p: 2,
                width: '50%',
                height: '80%',
                zIndex: 1300, // Ensure it appears above other elements
                boxShadow: 34,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <IconButton
                sx={{ alignSelf: 'flex-end' }}
                onClick={onClose}
            >
                <CloseIcon sx={{ color: 'white' }} />
            </IconButton>
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
                        flex: 1, // Take full available width
                        mr: 1,  // Add margin between input and button
                    }}
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}  // Listen for "Enter" key
                />
                <Button
                    variant="contained"
                    onClick={handleSearch}
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
                loading
                    ?

                    <Typography color='white' style={{ marginTop: '20%' }}><CircularProgress /></Typography>



                    :
                    <List sx={{ width: '100%', maxHeight: 'calc(100% - 100px)', overflowY: 'auto' }}>
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <ListItem key={user._id} button>
                                    <ListItemAvatar>
                                        <Avatar
                                            src={user.profilePicture}
                                            sx={{ bgcolor: '#4a5568', width: 50, height: 50 }}
                                        />
                                    </ListItemAvatar>
                                    <ListItemText primary={user.name} sx={{ color: 'white' }} />
                                </ListItem>
                            ))
                        ) : (
                            <Typography color="white">No users found</Typography>
                        )}
                    </List>
            }

        </Box>
    );
};

export default SearchUser;
