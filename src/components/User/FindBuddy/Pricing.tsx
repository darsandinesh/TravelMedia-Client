import { Box, Button, CircularProgress, Card, Grid, Container } from '@mui/joy';
import DoneIcon from '@mui/icons-material/Done';
import Typography from '@mui/material/Typography';
import Navbar from '../Home/NavBar/NavBar';
import { toast } from 'sonner';
import { userEndpoints } from '../../../constraints/endpoints/userEndpoints';
import axiosInstance from '../../../constraints/axios/userAxios';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/sotre';
import { loadStripe } from "@stripe/stripe-js";
import { useState } from 'react';

function Pricing() {

    const [loading, setLoading] = useState<boolean>(false);
    const userId = useSelector((state: RootState) => state.userAuth.userData?._id)
    const stripePromise = loadStripe(import.meta.env.VITE_STRIP_KEY);
    const handleClick = async () => {
        setLoading(true)
        console.log('Membership access clicked');
        try {
            const stripe = await stripePromise;
            if (!stripe) {
                throw new Error("Stripe.js failed to load.");
            }

            const result = await axiosInstance.get(`${userEndpoints.membership}?id=${userId}`)
            console.log(result.data);
            if (result.data.success && result.data.sessionId) {
                // Redirect the user to the Stripe checkout page

                const { sessionId } = result.data;
                const { error } = await stripe.redirectToCheckout({
                    sessionId: sessionId,
                });

                if (error) {
                    console.error("Stripe redirection failed:", error.message);
                    toast.error("Failed to redirect to Stripe. Please try again.");
                }

            } else {
                throw new Error("Failed to create Stripe session");
            }

        } catch (error) {
            console.log('error in the membership access', error);
            toast.info('Try after sometime')
        }
    };

    return (
        <>
            <Navbar />
            <Box component="section" sx={{ py: { xs: 6, lg: 9, maxWidth: '60%', marginLeft: "23%", marginTop: "6%" }, backgroundColor: 'background.level1' }}>
                <Container>
                    {/* Title and description */}
                    <Grid container justifyContent="center" sx={{ textAlign: 'center', mb: 4 }}>
                        <Grid xs={12} md={6}>
                            <Typography variant="h4" sx={{ mb: 1 }}>
                                Upgrade to Lifetime Membership
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Unlock exclusive features like finding your travel buddy.
                            </Typography>
                        </Grid>
                    </Grid>

                    {/* Pricing Card */}
                    <Grid container justifyContent="center">
                        <Card sx={{ width: '100%', maxWidth: 600 }}>
                            <Grid container alignItems="center">
                                <Grid xs={12} lg={8}>
                                    <Box sx={{ py: 3, px: 4 }}>
                                        <Typography variant="h3" sx={{ mb: 1 }}>
                                            Lifetime Membership
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                            With the Lifetime Membership, you get:
                                        </Typography>

                                        {/* Key features of the plan */}
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                            <Typography>
                                                <DoneIcon color="success" /> Access to the <strong>Find Buddy</strong> feature.
                                            </Typography>
                                            <Typography>
                                                <DoneIcon color="success" /> Entry to exclusive travel events.
                                            </Typography>
                                            <Typography>
                                                <DoneIcon color="success" /> Can view the distance between the locations.
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>

                                <Grid xs={12} lg={4}>
                                    <Box sx={{ p: 3, textAlign: 'center' }}>
                                        <Typography>
                                            Pay once, own it forever
                                        </Typography>
                                        <Typography variant="h3" sx={{ display: 'inline-block', my: 2 }}>
                                            <Typography component="span">Rs.</Typography>199
                                        </Typography>
                                        <Button
                                            variant="solid"
                                            color="success"
                                            size="lg"
                                            sx={{ my: 2 }}
                                            onClick={handleClick}
                                            disabled={loading}  // Disable button when loading
                                        >
                                            {loading ? (
                                                <CircularProgress color='success' />
                                            ) : (
                                                'Get Access Now'
                                            )}
                                        </Button>

                                    </Box>
                                </Grid>
                            </Grid>
                        </Card>
                    </Grid>
                </Container>
            </Box>
        </>
    );
}

export default Pricing;
