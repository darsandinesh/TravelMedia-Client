import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import ChatIcon from '@mui/icons-material/Chat';
import AddBoxIcon from '@mui/icons-material/AddBox';
import PeopleIcon from '@mui/icons-material/People';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../../redux/store/sotre';
import { logout } from '../../../../redux/slice/UserSlice';

// notification drawer
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import ModalClose from '@mui/joy/ModalClose';
import AspectRatio from '@mui/joy/AspectRatio';
import Link from '@mui/joy/Link';

const pages = [
  { name: 'Home', icon: <HomeIcon />, path: '/' },
  { name: 'Search', icon: <SearchIcon />, path: '/search' },
  { name: 'Chats', icon: <ChatIcon />, path: { pathname: '/chats', state: { userId: null } } },
  { name: 'Add Post', icon: <AddBoxIcon />, path: '/add-post' },
  { name: 'Find buddy', icon: <PeopleIcon />, path: '/find-buddy' },
  // { name: 'Notifications', icon: <NotificationsIcon />, path: '/notifications' },
];

export default function Navbar() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const [open, setOpen] = React.useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const avatar = useSelector((state: RootState) => state.userAuth.userData?.avatar);
  // const userId = userAuth.UserAuth.userData._id;

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    console.log('Logout function is called');
    localStorage.removeItem('userToken');
    localStorage.removeItem('refreshToken');
    dispatch(logout()); // Dispatch the logout action
    navigate('/'); // Redirect to home page after logout
  };

  const notifications = [
    {
      id: 1,
      title: 'New Post',
      description: 'Check out the latest post on TravelMedia!',
      imgSrc: 'https://images.unsplash.com/photo-1507833423370-a126b89d394b?auto=format&fit=crop&w=90',
      location: 'Yosemite Park, California',
    },
    {
      id: 2,
      title: 'Friend Request',
      description: 'You have a new friend request from Jane Doe.',
      imgSrc: 'https://images.unsplash.com/photo-1507833423370-a126b89d394b?auto=format&fit=crop&w=90',
      location: 'San Francisco, California',
    },
    {
      id: 2,
      title: 'Friend Request',
      description: 'You have a new friend request from Jane Doe.',
      imgSrc: 'https://images.unsplash.com/photo-1507833423370-a126b89d394b?auto=format&fit=crop&w=90',
      location: 'San Francisco, California',
    },
    {
      id: 2,
      title: 'Friend Request',
      description: 'You have a new friend request from Jane Doe.',
      imgSrc: 'https://images.unsplash.com/photo-1507833423370-a126b89d394b?auto=format&fit=crop&w=90',
      location: 'San Francisco, California',
    },
    {
      id: 2,
      title: 'Friend Request',
      description: 'You have a new friend request from Jane Doe.',
      imgSrc: 'https://images.unsplash.com/photo-1507833423370-a126b89d394b?auto=format&fit=crop&w=90',
      location: 'San Francisco, California',
    },
    {
      id: 2,
      title: 'Friend Request',
      description: 'You have a new friend request from Jane Doe.',
      imgSrc: 'https://images.unsplash.com/photo-1507833423370-a126b89d394b?auto=format&fit=crop&w=90',
      location: 'San Francisco, California',
    },
    {
      id: 2,
      title: 'Friend Request',
      description: 'You have a new friend request from Jane Doe.',
      imgSrc: 'https://images.unsplash.com/photo-1507833423370-a126b89d394b?auto=format&fit=crop&w=90',
      location: 'San Francisco, California',
    },
    {
      id: 2,
      title: 'Friend Request',
      description: 'You have a new friend request from Jane Doe.',
      imgSrc: 'https://images.unsplash.com/photo-1507833423370-a126b89d394b?auto=format&fit=crop&w=90',
      location: 'San Francisco, California',
    },
    {
      id: 2,
      title: 'Friend Request',
      description: 'You have a new friend request from Jane Doe.',
      imgSrc: 'https://images.unsplash.com/photo-1507833423370-a126b89d394b?auto=format&fit=crop&w=90',
      location: 'San Francisco, California',
    },
    {
      id: 2,
      title: 'Friend Request',
      description: 'You have a new friend request from Jane Doe.',
      imgSrc: 'https://images.unsplash.com/photo-1507833423370-a126b89d394b?auto=format&fit=crop&w=90',
      location: 'San Francisco, California',
    },
    {
      id: 2,
      title: 'Friend Request',
      description: 'You have a new friend request from Jane Doe.',
      imgSrc: 'https://images.unsplash.com/photo-1507833423370-a126b89d394b?auto=format&fit=crop&w=90',
      location: 'San Francisco, California',
    },
    {
      id: 2,
      title: 'Friend Request',
      description: 'You have a new friend request from Jane Doe.',
      imgSrc: 'https://images.unsplash.com/photo-1507833423370-a126b89d394b?auto=format&fit=crop&w=90',
      location: 'San Francisco, California',
    },
    {
      id: 2,
      title: 'Friend Request',
      description: 'You have a new friend request from Jane Doe.',
      imgSrc: 'https://images.unsplash.com/photo-1507833423370-a126b89d394b?auto=format&fit=crop&w=90',
      location: 'San Francisco, California',
    },
    {
      id: 2,
      title: 'Friend Request',
      description: 'You have a new friend request from Jane Doe.',
      imgSrc: 'https://images.unsplash.com/photo-1507833423370-a126b89d394b?auto=format&fit=crop&w=90',
      location: 'San Francisco, California',
    },
    {
      id: 2,
      title: 'Friend Request',
      description: 'You have a new friend request from Jane Doe.',
      imgSrc: 'https://images.unsplash.com/photo-1507833423370-a126b89d394b?auto=format&fit=crop&w=90',
      location: 'San Francisco, California',
    },
    {
      id: 2,
      title: 'Friend Request',
      description: 'You have a new friend request from Jane Doe.',
      imgSrc: 'https://images.unsplash.com/photo-1507833423370-a126b89d394b?auto=format&fit=crop&w=90',
      location: 'San Francisco, California',
    },
    {
      id: 2,
      title: 'Friend Request',
      description: 'You have a new friend request from Jane Doe.',
      imgSrc: 'https://images.unsplash.com/photo-1507833423370-a126b89d394b?auto=format&fit=crop&w=90',
      location: 'San Francisco, California',
    },
  ];


  const NotificationDrawer = ({ open, onClose }: any) => (
    <Drawer open={open} onClose={onClose} >
      <Box sx={{ width: 400, padding: 2 }}>
        {/* <Typography variant="h6">Notifications</Typography> */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
            <h3>Notifications</h3>
          </Typography>
          <ModalClose onClick={onClose} />
        </Box>
        <List>
          {notifications.map((notification) => (
            <ListItem key={notification.id} sx={{ padding: 1 }}>
              <ListItemIcon>
                <AspectRatio ratio="1" sx={{ width: 50 }}>
                  <img
                    src={notification.imgSrc}
                    alt={notification.title}
                    style={{ borderRadius: '50%' }}
                  />
                </AspectRatio>
              </ListItemIcon>
              <ListItemText
                primary={notification.title}
                secondary={notification.description}
              />
              <Chip label={notification.location} variant="outlined" color="primary" />
              <hr />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );

  return (
    <>
      <AppBar position="fixed" sx={{ bgcolor: '#2d3748' }}>
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', md: 'block' } }}
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer' }}
          >
            TravelMedia
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {pages.map((page) => (
                <MenuItem key={page.name} onClick={() => { handleCloseNavMenu(); navigate(page.path); }}>
                  <IconButton color="inherit">
                    {page.icon}
                  </IconButton>
                  <Typography textAlign="center">
                    {page.name}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page.name}
                onClick={() => { handleCloseNavMenu(); navigate(page.path); }}
                sx={{ my: 2, color: 'white', display: 'flex', alignItems: 'center' }}
              >
                {page.icon}
                <Typography variant="body2" sx={{ ml: 1 }}>
                  {page.name}
                </Typography>
              </Button>
            ))}
            <>
              <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                <Button
                  onClick={() => setOpen(true)}
                  sx={{ my: 2, color: 'white', display: 'flex', alignItems: 'center' }}
                >
                  <NotificationsIcon />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    Notifications
                  </Typography>
                </Button>

                {/* Notification Drawer */}
                <NotificationDrawer open={open} onClose={() => setOpen(false)} />
              </Box>
            </>
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Profile">
              <IconButton sx={{ p: 0 }}>
                <Avatar alt="Profile" src={avatar}
                  onClick={() => { navigate('/userProfile', { state: { userId: '' } }); }}
                />
              </IconButton>
            </Tooltip>
            <Tooltip title="More options">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, ml: 2 }}>
                <MoreVertIcon />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem onClick={() => { handleCloseUserMenu(); navigate('/userProfile', { state: { userId: '' } }); }}>Profile</MenuItem>
              <MenuItem onClick={() => { handleCloseUserMenu(); navigate('/settings'); }}>Settings</MenuItem>
              <MenuItem onClick={() => { handleCloseUserMenu(); handleLogout(); }}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>



    </>
  );
}
