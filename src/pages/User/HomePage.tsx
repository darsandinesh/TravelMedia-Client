import React, { useEffect } from 'react';
import Content from '../../components/User/Home/Content/Content';
import NavBar from '../../components/User/Home/NavBar/NavBar';
import { useNavigate } from 'react-router-dom';
import FriendSuggestion from '../../components/User/Home/FriendSuggestion/FriednSuggestion';
import { useMediaQuery, Box } from '@mui/material';
import { useTheme } from '@mui/system';
import VerticalCard from '../../components/User/Home/VerticalCard/VerticalCard';
import AIAssistant from '../../components/User/Home/AiAssistant/AiAssistant';
import BottomNav from '../../components/User/Home/footer/BottomNav';

const HomePage: React.FC = () => {
    const theme = useTheme();

    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'lg'));

    const navigate = useNavigate();

    useEffect(() => {
        const userToken = localStorage.getItem('userToken');
        if (!userToken) navigate('/login');
    }, [navigate]);

    return (
        <div className="flex flex-col h-screen">
            <NavBar />
            <div className="flex flex-grow">
                <main className="flex flex-grow items-center justify-center p-4 ml-[250px]">
                    <Content />
                    <Box
                        sx={{
                            position: 'fixed',
                            display: isSmallScreen || isMediumScreen ? 'none' : 'block'
                        }}
                    >
                        <FriendSuggestion />
                        <VerticalCard />
                    </Box>
                    <Box
                        sx={{
                            position: 'fixed',
                            bottom: { xs: '70%', md: '10%' }, 
                            right: '50px',
                            zIndex: 1100, 
                        }}
                    >
                        <AIAssistant />
                    </Box>

                </main>
            </div>
            <BottomNav />
        </div>

    );
};

export default HomePage;
