import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Tooltip,
  Button,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Badge,
  Chip,
} from '@mui/material';
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
import ModalClose from '@mui/joy/ModalClose';
import AspectRatio from '@mui/joy/AspectRatio';
import SocketService from '../../../../socket/SocketService';
import axiosInstance from '../../../../constraints/axios/userAxios';
import { messageEndpoints } from '../../../../constraints/endpoints/messageEndpoints';

const pages = [
  { name: 'Home', icon: <HomeIcon />, path: '/' },
  { name: 'Search', icon: <SearchIcon />, path: '/search' },
  { name: 'Chats', icon: <ChatIcon />, path: { pathname: '/chats', state: { userId: null } } },
  { name: 'Add Post', icon: <AddBoxIcon />, path: '/add-post' },
  { name: 'Find buddy', icon: <PeopleIcon />, path: '/find-buddy' },
];


export default function Navbar() {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0); // Track unread notifications

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const avatar = useSelector((state: RootState) => state.userAuth.userData?.avatar);
  const userId = useSelector((state: RootState) => state.userAuth.userData?._id)

  useEffect(() => {

    // socker connection when the user loges in
    SocketService.connect();
    SocketService.emitUserOnline(userId || '')
    // end of socket connections

    // Listen for new notifications via socket
    SocketService.onNewNotification((notification) => {
      console.log(notification);
      setNotifications((prevNotifications) => [...prevNotifications, notification]);
      setUnreadNotifications((prevCount) => prevCount + 1);
    });
  }, []);

  useEffect(() => {
    async function fetchNotification() {
      try {
        const result = await axiosInstance.get(`${messageEndpoints.getNotification}?id=${userId}`)
        console.log(result)
        if(result.data.success && result.data?.data){
          setNotifications(result.data.data);
        }else{

        }
        
      } catch (error) {

      }
    }
    fetchNotification()

  }, []);

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
    localStorage.removeItem('userToken');
    localStorage.removeItem('refreshToken');
    dispatch(logout());
    navigate('/');
  };

  const NotificationDrawer = ({ open, onClose }: any) => (
    <Drawer open={open} onClose={onClose}>
      <Box sx={{ width: 400, padding: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
            <h3>Notifications</h3>
          </Typography>
          <ModalClose onClick={onClose} />
        </Box>
        <List>
          {
            notifications.length === 0
              ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <Typography variant="h6" color="textSecondary" sx={{ textAlign: 'center', mt: 4 }}>
                    No notifications
                  </Typography>
                </Box>
              )
              : notifications.map((notification) => (
                <ListItem key={notification.userId} sx={{ padding: 1 }}>
                  <ListItemIcon>
                    <AspectRatio ratio="1" sx={{ width: 50 }}>
                      {
                        notification.avatar ? (
                          <img
                            src={notification.avatar}
                            alt={notification.userName}
                            style={{ borderRadius: '50%', width: '40px', height: '40px' }} 
                          />
                        ) : (
                          <Avatar>{'U'}</Avatar> 
                        )
                      }
                    </AspectRatio>
                  </ListItemIcon>
                  <ListItemText primary={notification.message}
                  
                  />
                  <Chip label={'View Profile'} variant="outlined" color="primary" />
                  <hr />
                </ListItem>
              ))
          }
        </List>

      </Box>
    </Drawer>
  );

  const handleNotificationsClick = () => {
    setOpen(true);
    setUnreadNotifications(0); // Reset unread count when opening the drawer
  };

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
            <IconButton size="large" onClick={handleOpenNavMenu} color="inherit">
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorElNav}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {pages.map((page) => (
                <MenuItem key={page.name} onClick={() => { handleCloseNavMenu(); navigate(page.path); }}>
                  <IconButton color="inherit">{page.icon}</IconButton>
                  <Typography textAlign="center">{page.name}</Typography>
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
            <Tooltip title="Notifications">
              <IconButton onClick={handleNotificationsClick} color="inherit">
                <Badge badgeContent={unreadNotifications} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            <NotificationDrawer open={open} onClose={() => setOpen(false)} />
            <Tooltip title="Profile">
              <IconButton sx={{ p: 0 }}>
                <Avatar
                  alt="Profile"
                  src={avatar ?? ''}
                  onClick={() => { navigate('/userProfile', { state: { userId: userId } }); }}
                />
              </IconButton>
            </Tooltip>
            <Tooltip title="More options">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, ml: 2 }}>
                <MoreVertIcon />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorElUser}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem onClick={() => { navigate('/userProfile', { state: { userId: userId } }); }}>Profile</MenuItem>
              <MenuItem onClick={() => { navigate('/settings'); }}>Settings</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
}
