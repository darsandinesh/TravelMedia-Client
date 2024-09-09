import axios from 'axios';
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
import Carousel from 'react-material-ui-carousel';
import { toast } from 'sonner';
import axiosInstance from '../../../constraints/axios/userAxios';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/sotre';
import { useParams } from 'react-router-dom';

interface User {
  id: string;
  name: string;
  email: string;
  bio: string;
  avatarUrl: string;
  location: string;
  joinedDate: string;
  postsCount: number;
  followers: number;
  following: number;
}

interface Post {
  id: string;
  imageUrl: string | string[];
  description: string;
}

const UserProfile = () => {
  const { userId: paramUserId } = useParams<{ userId?: string }>();
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
          followers: response.data.userData.data.followers.length,
          following: response.data.userData.data.followings.length,
        };

        const userPosts = response.data.result.data;

        setUser(userData);
        setEditedUser(userData);
        setPosts(userPosts);
        setSavedPosts([]); // Set saved posts state with fetched saved posts
        setLoading(false);
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
            bio: editedUser.bio,
            location: editedUser.location,
            avatarUrl: result.data.avatarUrl || prevUser!.avatarUrl,
          }));
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
        const response = await axiosInstance.post('/user/follow', {
          followerId: currentUserId,
          followedId: user.id,
        });
        if (response.data.success) {
          toast.success('Followed successfully');
        } else {
          toast.error(response.data.message);
        }
      } catch (err) {
        toast.error('Failed to follow user');
      }
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
    <div style={{ width: '800px', margin: '0 auto', marginTop: '70px',marginLeft:'25%' }}>
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
                <Button variant="contained" color="primary" onClick={handleFollow}>
                  Follow
                </Button>
              )}
            </div>
            <div style={{ display: 'flex', marginBottom: 16 }}>
              <Typography variant="body1" style={{ marginRight: 16 }}>
                <strong>{posts.length}</strong> posts
              </Typography>
              <Typography variant="body1" style={{ marginRight: 10 }}>
                <strong>{user?.followers}</strong> followers
              </Typography>
              <Typography variant="body1">
                <strong>{user?.following}</strong> following
              </Typography>
            </div>
            <Typography variant="body1">{user?.bio}</Typography>
            <Typography variant="body1">{user?.location}</Typography>
          </div>
        </div>
        <Divider style={{ margin: '16px 0' }} />

        {/* Tabs for toggling between Posts and Saved Posts */}
        <Tabs value={activeTab} onChange={handleTabChange} centered>
          <Tab label="Posts" value="posts" />
          <Tab label="Saved Posts" value="saved" />
        </Tabs>

        {/* Conditional Rendering Based on Active Tab */}
        <Box>
          <Grid container spacing={2}>
            {(activeTab === 'posts' ? posts : savedPosts).map((post) => (
              <Grid item xs={12} sm={6} md={4} key={post.id}>
                {Array.isArray(post.imageUrl) && post.imageUrl.length > 1 ? (
                  <Carousel>
                    {post.imageUrl.map((url, index) => (
                      <CardMedia
                        component="img"
                        src={url}
                        alt={`Post image ${index}`}
                        key={index}
                        style={{ height: '250px', objectFit: 'cover' }}
                      />
                    ))}
                  </Carousel>
                ) : (
                  <CardMedia
                    component="img"
                    src={Array.isArray(post.imageUrl) ? post.imageUrl[0] : post.imageUrl}
                    alt="Post"
                    style={{ height: '250px', objectFit: 'cover' }}
                  />
                )}
                <CardContent>
                  <Typography variant="body2">{post.description}</Typography>
                </CardContent>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Card>

      {/* Edit Profile Modal */}
      <Dialog open={modalOpen} onClose={handleModalClose}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Grid container direction="column" alignItems="center" spacing={2}>
            <Grid item>
              <Avatar
                src={previewUrl || editedUser?.avatarUrl || 'https://media.istockphoto.com/id/843408508/photo/photography-camera-lens-concept.jpg?s=612x612&w=0&k=20&c=-tm5TKrPDMakrT1vcOE-4Rlyj-iBVdzKuX4viFkd7Vo='}
                style={{ width: 96, height: 96, borderRadius: '50%' }}
              />
              <Button
                variant="contained"
                color="secondary"
                component="label"
                style={{ marginTop: 10,marginLeft:-25 }}
              >
                Upload Avatar
                <input type="file" accept="image/*" hidden onChange={handleFileChange} />
              </Button>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Name"
                name="name"
                value={editedUser?.name || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Bio"
                name="bio"
                value={editedUser?.bio || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
                multiline
                rows={4}
              />
              <TextField
                label="Location"
                name="location"
                value={editedUser?.location || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserProfile;
