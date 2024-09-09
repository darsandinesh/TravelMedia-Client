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

interface User {
  id: string;
  name: string;
  avatarUrl: string;
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

  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, postsResponse, totalUsersResponse] = await Promise.all([
          axiosInstance.get('/admin/getNewUsers'),
          axiosInstance.get('/post/getNewPosts'),
          axiosInstance.get('/admin/getTotalUsers'),
        ]);
        console.log(usersResponse.status,'--------------------------')

        setUsers(usersResponse.data.data);
        setPosts(postsResponse.data.data);
        setTotalUsers(totalUsersResponse.data.count);
        setTotalPosts(postsResponse.data.count);
      } catch (error) {
        localStorage.removeItem('adminToken')
        navigate('/admin')
        toast.error('Failed to fetch admin dashboard data');
      }
    };

    fetchData();
  }, []);

  return (
    <Box sx={{ width: '1000px', margin: '0 auto', marginTop: '60px', marginLeft: '25%' }}>
      {/* Summary Information */}
      <Paper elevation={3} sx={{ padding: '20px', marginBottom: '20px' }}>
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

      {/* Newly Registered Users and Newly Created Posts */}
      <Grid container spacing={3}>
        {/* Users Section */}
        <Grid item xs={6}>
          <Paper elevation={3} sx={{ padding: '20px', marginBottom: '20px' }}>
            <Typography variant="h6" gutterBottom>
              Newly Registered Users
            </Typography>
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
              {users.map((user) => (
                <React.Fragment key={user.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar alt={user.name} src={user.avatarUrl} />
                    </ListItemAvatar>
                    <ListItemText
                    
                      primary={user.name}
                      secondary={
                        <Typography
                          component="span"
                          variant="body2"
                          sx={{ color: 'text.primary', display: 'inline' }}
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
        <Grid item xs={6}>
          <Paper elevation={3} sx={{ padding: '20px' }}>
            <Typography variant="h6" gutterBottom>
              Newly Created Posts
            </Typography>
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
              {posts.map((post) => (
                <React.Fragment key={post.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar style={{paddingRight:'20px'}}>
                      <Avatar variant="square" src={post.imageUrl} sx={{ width: 56, height: 56 }} />
                    </ListItemAvatar>
                    
                    <ListItemText
                      primary= {post.location}
                      secondary={
                        <Typography
                          component="span"
                          variant="body2"
                          sx={{ color: 'text.primary', display: 'inline' }}
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
  );
};

export default AdminDashboard;
