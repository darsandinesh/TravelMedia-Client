import * as React from 'react';
import { useEffect, useState } from 'react';
import { CircularProgress, Typography, Card, CardMedia, Button, Avatar, Divider, Grid, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Tabs, Tab, Box, CardContent,
} from '@mui/material';
import { IoSettingsOutline } from "react-icons/io5";
// joy component
import Modal from '@mui/joy/Modal';
import Typographys from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
// setting imports 
import List from '@mui/joy/List';
import ListDivider from '@mui/joy/ListDivider';
import ListItem from '@mui/joy/ListItem';
import ListItemContent from '@mui/joy/ListItemContent';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import ListItemButton from '@mui/joy/ListItemButton';
import Switch, { switchClasses } from '@mui/joy/Switch';
import { RiGitRepositoryPrivateFill } from "react-icons/ri";
import { MdOutlineDeleteForever } from "react-icons/md";
import { FaUserEdit } from "react-icons/fa";

import Carousel from 'react-material-ui-carousel';
import { toast } from 'sonner';
import axiosInstance from '../../../constraints/axios/userAxios';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/sotre';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateUser } from '../../../redux/slice/UserSlice';
import ShowFriends from './ShowFriends';
import { userEndpoints } from '../../../constraints/endpoints/userEndpoints';

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
  isPrivate: Boolean;
}


interface Post {
  _id?: string
  id: string;
  userId?: string,
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
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [openFriends, setOpenFriends] = useState<boolean>(false);
  const [isPrivate, setIsPrivate] = useState(false);

