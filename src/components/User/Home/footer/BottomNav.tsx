import { useEffect, useState } from 'react';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import ChatIcon from '@mui/icons-material/Chat';
import AddBoxIcon from '@mui/icons-material/AddBox';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate, useLocation } from 'react-router-dom';
import { RootState } from '../../../../redux/store/sotre';
import { useSelector } from 'react-redux';

const BottomNav = () => {
    const [value, setValue] = useState(0);
    const navigate = useNavigate();
    const location = useLocation();
    const userId = useSelector((state: RootState) => state.userAuth.userData?._id);

    const pages = [
        { label: 'Home', icon: <HomeIcon />, path: '/' },
        { label: 'Search', icon: <SearchIcon />, path: '/search' },
        { label: 'Chats', icon: <ChatIcon />, path: '/chats' },
        { label: 'Add Post', icon: <AddBoxIcon />, path: '/add-post' },
        { label: 'Buddy', icon: <PeopleIcon />, path: '/find-buddy' },
    ];

    // Include the profile as a special case and its path
    const profilePath = '/userProfile';

    useEffect(() => {
        // Check if current path is in pages or the profile path
        const currentIndex = pages.findIndex(page => page.path === location.pathname);
        if (location.pathname === profilePath) {
            setValue(pages.length); // Set value for profile page
        } else if (currentIndex !== -1) {
            setValue(currentIndex);
        }
    }, [location.pathname]);

    const handleNavigation = (event: React.ChangeEvent<{}>, newValue: number) => {
        console.log(event)
        if (newValue >= 0 && newValue < pages.length) {
            setValue(newValue);
            navigate(pages[newValue].path);
        }
    };

    const handleProfileClick = () => {
        navigate(profilePath, { state: { userId: userId } });
        setValue(pages.length); 
    };

    return (
        <Paper
            sx={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                display: { xs: 'block', md: 'none' },
                backgroundColor: '#2d3748',
                zIndex: 1200,
            }}
            elevation={3}
        >
            <BottomNavigation
                value={value}
                onChange={handleNavigation}
                sx={{
                    backgroundColor: 'inherit',
                    '& .Mui-selected': { color: '#4caf50' },
                }}
            >
                {pages.map((page, index) => (
                    <BottomNavigationAction
                        key={index}
                        label={page.label}
                        icon={page.icon}
                    />
                ))}
                <BottomNavigationAction
                    icon={<PersonIcon />}
                    onClick={handleProfileClick}
                    label="Profile"
                />
            </BottomNavigation>
        </Paper>

    );
};

export default BottomNav;
