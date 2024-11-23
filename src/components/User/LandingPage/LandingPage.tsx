import { Button, Typography, Box, Grid, AppBar, Toolbar } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Facebook, Twitter, Instagram, LinkedIn } from '@mui/icons-material';
import { Player } from '@lottiefiles/react-lottie-player'
import { CiLogin } from "react-icons/ci";
import AboutSession from './AboutUs';
import image1 from '../../../assets/landing1.jpg'
import image2 from '../../../assets/landing2.jpg'
import image3 from '../../../assets/landing3.jpg'
import image4 from '../../../assets/landing4.jpg'
import image5 from '../../../assets/landing5.jpg'
import image6 from '../../../assets/landing6.jpg'
import ContactUsSection from './ContactUsSection';
import { useEffect } from 'react';

const travelImages = [image1, image2, image3, image4, image5, image6];

const LandingPage = () => {

  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (token) navigate('/home');
  })
  return (
    <div>
      {/* Header */}
      <Box
        sx={{
          height: '100vh',
          background: 'linear-gradient(to bottom right, #E3FDFD, #FFE6FA)',
          color: '#2C2C2C',
        }}
      >
        {/* Navigation Bar */}
        <AppBar
          position="fixed"
          sx={{
            bgcolor: 'rgba(255, 255, 255, 0.0)',
            padding: '10px 0',
            boxShadow: 'none',
            backdropFilter: 'blur(10px)',

          }}
        >
          <Toolbar>
            <Typography
              variant="h6"
              sx={{
                flexGrow: 1,
                fontWeight: 'bold',
                color: '#3A506B', // Soft navy blue for branding
              }}
            >
              TravelMedia
            </Typography>
            <Button
              onClick={() => navigate('/login')}
              variant="outlined"
              sx={{
                color: '#3A506B',
                borderColor: '#3A506B',
                marginLeft: 2,
                '&:hover': { backgroundColor: 'rgba(58, 80, 107, 0.1)' },
              }}
            >
              Login
            </Button>
            <Button
              onClick={() => navigate('/Signup')}
              variant="contained"
              sx={{
                marginLeft: 2,
                backgroundColor: '#84CEEB', // Light blue for a fresh feel
                color: '#FFFFFF',
                '&:hover': { backgroundColor: '#5AB9EA' }, // Slightly darker blue
              }}
            >
              Sign Up
            </Button>
          </Toolbar>
        </AppBar>

        {/* Hero Section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            height: { xs: 'auto', md: 'calc(100vh - 64px)' }, // Adjust height for smaller screens
            padding: { xs: '20px', md: '50px' }, // Smaller padding on small screens
          }}
        >
          {/* Left Content */}
          <Box
            sx={{
              flex: 1,
              textAlign: { xs: 'center', md: 'left' },
              marginBottom: { xs: 4, md: 0 },
              marginTop: { xs: 6, md: 0 }, // Adjust top margin for smaller screens
            }}
          >
            <Typography
              variant="h4" // Smaller headline for small screens
              fontWeight="bold"
              gutterBottom
              sx={{
                color: '#3A506B',
                fontSize: { xs: '1.8rem', sm: '2rem', md: '3rem' },
                marginTop: { xs: 3 }
              }}
            >
              Connect with Travelers
            </Typography>
            <Typography
              variant="body1"
              sx={{
                marginBottom: 4,
                color: '#5F5F5F',
                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.25rem' },
              }}
            >
              Share your experiences, explore destinations, and meet like-minded adventurers.
            </Typography>
            <Button
              onClick={() => navigate('/login')}
              variant="outlined"
              size="medium"
              sx={{
                color: '#3A506B',
                borderColor: '#3A506B',
                fontSize: { xs: '0.8rem', md: '1rem' }, // Responsive button text size
                '&:hover': { backgroundColor: 'rgba(58, 80, 107, 0.1)' },
              }}
            >
              Get Started
              <span>
                <CiLogin size={20} />
              </span>
            </Button>
          </Box>

          {/* Lottie Animation */}
          <Box
            sx={{
              flex: 1,
              textAlign: 'center',
              marginTop: { xs: 4, md: 0 },
            }}
          >
            <Player
              autoplay
              loop
              src="https://lottie.host/59e90a92-071c-446d-b6ba-a315821815d4/DU4KXAliCj.json"
              style={{
                width: '70%',
                margin: '0 auto',
              }}
            />
          </Box>
        </Box>

      </Box>

      {/* Features Section */}
      <Box sx={{ padding: '50px', textAlign: 'center', backgroundColor: '#fff' }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Why Choose TravelMedia?
        </Typography>
        <Typography variant="subtitle1" sx={{ marginBottom: 4 }}>
          Discover unique features designed for travelers and explorers.
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '20px',
                backgroundColor: '#fff',
                borderRadius: '10px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                height: '100%',
              }}
            >
              <Player
                autoplay
                loop
                src="https://lottie.host/b73b3882-e7b4-41c0-b249-4e372c3c6af2/OavdZ4Uj7B.json"
                style={{ height: '150px', width: '150px', marginBottom: '20px' }}
              />
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Share Stories
              </Typography>
              <Typography>Post your travel adventures and connect with others.</Typography>
            </motion.div>
          </Grid>

          <Grid item xs={12} sm={4}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '20px',
                backgroundColor: '#fff',
                borderRadius: '10px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                height: '100%',
              }}
            >
              <Player
                autoplay
                loop
                src="https://lottie.host/83aa40e0-77ce-42f7-b53c-db3c194630a1/mehViFw6RW.json"
                style={{ height: '150px', width: '150px', marginBottom: '20px' }}
              />
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Explore Destinations
              </Typography>
              <Typography>Find the best travel destinations from around the world.</Typography>
            </motion.div>
          </Grid>

          <Grid item xs={12} sm={4}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '20px',
                backgroundColor: '#fff',
                borderRadius: '10px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                height: '100%',
              }}
            >
              <Player
                autoplay
                loop
                src="https://lottie.host/9b1c36fb-614f-436e-9eae-9388c0240420/etdhgajTg7.json"
                style={{ height: '150px', width: '150px', marginBottom: '20px' }}
              />
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Meet Travelers
              </Typography>
              <Typography>Join a global community of like-minded adventurers.</Typography>
            </motion.div>
          </Grid>
        </Grid>
      </Box>

      {/* Travel Images Section */}
      <Box sx={{ padding: '50px', backgroundColor: '#e8f4ff', textAlign: 'center' }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Explore Stunning Photos
        </Typography>
        <Grid container spacing={4}>
          {travelImages.map((url, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <motion.img
                src={url}
                alt={`Travel ${index}`}
                style={{ width: '100%', borderRadius: '10px' }}
                whileHover={{ scale: 1.05 }}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* About session */}
      <AboutSession />

      {/* Contact Us Section */}
      <ContactUsSection />

      {/* Footer */}
      <Box sx={{ padding: '40px 20px', backgroundColor: '#fff', color: '#213547' }}>
        {/* Footer Content */}
        <Grid container spacing={4} justifyContent="center">
          {/* Left Column - Logo & Description */}
          <Grid item xs={12} sm={4} md={3} textAlign="center">
            <Typography variant="h6" fontWeight="bold" sx={{ marginBottom: 2 }}>
              TravelMedia
            </Typography>
            <Typography variant="body2" sx={{ marginBottom: 2 }}>
              Discover and share your travel experiences. Join a global community of adventurers.
            </Typography>
            <Button variant="outlined" sx={{ borderColor: '#213547', color: '#213547', '&:hover': { borderColor: '#ff6f61', color: '#ff6f61' } }}>
              Learn More
            </Button>
          </Grid>

          {/* Center Column - Quick Links */}
          <Grid item xs={12} sm={4} md={3} textAlign="center">
            <Typography variant="h6" fontWeight="bold" sx={{ marginBottom: 2 }}>
              Quick Links
            </Typography>
            <Typography variant="body2" sx={{ marginBottom: 1 }}>
              <a href="/about" style={{ textDecoration: 'none', color: '#213547' }}>About Us</a>
            </Typography>
            <Typography variant="body2" sx={{ marginBottom: 1 }}>
              <a href="/contact" style={{ textDecoration: 'none', color: '#213547' }}>Contact Us</a>
            </Typography>
            <Typography variant="body2" sx={{ marginBottom: 1 }}>
              <a href="/privacy" style={{ textDecoration: 'none', color: '#213547' }}>Privacy Policy</a>
            </Typography>
            <Typography variant="body2" sx={{ marginBottom: 1 }}>
              <a href="/terms" style={{ textDecoration: 'none', color: '#213547' }}>Terms of Service</a>
            </Typography>
          </Grid>

          {/* Right Column - Social Media */}
          <Grid item xs={12} sm={4} md={3} textAlign="center">
            <Typography variant="h6" fontWeight="bold" sx={{ marginBottom: 2 }}>
              Follow Us
            </Typography>
            <Box>
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                <Button sx={{ margin: '0 8px', backgroundColor: '#3b5998', '&:hover': { backgroundColor: '#365492' }, color: 'white' }}>
                  <Facebook />
                </Button>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <Button sx={{ margin: '0 8px', backgroundColor: '#1da1f2', '&:hover': { backgroundColor: '#1681b0' }, color: 'white' }}>
                  <Twitter />
                </Button>
              </a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                <Button sx={{ margin: '0 8px', backgroundColor: '#e4405f', '&:hover': { backgroundColor: '#d13550' }, color: 'white' }}>
                  <Instagram />
                </Button>
              </a>
              <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
                <Button sx={{ margin: '0 8px', backgroundColor: '#0077b5', '&:hover': { backgroundColor: '#005a85' }, color: 'white' }}>
                  <LinkedIn />
                </Button>
              </a>
            </Box>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Box sx={{ marginTop: '20px', textAlign: 'center' }}>
          <Typography variant="body2" color="textSecondary">
            &copy; 2024 TravelMedia. All rights reserved.
          </Typography>
        </Box>
      </Box>

    </div>
  );
};

export default LandingPage;
