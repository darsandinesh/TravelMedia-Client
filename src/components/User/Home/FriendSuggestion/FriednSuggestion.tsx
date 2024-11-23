import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store/sotre';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import axiosInstance from '../../../../constraints/axios/userAxios';
import { userEndpoints } from '../../../../constraints/endpoints/userEndpoints';
import { toast } from 'sonner';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const FriednSuggestion = () => {

    const [users, setUsers] = useState<any[]>([]);
    const navigate = useNavigate();
    const useData = useSelector((state: RootState) => state.userAuth.userData);

    useEffect(() => {
        async function newUsers() {
            try {
                const result = await axiosInstance.get(userEndpoints.newUsers);
                if (result.data.success) {
                    setUsers(result.data.data);
                } else {
                    toast.info('Unable to find new users');
                }
            } catch (error) {
                console.error(error);
            }
        }

        newUsers();
    }, []);

    const handelClick = (userId: string) => {
        navigate(`/userProfile`, { state: { userId: userId } });
    }

    return (
        <div style={{
            backgroundColor: '#2d3748',
            height: '450px',
            width: '280px',
            margin: 10,
            borderRadius: '20px',
            padding: '15px',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
            marginTop: '-90%',
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                paddingBottom: '10px',
                borderBottom: '1px solid #4A5568'
            }}>
                <Avatar
                    alt={useData?.name || 'U'}
                    src={useData?.avatar ?? ""}
                    sx={{ width: 56, height: 56, marginRight: '10px' }}
                />
                <p style={{ color: 'white', fontSize: '18px' }}>{useData?.name}</p>
            </div>

            <h6 style={{ color: 'white', textAlign: 'center', marginTop: '15px' }}>New to TravelMedia</h6>

            <List sx={{
                width: '100%', maxWidth: '100%', overflowY: 'auto', marginTop: '10px', height: '63%', '&::-webkit-scrollbar': {
                    display: 'none',  
                },
            }}>
                {users.map((val, index) => (
                    <ListItem key={index} sx={{ gap: 2 }}>
                        <ListItemAvatar>
                            <Avatar>
                                {val.profilePicture != ''
                                    ? <img src={val.profilePicture} alt={val.name} />
                                    : <ImageIcon />}
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            onClick={() => handelClick(val._id)}
                            sx={{ color: 'white', cursor: 'pointer' }}
                            primary={val.name}
                            secondary={`${moment(val.created_at).fromNow()} ago`}
                            tabIndex={val._id}
                        />
                    </ListItem>
                ))}
            </List>

            <div style={{ textAlign: 'center', marginTop: 'auto', paddingTop: '0px' }}>
                <hr />
                <p style={{ color: '#A0AEC0', fontSize: '12px', cursor: 'pointer' }}>@All rights reserved</p>
            </div>
        </div>
    );
};

export default FriednSuggestion;
