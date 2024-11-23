import { useState } from 'react';
import {
    Button,
    Switch,
    TextField,
    Typography,
    Avatar,
    Box,
    List,
    ListItem,
    Divider,
    ListItemAvatar,
    ListItemText,
} from '@mui/material';
import { RiGitRepositoryPrivateFill } from "react-icons/ri";
import { MdOutlineDarkMode, MdOutlineNotificationsActive } from "react-icons/md";
import Navbar from '../Home/NavBar/NavBar';
import BottomNav from '../Home/footer/BottomNav';

const users = {
    name: 'Hello',
    avatarUrl: '',
    bio: '14/12/1212',
    isPrivate: false,
    darkMode: false,
    notificationsEnabled: true,
}

const SettingsPage = () => {
    const user = users
    const [formData, setFormData] = useState({
        name: user?.name || '',
        bio: user?.bio || '',
        isPrivate: user?.isPrivate || false,
        darkMode: user?.darkMode || false,
        notificationsEnabled: user?.notificationsEnabled || true,
    });

    // Handlers for toggles
    const handleToggle = (field: any) => {
        setFormData((prev: any) => ({ ...prev, [field]: !prev[field] }));
    };

    // Handle input changes
    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Save changes
    const handleSave = () => {
    };

    return (
        <>
            <Navbar />
            <BottomNav />
            <Box sx={{ maxWidth:500, p: 3, borderRadius: '10px', boxShadow: 5, bgcolor: 'background.paper',marginLeft:'30%'}}>
                <Typography variant="h5" id="modal-title" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Account Settings
                </Typography>

                {/* User Info */}
                <List>
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar sx={{ width: 60, height: 60 }} src={user?.avatarUrl} />
                        </ListItemAvatar>
                        <ListItemText
                            primary={
                                <TextField
                                    name="name"
                                    label="Name"
                                    variant="outlined"
                                    fullWidth
                                    value={formData.name}
                                    onChange={handleInputChange}
                                />
                            }
                        />
                    </ListItem>
                    <Divider />
                </List>

                {/* Bio */}
                <List>
                    <ListItem>
                        <TextField
                            name="bio"
                            label="Bio"
                            variant="outlined"
                            multiline
                            rows={3}
                            fullWidth
                            value={formData.bio}
                            onChange={handleInputChange}
                        />
                    </ListItem>
                    <Divider />
                </List>

                {/* Privacy Settings */}
                <List>
                    <ListItem>
                        <ListItemAvatar>
                            <Box sx={{ bgcolor: 'warning.main', p: 1, borderRadius: '50%' }}>
                                <RiGitRepositoryPrivateFill size={25} color="white" />
                            </Box>
                        </ListItemAvatar>
                        <ListItemText primary="Privacy" secondary={formData.isPrivate ? 'Private Account' : 'Public Account'} />
                        <Switch
                            color="success"
                            checked={formData.isPrivate}
                            onChange={() => handleToggle('isPrivate')}
                        />
                    </ListItem>
                    <Divider />
                </List>

                {/* Dark Mode */}
                <List>
                    <ListItem>
                        <ListItemAvatar>
                            <Box sx={{ bgcolor: 'primary.main', p: 1, borderRadius: '50%' }}>
                                <MdOutlineDarkMode size={25} color="white" />
                            </Box>
                        </ListItemAvatar>
                        <ListItemText primary="Dark Mode" />
                        <Switch
                            color="primary"
                            checked={formData.darkMode}
                            onChange={() => handleToggle('darkMode')}
                        />
                    </ListItem>
                    <Divider />
                </List>

                {/* Notifications */}
                <List>
                    <ListItem>
                        <ListItemAvatar>
                            <Box sx={{ bgcolor: 'success.main', p: 1, borderRadius: '50%' }}>
                                <MdOutlineNotificationsActive size={25} color="white" />
                            </Box>
                        </ListItemAvatar>
                        <ListItemText primary="Enable Notifications" />
                        <Switch
                            color="warning"
                            checked={formData.notificationsEnabled}
                            onChange={() => handleToggle('notificationsEnabled')}
                        />
                    </ListItem>
                    <Divider />
                </List>

                {/* Save Button */}
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                    fullWidth
                    sx={{ mt: 2 }}
                >
                    Save Changes
                </Button>
            </Box>
        </>
    );
};

export default SettingsPage;
