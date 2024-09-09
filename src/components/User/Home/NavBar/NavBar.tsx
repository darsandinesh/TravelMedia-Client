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

const pages = [
  { name: 'Home', icon: <HomeIcon />, path: '/' },
  { name: 'Search', icon: <SearchIcon />, path: '/search' },
  { name: 'Chats', icon: <ChatIcon />, path: '/chats' },
  { name: 'Add Post', icon: <AddBoxIcon />, path: '/add-post' },
  { name: 'Find buddy', icon: <PeopleIcon />, path: '/find-buddy' },
  { name: 'Notifications', icon: <NotificationsIcon />, path: '/notifications' },
];

export default function Navbar() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const userAuth = useSelector((state: RootState) => state);
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
    dispatch(logout()); // Dispatch the logout action
    navigate('/'); // Redirect to home page after logout
  };

  return (
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
        </Box>
        <Box sx={{ flexGrow: 0 }}>
          <Tooltip title="Profile">
            <IconButton sx={{ p: 0 }}>
              <Avatar alt="Profile" src="" />
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
            <MenuItem onClick={() => { handleCloseUserMenu(); navigate('/userProfile'); }}>Profile</MenuItem>
            <MenuItem onClick={() => { handleCloseUserMenu(); navigate('/settings'); }}>Settings</MenuItem>
            <MenuItem onClick={() => { handleCloseUserMenu(); handleLogout(); }}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
