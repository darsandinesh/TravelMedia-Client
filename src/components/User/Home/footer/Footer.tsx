import { Box, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box
      sx={{
        width: '100%',
        padding: '20px',
        backgroundColor: '#f5f5f5',
        boxShadow: '0px -2px 5px rgba(0, 0, 0, 0.1)',
        position: 'absolute',
        marginTop:'10px',
        bottom: 0,
        left: 0,
        textAlign: 'center',
        '@media (max-width: 600px)': {
          padding: '10px',
        },
      }}
    >
      <Typography variant="body2" color="text.secondary">
        © 2024 Your Social Media App. All rights reserved.
      </Typography>
      <Box sx={{ marginTop: '10px' }}>
        <Link href="/privacy" sx={{ marginRight: '15px' }}>
          Privacy Policy
        </Link>
        <Link href="/terms" sx={{ marginRight: '15px' }}>
          Terms of Service
        </Link>
        <Link href="/contact">Contact Us</Link>
      </Box>
    </Box>
  );
};

export default Footer;
