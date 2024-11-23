import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Grid, Snackbar, Alert } from '@mui/material';
import axios from 'axios';

const ContactUsSection = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !email || !message) {
            setSnackbarMessage('Please fill all fields');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            return;
        }

        try {
            const response = await axios.post('YOUR_API_ENDPOINT', { name, email, message });

            if (response.status === 200) {
                setSnackbarMessage('Message sent successfully!');
                setSnackbarSeverity('success');
                setName('');
                setEmail('');
                setMessage('');
            } else {
                setSnackbarMessage('Something went wrong. Please try again.');
                setSnackbarSeverity('error');
            }
        } catch (error) {
            setSnackbarMessage('Failed to send the message. Please try again later.');
            setSnackbarSeverity('error');
        } finally {
            setOpenSnackbar(true);
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                padding: '60px',
                gap: 4,
                background: 'linear-gradient(135deg, #f0f0f0, #ffffff)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            }}
        >
            {/* Left Content */}
            <Box
                sx={{
                    flex: 1,
                    textAlign: { xs: 'center', md: 'left' },
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                }}
            >
                <Typography
                    variant="h6"
                    sx={{ marginBottom: 2, color: '#333333', fontWeight: '600' }}
                >
                    Contact Us
                </Typography>
                <Typography
                    variant="h4"
                    fontWeight="bold"
                    gutterBottom
                    sx={{ color: '#2c3e50' }}
                >
                    We'd love to hear from you!
                </Typography>
                <Typography sx={{ marginBottom: 4, color: '#555555' }}>
                    Thank you for choosing TravelMedia. We're here to assist you with any
                    inquiries or support.
                </Typography>
            </Box>

            {/* Right Form */}
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                }}
            >
                <form onSubmit={handleFormSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Your Name"
                                variant="outlined"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Your E-mail"
                                type="email"
                                variant="outlined"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Your Message"
                                multiline
                                rows={4}
                                variant="outlined"
                                required
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button type="submit" variant="contained" size="large">
                                Send Message Now
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>

            {/* Snackbar */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={4000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setOpenSnackbar(false)}
                    severity={snackbarSeverity}
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ContactUsSection;
