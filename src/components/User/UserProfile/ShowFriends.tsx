import { useEffect, useState } from 'react';
import { Tabs, Tab, TabList, TabPanel, tabClasses } from '@mui/joy'; // MUI Joy Tabs
import { Box, Typography } from '@mui/material'; // MUI Material for layout
import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Chip from '@mui/joy/Chip';
import { IoCloseSharp } from "react-icons/io5";
import { toast } from 'sonner';
import axiosInstance from '../../../constraints/axios/userAxios';
import { userEndpoints } from '../../../constraints/endpoints/userEndpoints';
import LinearProgress from '@mui/joy/LinearProgress';
import { useNavigate } from 'react-router-dom';

interface UserListProps {
    users: { _id: string; name: string; profilePicture: string }[];
    id: string;
}

interface friends {
    _id: string,
    name: string,
    email: string,
    profilePicture: string
}

let followers: friends[] = [];
let following: friends[] = [];

const UserList: React.FC<UserListProps> = ({ users, id }) => {

    const navigate = useNavigate()
    const handelClick = () => {
        navigate(`/userProfile`, { state: { userId: id } });
    }

    return (
        <>
            {
                users.length === 0 ?
                    'no users'
                    :
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 3,
                            mt: 2,
                            pl: { xs: '5%', sm: '10%', md: '15%' },
                            pr: { xs: '5%', sm: '10%', md: '15%' },
                        }}
                    >

                        {users.map(user => (
                            <Card
                                key={user._id}
                                variant="outlined"
                                orientation="horizontal"
                                sx={{
                                    width: { xs: '100%', sm: '80%', md: 320 },
                                    '&:hover': { boxShadow: 'md', borderColor: 'neutral.outlinedHoverBorder' },
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                <AspectRatio ratio="1" sx={{ width: 60, borderRadius: '50%' }}>
                                    <img
                                        src={user.profilePicture}
                                        alt={user.name}
                                        loading="lazy"
                                    />
                                </AspectRatio>
                                <CardContent sx={{ ml: 3 }}>
                                    <Typography onClick={() => handelClick()}>{user.name}</Typography>
                                    <Chip
                                        variant="outlined"
                                        color="primary"
                                        size="sm"
                                        sx={{ pointerEvents: 'none', mt: 1, cursor: 'pointer' }}
                                        onClick={() => handelClick()} 
                                    >
                                        View Profile
                                    </Chip>
                                </CardContent>

                            </Card>
                        ))}
                    </Box>
            }
        </>
    );
};

interface ShowFriendsProps {
    onClose(): void;
    id: string;
}

const ShowFriends: React.FC<ShowFriendsProps> = ({ onClose, id }) => {
    const [tabValue, setTabValue] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [loading, setLoading] = useState(false)


    useEffect(() => {
        getFriends();
    }, []);

    const getFriends = async () => {
        try {
            setLoading(true);
            const result = await axiosInstance.get(`${userEndpoints.getFriends}?userId=${id}`);
            console.log(result.data.success);
            console.log(result.data.data);
            if (result.data.data) {
                followers = result.data.data.followers;
                following = result.data.data.following
                setTimeout(() => {
                    setLoading(false)
                }, 2500)
            } else {
                toast.info('No users found')
                setTimeout(() => {
                    setLoading(false)
                }, 2500)
            }
        } catch (error) {
            toast.error('Unable to find the frinds')
            console.log('error');
        }
    }

    const handleChange = (event: any, newValue: any) => {
        setTabValue(newValue);
        console.log(event);
    }

    return (

        <>
            <Tabs
                aria-label="tabs"
                value={tabValue}
                onChange={(event, newValue) => handleChange(event, newValue)}
                sx={{
                    bgcolor: 'transparent',
                    zIndex: 1300,
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: 'background.level1',
                    height: { xs: '85%', sm: '80%', md: '70%' },
                    width: { xs: '90%', sm: '60%', md: '40%', lg: '30%' },
                    borderRadius: '16px',
                    boxShadow: 'lg',
                    overflow: 'auto',
                    '&::-webkit-scrollbar': { display: 'none' },
                    scrollbarWidth: 'none',

                }}
            >
                <TabList
                    disableUnderline
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        p: 0.5,
                        gap: 2,
                        borderRadius: 'xl',
                        bgcolor: '#4262a2',
                        [`& .${tabClasses.root}[aria-selected="true"]`]: {
                            boxShadow: 'sm',
                            bgcolor: 'background.surface',
                        },
                        [`& .${tabClasses.root}`]: {
                            fontWeight: 600,
                            fontSize: '1rem',
                            textTransform: 'none',
                            color: 'text.primary',
                        },
                    }}
                >
                    <Tab disableIndicator>Followers</Tab>
                    <Tab disableIndicator>Following</Tab>
                    <IoCloseSharp
                        onClick={onClose}
                        size={20}
                        style={{
                            cursor: 'pointer',
                            marginLeft: 'auto',
                            marginRight: 7,
                            color: isHovered ? 'red' : 'black',
                        }}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    />
                </TabList>

                {
                    loading ?
                        <LinearProgress />
                        :
                        <>
                            {/* Tab Panels */}
                            < TabPanel value={0}>
                                <UserList users={followers} id={id} />
                            </TabPanel>
                            <TabPanel value={1}>
                                <UserList users={following} id={id} />
                            </TabPanel>
                        </>
                }
            </Tabs >

        </>


    );
};

export default ShowFriends;
