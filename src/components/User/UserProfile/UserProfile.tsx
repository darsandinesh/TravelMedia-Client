import axios from 'axios';
import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  CircularProgress,
  Typography,
  Card,
  CardMedia,
  Button,
  Avatar,
  Divider,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tabs,
  Tab,
  Box,
  CardContent,
} from '@mui/material';

// joy component
import Buttons from '@mui/joy/Button';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import Typographys from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import AspectRatio from '@mui/joy/AspectRatio';
import Avatars from '@mui/joy/Avatar';
import Boxs from '@mui/joy/Box';
import Cards from '@mui/joy/Card';
import CardCover from '@mui/joy/CardCover';
import Chip from '@mui/joy/Chip';
import IconButton from '@mui/joy/IconButton';
import Link from '@mui/joy/Link';
import Favorite from '@mui/icons-material/Favorite';
import Visibility from '@mui/icons-material/Visibility';
import CreateNewFolder from '@mui/icons-material/CreateNewFolder';

import Carousel from 'react-material-ui-carousel';
import { toast } from 'sonner';
import axiosInstance from '../../../constraints/axios/userAxios';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/sotre';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateUser } from '../../../redux/slice/UserSlice';
import ShowFriends from './ShowFriends';

interface User {
  id: string;
  name: string;
  email: string;
  bio: string;
  avatarUrl: string;
  location: string;
  joinedDate: string;
  postsCount: number;
  followers: string[];
  following: string[];
}

interface Post {
  id: string;
  imageUrl: string | string[];
  description: string;
  comments: string[];
  likes: string[];
  location: string;
}

