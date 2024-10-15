import { Box, Button, Typography, Card, Grid, Container } from '@mui/joy';
import DoneIcon from '@mui/icons-material/Done';
import Navbar from '../Home/NavBar/NavBar';

function Pricing({fn}) {
    return (
        <>
            <Navbar />
            <Box component="section" sx={{ py: { xs: 6, lg: 9, maxWidth: '60%', marginLeft: "23%", marginTop: "6%" }, backgroundColor: 'background.level1' }}>
                <Container>
                    {/* Title and description */}
                    <Grid container justifyContent="center" sx={{ textAlign: 'center', mb: 4 }}>
                        <Grid item xs={12} md={6}>
                            <Typography level="h2" sx={{ mb: 1 }}>
                                Upgrade to Lifetime Membership
                            </Typography>
                            <Typography level="body1" color="text.secondary">
                                Unlock exclusive features like finding your travel buddy.

                            </Typography>
                        </Grid>
                    </Grid>

                    {/* Pricing Card */}
                    <Grid container justifyContent="center">
                        <Card sx={{ width: '100%', maxWidth: 600 }}>
                            <Grid container alignItems="center">
                                <Grid item xs={12} lg={8}>
                                    <Box sx={{ py: 3, px: 4 }}>
                                        <Typography level="h3" sx={{ mb: 1 }}>
                                            Lifetime Membership
                                        </Typography>
                                        <Typography level="body2" color="text.secondary" sx={{ mb: 2 }}>
                                            With the Lifetime Membership, you get:
                                        </Typography>

                                        {/* Key features of the plan */}
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                            <Typography>
                                                <DoneIcon color="success" /> Access to the **Find Buddy** feature.
                                            </Typography>
                                            {/* <Typography>
                      <DoneIcon color="success" /> Free Unlimited Updates.
                    </Typography> */}
                                            {/* <Typography>
                      <DoneIcon color="success" /> Premium 24/7 Support.
                    </Typography> */}
                                            <Typography>
                                                <DoneIcon color="success" /> Entry to exclusive travel events.
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>

                                {/* Pricing and CTA */}
                                <Grid item xs={12} lg={4}>
                                    <Box sx={{ p: 3, textAlign: 'center' }}>
                                        <Typography >
                                            Pay once, own it forever
                                        </Typography>
                                        <Typography level="h1" sx={{ display: 'inline-block', my: 2 }}>
                                            <Typography component="span" >Rs.</Typography>499
                                        </Typography>
                                        <Button variant="solid" color="success" size="lg" sx={{ my: 2 }}>
                                            Get Access Now
                                        </Button>
                                        {/* <Typography level="body2" color="text.secondary">
                    Full refund within 30 days if not satisfied.
                  </Typography> */}
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
