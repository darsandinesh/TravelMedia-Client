import React, { useEffect, useState } from 'react';
import {
  Typography,
  Grid,
  Paper,
  List,
  ListItem,
  Divider,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Box,
} from '@mui/material';
import axiosInstance from '../../../constraints/axios/adminAxios';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { BarChart } from '@mui/x-charts/BarChart';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Create a dark theme
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
      default: '#121212',
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

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, postsResponse, totalUsersResponse] = await Promise.all([
          axiosInstance.get('/admin/getNewUsers'),
          axiosInstance.get('/post/getNewPosts'),
          axiosInstance.get('/admin/getTotalUsers'),
        ]);

        setUsers(usersResponse.data.data);
        setPosts(postsResponse.data.data);
        setTotalUsers(totalUsersResponse.data.count);
        setTotalPosts(postsResponse.data.count);
      } catch (error) {
        localStorage.removeItem('adminToken');
        navigate('/admin');
        toast.error('Failed to fetch admin dashboard data');
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
        {/* Summary Information (Total Users and Posts) */}
        <Paper
          elevation={3}
          sx={{
            padding: '20px',
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            backgroundColor: 'background.paper',
            color: 'text.primary',
            '@media (max-width: 600px)': {
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            },
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Typography variant="h6">Total Users</Typography>
              <Typography variant="h4" color="primary">
                {totalUsers}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h6">Total Posts</Typography>
              <Typography variant="h4" color="primary">
                {totalPosts}
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* Bar Chart (User and Post Activity) */}
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
          <BarChart
            sx={{ marginLeft: '20%', paddingLeft: '10%' }}
            xAxis={[{ scaleType: 'band', data: ['Users', 'Posts'] }]}
            series={[{ data: [totalUsers, totalPosts] }]}
            width={800}
            height={300}
            barLabel="value"
          />
        </Paper>

        {/* Newly Registered Users and Newly Created Posts */}
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
                          <Typography
                            component="span"
                            variant="body2"
                            sx={{ color: 'text.secondary', display: 'inline' }}
                          >
                            {user.email}
                          </Typography>
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
                      <ListItemAvatar sx={{ paddingRight: '20px' }}>
                        <Avatar variant="square" src={post.imageUrl[0]} sx={{ width: 56, height: 56 }} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={post.location}
                        secondary={
                          <Typography
                            component="span"
                            variant="body2"
                            sx={{ color: 'text.secondary', display: 'inline' }}
                          >
                            {post.description}
                          </Typography>
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
