import { useEffect, useState } from 'react';
import { Tabs, Tab, TabList, TabPanel, tabClasses } from '@mui/joy'; // MUI Joy Tabs
import { Box, Typography } from '@mui/material'; // MUI Material for layout
import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Chip from '@mui/joy/Chip';
import { IoCloseSharp } from "react-icons/io5";
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/sotre';
import { toast } from 'sonner';
import axiosInstance from '../../../constraints/axios/userAxios';
import { userEndpoints } from '../../../constraints/endpoints/userEndpoints';
import LinearProgress from '@mui/joy/LinearProgress';

interface friends {
    _id: string,
    name: string,
    email: string,
    profilePicture: string
}

let followers: friends[] = [

];

let following: friends[] = [

];


// Component for rendering the list of users
const UserList = ({ users }: { users: { _id: string; name: string; profilePicture: string }[] }) => {
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
                                    width: { xs: '100%', sm: '80%', md: 320 }, // Responsive width for card
                                    '&:hover': { boxShadow: 'md', borderColor: 'neutral.outlinedHoverBorder' },
                                    transition: 'all 0.3s ease', // Smooth transition for hover effects
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
                                    <Typography>{user.name}</Typography>
                                    <Chip
                                        variant="outlined"
                                        color="primary"
                                        size="sm"
                                        sx={{ pointerEvents: 'none', mt: 1 }}
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
}

const ShowFriends = ({ onClose }: ShowFriendsProps) => {
    const [tabValue, setTabValue] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [loading, setLoading] = useState(false)

    const userId = useSelector((state: RootState) => state.userAuth.userData?._id);

    useEffect(() => {
        getFriends();
    }, []);

    const getFriends = async () => {
        try {
            setLoading(true);
            const result = await axiosInstance.get(`${userEndpoints.getFriends}?userId=${userId}`);
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

    return (

        <>

            <Tabs
                aria-label="tabs"
                value={tabValue}
                onChange={(event, newValue) => setTabValue(newValue)} // Corrected the onChange
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
                        // bgcolor: 'background.level1',
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
                        onClick={onClose} // Pass onClose correctly
                        size={20}
                        style={{
                            cursor: 'pointer',
                            marginLeft: 'auto',
                            marginRight: 7,
                            color: isHovered ? 'red' : 'black',
                        }}
                        onMouseEnter={() => setIsHovered(true)} // Set hover state to true
                        onMouseLeave={() => setIsHovered(false)} // Reset hover state
                    />
                </TabList>

                {
                    loading ?
                        <LinearProgress />
                        :
                        <>
                            {/* Tab Panels */}
                            < TabPanel value={0}>
                                <UserList users={followers} />
                            </TabPanel>
                            <TabPanel value={1}>
                                <UserList users={following} />
                            </TabPanel>
                        </>
                }
            </Tabs >

        </>


    );
};

export default ShowFriends;