const UserProfile = () => {
  // const { userId: paramUserId } = useParams<{ userId?: string }>();
  const location = useLocation();
  const paramUserId = location.state.userId;
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<string>('posts');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [open, setOpen] = React.useState<boolean>(false);
  const [modal, setModal] = useState({
    description: '',
    images: [] as string[],
    likes: 0,
    comments: 0,
    location: '',
  });
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [openFriends, setOpenFriends] = useState<boolean>(false);

  const dispatch = useDispatch();
  const currentUserId = useSelector((state: RootState) => state.userAuth?.userData?._id);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const targetUserId = paramUserId || currentUserId;
        const response = await axiosInstance.post('/post/getUserPosts', {
          id: targetUserId,
        });

        const userData = {
          id: response.data.userData.data._id,
          name: response.data.userData.data.name,
          email: response.data.userData.data.email,
          bio: response.data.userData.data.bio,
          avatarUrl: response.data.userData.data.profilePicture,
          location: response.data.userData.data.location,
          joinedDate: response.data.userData.data.created_at,
          postsCount: response.data.result.data.length,
          followers: response.data.userData.data.followers,
          following: response.data.userData.data.followings,
        };

        const userPosts = response.data.result.data;

        setUser(userData);
        setEditedUser(userData);
        setPosts(userPosts);
        setSavedPosts([]); // Set saved posts state with fetched saved posts
        setLoading(false);
        setIsFollowing(userData.followers.includes(currentUserId));
      } catch (err) {
        setError('Failed to load user profile.');
        setLoading(false);
        toast.error('Unable to fetch the user details');
      }
    };

    fetchUserProfile();
  }, [paramUserId, currentUserId]);

  const handleModalOpen = () => {
    if (!paramUserId && user) {
      setEditedUser(user);
      setModalOpen(true);
    }
    if (paramUserId === currentUserId) {
      setEditedUser(user);
      setModalOpen(true);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedFile(null);
    setPreviewUrl('');
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setEditedUser((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (editedUser) {
      try {
        const formData = new FormData();
        formData.append('name', editedUser.name);
        formData.append('bio', editedUser.bio);
        formData.append('location', editedUser.location);
        if (selectedFile) {
          formData.append('avatar', selectedFile);
        }

        const result = await axiosInstance.put(`/userProfile/${editedUser.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (!result.data.success) {
          toast.error(result.data.message);
        } else {
          setUser((prevUser) => ({
            ...prevUser!,
            name: editedUser.name,
            bio: editedUser.bio || 'no bio ',
            location: editedUser.location || 'no location',
            avatarUrl: result.data.avatarUrl || prevUser!.avatarUrl,
          }));
          const image = result.data?.avatarUrl;
          const username = editedUser.name;
          dispatch(updateUser({ name: username, avatar: image }));
          toast.success('Profile updated successfully');
          handleModalClose();
        }
      } catch (err) {
        toast.error('Failed to update profile');
      }
    }
  };

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    setActiveTab(newValue);
  };

  const handleFollow = async () => {
    if (user) {
      try {
        const response = await axiosInstance.post('/follow', {
          loggeduser: currentUserId,
          followedId: user.id,
        });
        if (response.data.success) {
          setIsFollowing(true);
          setUser(prev => {
            if (prev) {
              // Create a new array with the new follower added
              const updatedFollowers = [...prev.followers, currentUserId];

              return {
                ...prev,
                followers: updatedFollowers
              };
            }
            return prev;
          });
          toast.success('Followed successfully');
        } else {
          toast.error(response.data.message);
        }
      } catch (err) {
        toast.error('Failed to follow user');
      }
    }
  };

  const handleUnFollow = async () => {
    if (user) {
      try {
        const response = await axiosInstance.post('/unfollow', {
          loggeduser: currentUserId,
          followedId: user.id,
        });
        if (response.data.success) {
          setIsFollowing(false);
          setUser(prev => {
            if (prev) {
              // Create a new array without the follower
              const updatedFollowers = prev.followers.filter(id => id !== currentUserId);

              return {
                ...prev,
                followers: updatedFollowers
              };
            }
            return prev;
          });
          toast.success('Unfollowed successfully');

        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error('Failed to unfollow the user');
      }
    }
  };

  const postModal = (i: number) => {
    try {
      const post = posts[i];
      const obj = {
        comments: post.comments.length,
        likes: post.likes.length,
        description: post.description,
        images: Array.isArray(post.imageUrl) ? post.imageUrl : [post.imageUrl],
        location: post.location,
      };

      setModal(obj);
      setOpen(true);
    } catch (error) {
      toast.error('Unable to view the post details');
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );

  if (error)
    return (
      <Typography variant="h6" color="error" align="center">
        {error}
      </Typography>
    );





  return (
    <Box
      sx={{
        maxWidth: '800px',
        margin: '0 auto',
        mt: '70px',
        ml: { xs: '0', sm: '5%', md: '25%' }, // Adjust margin-left based on screen size
      }}
    >
      <Card variant="outlined" style={{ padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            src={user?.avatarUrl || 'https://media.istockphoto.com/id/843408508/photo/photography-camera-lens-concept.jpg?s=612x612&w=0&k=20&c=-tm5TKrPDMakrT1vcOE-4Rlyj-iBVdzKuX4viFkd7Vo='}
            alt={user?.name}
            style={{ width: 96, height: 96, marginRight: 16, border: '4px solid #1976d2', borderRadius: '50%' }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Typography variant="h4" gutterBottom>
                {user?.name}
              </Typography>
              {paramUserId ? null : (
                <Button variant="contained" color="primary" onClick={handleModalOpen}>
                  Edit Profile
                </Button>
              )}
              {paramUserId && (
                paramUserId === currentUserId ? (
                  <Button variant="contained" color="primary" onClick={handleModalOpen}>
                    Edit Profile
                  </Button>
                ) : (
                  <div>

                    {
                      isFollowing ?
                        <Button variant="contained" color="primary" onClick={handleUnFollow}>
                          Unfollow
                        </Button>
                        :
                        <Button variant="contained" color="primary" onClick={handleFollow}>
                          Follow
                        </Button>
                    }
                  </div>
                )
              )}
            </div>
            <div style={{ display: 'flex', marginBottom: 16 }}>
              <Typography variant="body1" style={{ marginRight: 16 }}>
                <strong>{posts.length}</strong> posts
              </Typography>
              <Typography variant="body1" style={{ marginRight: 10, cursor: 'pointer' }}>
                <p onClick={() => setOpenFriends(true)}>
                  <strong>{user?.followers.length}</strong> followers</p>
              </Typography>
              <Typography variant="body1" style={{ cursor: 'pointer' }}>
                <p onClick={() => setOpenFriends(true)}>
                  <strong>{user?.following.length}</strong> following</p>
              </Typography>
            </div>
            <Typography variant="body1">{user?.bio || ''}</Typography>
          </div>
        </div>
        <Divider style={{ margin: '16px 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <Typography variant="body1">
            <strong>Location:</strong> {user?.location || ''}
          </Typography>
          <Typography variant="body1">
            <strong>Joined:</strong> {new Date(user?.joinedDate).toLocaleDateString()}
          </Typography>
        </div>
        <Tabs value={activeTab} onChange={handleTabChange} indicatorColor="primary" textColor="primary" centered>
          <Tab label="Posts" value="posts" />
          <Tab label="Saved Posts" value="saved" />
        </Tabs>
        <Divider />
        <Box style={{ marginTop: 16 }}>
          {activeTab === 'posts' ? (
            <Grid container spacing={2}>
              {posts.map((post, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card>
                    {Array.isArray(post.imageUrl) ? (
                      <Carousel>
                        {post.imageUrl.map((url, idx) => (
                          <CardMedia key={idx} component="img" height="200" image={url} alt={`post-image-${idx}`} onClick={() => postModal(index)} />
                        ))}
                      </Carousel>
                    ) : (
                      <CardMedia component="img" height="200" image={post.imageUrl} alt="post-image" onClick={() => postModal(index)} />
                    )}
                    <CardContent>
                      <Typography variant="body2">{post.description}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Grid container spacing={2}>
              {savedPosts.map((post, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card>
                    {Array.isArray(post.imageUrl) ? (
                      <Carousel>
                        {post.imageUrl.map((url, idx) => (
                          <CardMedia key={idx} component="img" height="200" image={url} alt={`saved-post-image-${idx}`} />
                        ))}
                      </Carousel>
                    ) : (
                      <CardMedia component="img" height="200" image={post.imageUrl} alt="saved-post-image" />
                    )}
                    <CardContent>
                      <Typography variant="body2">{post.description}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Card>

      <Dialog open={modalOpen} onClose={handleModalClose}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>

          <Grid container direction="column" alignItems="center" spacing={2} sx={{ marginBottom: 5 }}>
            <Grid item>
              <Avatar
                src={previewUrl || editedUser?.avatarUrl || 'https://media.istockphoto.com/id/843408508/photo/photography-camera-lens-concept.jpg?s=612x612&w=0&k=20&c=-tm5TKrPDMakrT1vcOE-4Rlyj-iBVdzKuX4viFkd7Vo='}
                style={{ width: 96, height: 96, borderRadius: '50%' }}
              />
              <Button
                variant="contained"
                color="secondary"
                component="label"
                style={{ marginTop: 10, marginLeft: -25 }}
              >
                Upload Avatar
                <input type="file" accept="image/*" hidden onChange={handleFileChange} />
              </Button>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Name"
                name="name"
                value={editedUser?.name || ''}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                name="email"
                value={editedUser?.email || ''}
                onChange={handleChange}
                fullWidth
                required
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Bio"
                name="bio"
                value={editedUser?.bio || ''}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Location"
                name="location"
                value={editedUser?.location || ''}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* post modal */}

      {
        openFriends && (
          <ShowFriends onClose={() => setOpenFriends(false)} />
        )}

    </Box>
  );
};

export default UserProfile;
