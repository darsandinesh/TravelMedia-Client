import React, { useEffect } from 'react';
import Content from '../../components/User/Home/Content/Content';
import NavBar from '../../components/User/Home/NavBar/NavBar';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/User/Home/footer/Footer';
import FriendSuggestion from '../../components/User/Home/FriendSuggestion/FriednSuggestion';
import { useMediaQuery, Box, ThemeProvider, createTheme } from '@mui/material';
import { useTheme } from '@mui/system';

const HomePage: React.FC = () => {
    const theme = useTheme();

    // Check if the screen is small (sm) or medium (md)
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'lg'));

    const navigate = useNavigate();

    useEffect(() => {
        const userToken = localStorage.getItem('userToken');
        if (!userToken) navigate('/');
    }, [navigate]);

    return (
        <div className="flex flex-col h-screen">
            <NavBar />
            <div className="flex flex-grow">
                <main className="flex flex-grow items-center justify-center p-4 ml-[250px]">
                    <Content />
                    {/* Conditionally show FriendSuggestion component based on screen size */}
                    <Box
                        sx={{
                            position: 'fixed',
                            display: isSmallScreen || isMediumScreen ? 'none' : 'block'
                        }}
                    >
                        <FriendSuggestion />
                    </Box>
                </main>
            </div>
            {/* <div >
                <Footer />
            </div> */}
        </div>
    );
};

export default HomePage;