  const navigate = useNavigate()

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
          postsCount: response.data?.result?.data?.length || 0,
          followers: response.data.userData.data.followers,
          following: response.data.userData.data.followings,
          isPrivate: response.data.userData.data.isPrivate,
        };

        setIsPrivate(response.data.userData.data.isPrivate)
        const userPosts = response?.data?.result.data || [];
        setUser(userData);
        setEditedUser(userData);
        if (userPosts.length > 0) {
          setPosts(userPosts);
        }

        if (response?.data?.savedPosts[0] == undefined ) {
          setSavedPosts([]);
        }else{
          setSavedPosts(response?.data?.savedPosts[0].data);
        }
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
    console.log(event)
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
          setUser((prev:any) => {
            if (prev) {
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

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen" style={{ marginLeft: '50%' }}>
        <CircularProgress />
      </div>
    );

  if (error)
    return (
      <Typography variant="h6" color="error" align="center">
        {error}
      </Typography>
    );


  const fromatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate
  }


  const handleToggle = async () => {
    const updatedIsPrivate = !isPrivate;
    setIsPrivate(updatedIsPrivate);

    try {
      const result = await axiosInstance.post(userEndpoints.changeVisibility, {
        isPrivate: updatedIsPrivate,
        userId: currentUserId,
      });

      console.log(result, 'Status updated successfully');
      if (result.data.success) {
        toast.success(result.data.message);
      } else {
        toast.error(result.data.message)
      }
    } catch (error) {
      console.error('Error updating status', error);
    }
  };

  return (
    <Box
      sx={{
        bgcolor: '#2d3748',
        maxWidth: '800px',
        margin: '0 auto',
        mt: '70px',
        ml: { xs: '0', sm: '5%', md: '25%' },
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
                <>
                  <Button variant="contained" color="primary" onClick={handleModalOpen}>
                    Edit Profile
                  </Button>
                </>
              )}
              {paramUserId && (
                paramUserId === currentUserId ? (
                  <>
                    <Button variant="contained" color="primary" onClick={handleModalOpen}>
                      Edit Profile

                    </Button>
                    <React.Fragment>

                      <IoSettingsOutline size={25} style={{ cursor: 'pointer' }} onClick={() => setOpen(true)} />
                      <Modal
                        aria-labelledby="modal-title"
                        aria-describedby="modal-desc"
                        open={open}
                        onClose={() => setOpen(false)}
                        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                      >
                        <Sheet variant="soft" sx={{ width: 343, p: 2, borderRadius: 'sm' }}>
                          <Typographys
                            level="h3"
                            id="ios-example-demo"
                            sx={{ fontSize: 'xl2', fontWeight: 'xl', mb: 1 }}
                          >
                            Account Settings
                          </Typographys>
                          <List
                            aria-labelledby="ios-example-demo"
                            sx={(theme) => ({
                              '& ul': {
                                '--List-gap': '0px',
                                bgcolor: 'background.surface',
                                '& > li:first-child > [role="button"]': {
                                  borderTopRightRadius: 'var(--List-radius)',
                                  borderTopLeftRadius: 'var(--List-radius)',
                                },
                                '& > li:last-child > [role="button"]': {
                                  borderBottomRightRadius: 'var(--List-radius)',
                                  borderBottomLeftRadius: 'var(--List-radius)',
                                },
                              },
                              '--List-radius': '8px',
                              '--List-gap': '1rem',
                              '--ListDivider-gap': '0px',
                              '--ListItem-paddingY': '0.5rem',
                              // override global variant tokens
                              '--joy-palette-neutral-plainHoverBg': 'rgba(0 0 0 / 0.08)',
                              '--joy-palette-neutral-plainActiveBg': 'rgba(0 0 0 / 0.12)',
                              [theme.getColorSchemeSelector('light')]: {
                                '--joy-palette-divider': 'rgba(0 0 0 / 0.08)',
                              },
                              [theme.getColorSchemeSelector('dark')]: {
                                '--joy-palette-neutral-plainHoverBg': 'rgba(255 255 255 / 0.1)',
                                '--joy-palette-neutral-plainActiveBg': 'rgba(255 255 255 / 0.16)',
                              },
                            })}
                          >
                            <ListItem nested>
                              <List
                                aria-label="Personal info"
                                sx={{ '--ListItemDecorator-size': '72px' }}
                              >
                                <ListItem>
                                  <ListItemDecorator>
                                    <Avatar sizes='lg' src={user?.avatarUrl} />
                                    {/* <Avatar size="lg" sx={{ '--Avatar-size': '60px' }}>
                                      MB
                                    </Avatar> */}
                                  </ListItemDecorator>
                                  <div>
                                    <Typography sx={{ fontSize: 'xl' }}>{user?.name}</Typography>
                                    <Typography sx={{ fontSize: 'xs' }}>
                                      Joined On :
                                      {
                                        fromatDate(user?.joinedDate ?? "")
                                      }
                                    </Typography>
                                  </div>
                                </ListItem>
                                <ListDivider inset="startContent" />
                                <ListItem>
                                  <ListItemButton>
                                    <ListItemContent>{user?.bio}</ListItemContent>
                                    {/* <KeyboardArrowRight fontSize="xl3" /> */}
                                  </ListItemButton>
                                </ListItem>
                              </List>
                            </ListItem>
                            <ListItem nested>
                              <Typographys id="apple-tv-description" level="body-xs" aria-hidden>
                                Manage your account settings here
                              </Typographys>
                            </ListItem>
                            <ListItem nested>
                              <List
                                aria-label="Network"
                              >
                                <ListItem>
                                  <ListItemDecorator>
                                    <Sheet variant="solid" color="warning">
                                      <RiGitRepositoryPrivateFill size={25} />
                                    </Sheet>
                                  </ListItemDecorator>
                                  <ListItemContent htmlFor="airplane-mode" component="label">
                                    {  isPrivate ?  'Private Account'  :  'Public Account'  }
                                  </ListItemContent>

                                  <Switch
                                    id="airplane-mode"
                                    size="lg"
                                    color="success"
                                    checked={isPrivate}
                                    onChange={handleToggle}
                                    sx={() => ({
                                      '--Switch-thumbShadow': '0 3px 7px 0 rgba(0 0 0 / 0.12)',
                                      '--Switch-thumbSize': '27px',
                                      '--Switch-trackWidth': '51px',
                                      '--Switch-trackHeight': '31px',
                                      '--Switch-trackBackground': 'red',

                                      [`& .${switchClasses.thumb}`]: {
                                        transition: 'width 0.2s, left 0.2s',
                                      },
                                      '&:hover': {
                                        '--Switch-trackBackground': 'red',
                                      },
                                      '&:active': {
                                        '--Switch-thumbWidth': '32px',
                                      },
                                      [`&.${switchClasses.checked}`]: {
                                        '--Switch-trackBackground': 'rgb(48 209 88)',
                                        '&:hover': {
                                          '--Switch-trackBackground': 'rgb(48 209 88)',
                                        },
                                      },
                                    })}
                                  />

                                </ListItem>
                                <ListDivider inset="startContent" />
                                <ListItem onClick={handleModalOpen}>
                                  <ListItemButton>
                                    <ListItemDecorator>
                                      <Sheet variant="solid" color="primary">
                                        {/* <Wifi /> */}
                                        <FaUserEdit size={25} />

                                      </Sheet>

                                    </ListItemDecorator>
                                    <ListItemContent>Update Profile</ListItemContent>
                                  </ListItemButton>
                                </ListItem>

                                <ListItem>
                                  <ListItemButton>
                                    <ListItemDecorator>
                                      <Sheet variant="solid" color="primary">
                                        {/* <Wifi /> */}
                                        <MdOutlineDeleteForever size={25} />

                                      </Sheet>

                                    </ListItemDecorator>
                                    <ListItemContent sx={{ color: 'red' }}>Delete Account</ListItemContent>
                                  </ListItemButton>
                                </ListItem>
                                <ListDivider inset="startContent" />

                              </List>
                            </ListItem>
                          </List>
                        </Sheet>

                      </Modal>
                    </React.Fragment>
                  </>
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
            <strong>Joined:</strong> {new Date(user?.joinedDate ?? '').toLocaleDateString()}
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
              {
                user?.isPrivate && user.id != currentUserId
                  ? (
                    user?.following.includes(currentUserId || '')
                      ? posts.map((post, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                          <Card>
                            {Array.isArray(post.imageUrl) ? (
                              <Carousel>
                                {post.imageUrl.map((url, idx) => (
                                  <CardMedia
                                    key={idx}
                                    component="img"
                                    height="200"
                                    image={url}
                                    alt={`post-image-${idx}`}
                                  />
                                ))}
                              </Carousel>
                            ) : (
                              <CardMedia
                                component="img"
                                height="200"
                                image={post.imageUrl}
                                alt="post-image"
                              />
                            )}
                            <CardContent>
                              <Typography variant="body2">{post.description}</Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))
                      : (
                        <Grid item xs={12}>
                          <Typography variant="body1" align="center">This account is private</Typography>
                        </Grid>
                      )
                  )
                  : ( 
                    posts.map((post, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card>
                          {Array.isArray(post.imageUrl) ? (
                            <Carousel>
                              {post.imageUrl.map((url, idx) => (
                                <CardMedia
                                  key={idx}
                                  component="img"
                                  height="200"
                                  image={url}
                                  alt={`post-image-${idx}`}
                                  onClick={() => navigate('/viewPost', { state: { postId: post?._id, userId: currentUserId } })}
                                />
                              ))}
                            </Carousel>
                          ) : (
                            <CardMedia
                              component="img"
                              height="200"
                              image={post.imageUrl}
                              alt="post-image"
                              onClick={() => navigate('/viewPost', { state: { postId: post._id, userId: currentUserId } })}
                            />
                          )}
                          <CardContent>
                            <Typography variant="body2">{post.description}</Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))
                  )
              }
            </Grid>

          ) : (
            <Grid container spacing={2}>
              {savedPosts.map((post, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card>
                    {Array.isArray(post.imageUrl) ? (
                      <Carousel>
                        {post.imageUrl.map((url, idx) => (
                          <CardMedia key={idx} component="img" height="200" image={url} alt={`saved-post-image-${idx}`}
                            onClick={() => navigate('/viewPost', { state: { postId: post._id, userId: post.userId } })}
                          />
                        ))}
                      </Carousel>
                    ) : (
                      <CardMedia component="img" height="200" image={post.imageUrl} alt="saved-post-image"
                        onClick={() => navigate('/viewPost', { state: { postId: post._id, userId: post.userId } })}
                      />
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
      { openFriends && ( <ShowFriends onClose={() => setOpenFriends(false)} />  )}
    </Box>
  );
};

export default UserProfile;
