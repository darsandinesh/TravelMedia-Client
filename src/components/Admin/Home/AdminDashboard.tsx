import React, { useEffect, useState } from 'react';
import { Typography, Grid, Paper, List, ListItem, Divider, ListItemText, ListItemAvatar, Avatar, Box, CardContent, Card } from '@mui/material';
import axiosInstance from '../../../constraints/axios/adminAxios';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { BarChart, PieChart } from '@mui/x-charts';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { adminEndpoints } from '../../../constraints/endpoints/adminEndpoints';
import { postEndpoints } from '../../../constraints/endpoints/postEndpoints';

// Dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#213547',
      paper: '#1d1d1d',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0bec5',
    },
  },
});

interface User {
  id: string;
  name: string;
  profilePicture: string;
  email: string;
}

interface Post {
  id: string;
  imageUrl: string;
  description: string;
  location: string;
}

const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [totalPosts, setTotalPosts] = useState<number>(0);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [normalUsers, setNormalUsers] = useState<number>(0);
  const [primeUsers, setPrimeUsers] = useState<number>(0);
  const [paymentData, setPaymentData] = useState<{ month: string; amount: number }[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          usersResponse,
          postsResponse,
          totalUsersResponse,
          userDataResponse,
        ] = await Promise.all([
          axiosInstance.get(`${adminEndpoints.getNewUsers}`),
          axiosInstance.get(`${postEndpoints.getNewPosts}`),
          axiosInstance.get(`${adminEndpoints.getTotalUsers}`),
          axiosInstance.get(`${adminEndpoints.getUserData}`),
        ]);

        setUsers(usersResponse.data.data || []);
        setPosts(postsResponse.data.data || []);
        setTotalUsers(totalUsersResponse.data.count || 0);
        setTotalPosts(postsResponse.data.count || 0);
        if(userDataResponse.data.data.totalRevenue.length>0){
        setTotalRevenue(userDataResponse.data.data.totalRevenue[0].totalRevenue || 0);
        }
        setNormalUsers(userDataResponse.data.data.normalUsers || 0);
        setPrimeUsers(userDataResponse.data.data.primeUsers || 0);
        let data = userDataResponse.data.data.prime || [];

        if (data.length > 0) {
          const newPaymentData: { month: string; amount: number }[] = [];

          // Create an object to aggregate amounts by month
          const monthAggregation: { [key: string]: number } = {};

          data.forEach((val: any) => {
            const dateString = val.membership.startDate;
            const date = new Date(dateString);
            const month = date.getMonth() + 1;
            const amount = val.membership.amount;

            const monthKey = month.toString();

            // Aggregate the amount for each month
            if (!monthAggregation[monthKey]) {
              monthAggregation[monthKey] = 0; // Initialize if not exist
            }
            monthAggregation[monthKey] += amount; // Add to the existing amount
          });

          // Convert aggregated object to array format
          if (monthAggregation) {
            for (const [month, amount] of Object.entries(monthAggregation)) {
              newPaymentData.push({ month, amount });
            }

            setPaymentData(newPaymentData);
          }

        }
      } catch (error:any) {
        localStorage.removeItem('adminToken');
        navigate('/admin');
        toast.error('Failed to fetch admin dashboard data1');
      }
    };
    fetchData();
  }, [navigate]);

  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          width: '90%',
          margin: '0 auto',
          marginTop: '60px',
          '@media (min-width: 900px)': {
            width: '80%',
          },
          '@media (min-width: 1200px)': {
            width: '70%',
          },
        }}
      >
        <Grid container spacing={3} sx={{ marginBottom: '20px' }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ backgroundColor: 'background.paper', color: 'text.primary', boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Total Users
                </Typography>
                <Typography variant="h4" color="primary">
                  {totalUsers}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ backgroundColor: 'background.paper', color: 'text.primary', boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Total Posts
                </Typography>
                <Typography variant="h4" color="primary">
                  {totalPosts}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ backgroundColor: 'background.paper', color: 'text.primary', boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Total Revenue
                </Typography>
                <Typography variant="h4" color="primary">
                  Rs. {totalRevenue.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Paper
          elevation={3}
          sx={{
            padding: '20px',
            marginBottom: '20px',
            backgroundColor: 'background.paper',
            color: 'text.primary',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              textAlign: 'center',
              marginBottom: '10px',
            }}
          >
            Normal Users vs Prime Users
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: 400, marginBottom: '10px' }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body1" color="#02b2af">
                Normal Users
              </Typography>
              <Typography variant="h6" color="#02b2af">
                {normalUsers}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body1" color="#72ccff">
                Prime Users
              </Typography>
              <Typography variant="h6" color="#72ccff">
                {primeUsers}
              </Typography>
            </Box>
          </Box>

          <PieChart
            series={[{
              data: [
                { id: 0, label: 'Normal Users', value: normalUsers },
                { id: 1, label: 'Prime Users', value: primeUsers },
              ],
            }]}
            width={400}
            height={300}
            sx={{ margin: '0 auto' }}
          />
        </Paper>

        {/* Payment Data Bar Chart */}
        <Paper
          elevation={3}
          sx={{
            padding: '20px',
            marginBottom: '20px',
            backgroundColor: 'background.paper',
            color: 'text.primary',
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ marginLeft: '40%' }}>
            Payment Data (Monthly Revenue)
          </Typography>
          <Box sx={{ width: '100%', height: '300px' }}>
            <BarChart
              sx={{ width: '100%', height: '100%' }} // Set width and height to 100%
              xAxis={[{ scaleType: 'band', data: paymentData.map((item) => item.month) }]}
              series={[{
                data: paymentData.map((item) => item.amount),
              }]}
              barLabel="value"
            />
          </Box>
        </Paper>

        {/* Bar Chart for User and Post Activity */}
        <Paper
          elevation={3}
          sx={{
            padding: '20px',
            marginBottom: '20px',
            backgroundColor: 'background.paper',
            color: 'text.primary',
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ marginLeft: '40%' }}>
            User and Post Activity
          </Typography>
          <Box sx={{ width: '100%', height: '300px' }}>
            <BarChart
              sx={{ width: '100%', height: '100%' }} // Set width and height to 100%
              xAxis={[{ scaleType: 'band', data: ['Users', 'Posts'] }]}
              series={[{ data: [totalUsers, totalPosts] }]}
              barLabel="value"
            />
          </Box>
        </Paper>

        {/* New Users List */}
        <Grid container spacing={3}>
          {/* Users Section */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{
                padding: '20px',
                marginBottom: '20px',
                backgroundColor: 'background.paper',
                color: 'text.primary',
              }}
            >
              <Typography variant="h6" gutterBottom>
                Newly Registered Users
              </Typography>
              <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {users.map((user) => (
                  <React.Fragment key={user.id}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar alt={user.name} src={user.profilePicture} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={user.name}
                        secondary={
                          <>
                            <Typography component="span" variant="body2" color="text.secondary">
                              {user.email}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Posts Section */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{
                padding: '20px',
                marginBottom: '20px',
                backgroundColor: 'background.paper',
                color: 'text.primary',
              }}
            >
              <Typography variant="h6" gutterBottom>
                Newly Created Posts
              </Typography>
              <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {posts.map((post) => (
                  <React.Fragment key={post.id}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar alt={post.description} src={post.imageUrl} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={post.description}
                        secondary={
                          <>
                            <Typography component="span" variant="body2" color="text.secondary">
                              {post.location.split(',')[0]}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default AdminDashboard;