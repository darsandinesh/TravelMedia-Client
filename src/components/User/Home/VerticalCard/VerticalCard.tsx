import Avatar from '@mui/joy/Avatar';
import Chip from '@mui/joy/Chip';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import ButtonGroup from '@mui/joy/ButtonGroup';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import CardActions from '@mui/joy/CardActions';
import IconButton from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import { Email } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store/sotre';
import { useNavigate } from 'react-router-dom';

const VerticalCard = () => {

    const userData = useSelector((state: RootState) => state.userAuth.userData);
    const navigate = useNavigate();

    const handelClick = () => {
        navigate(`/userProfile`, { state: { userId: userData?._id } });
    }

    return (
        <Card
            sx={{
                width: 320,
                maxWidth: '100%',
                boxShadow: 'lg',
                bgcolor: '#2d3748',
                color: 'white',
                position: 'fixed',
                right: 60,
                top: '100px',
                display: { xs: 'none', md: 'block' },
                overflowY: 'auto',
            }}
        >
            <CardContent sx={{ alignItems: 'center', textAlign: 'center', color: 'white' }}>
                <Avatar src={userData?.avatar || "/static/images/avatar/1.jpg"} sx={{ '--Avatar-size': '4rem' }} />
                {
                    userData?.prime ? (
                        <Chip
                            size="sm"
                            variant="soft"
                            sx={{
                                mt: -1,
                                mb: 1,
                                border: '3px solid',
                                borderColor: '#fdfe6e',
                                backgroundColor: '#fdfe6e',
                                color: '#000',
                            }}
                        >
                            PRO
                        </Chip>
                    ) : null
                }


                <Typography level="title-lg" sx={{ color: 'white' }}>{userData?.name}</Typography>
                <Typography level="body-sm" sx={{ maxWidth: '24ch', color: 'grey' }}>
                   {userData?.bio}
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        gap: 2,
                        mt: 2,
                    }}
                >
                    <IconButton size="sm" variant="plain" sx={{ color: 'white', gap: 2 }}>
                        <Email /> {userData?.email}
                    </IconButton>
                </Box>
            </CardContent>
            <CardOverflow sx={{ bgcolor: '#2d3748' }}>
                <CardActions buttonFlex="1" >
                    <ButtonGroup variant="outlined" sx={{ bgcolor: 'background.surface' }} >
                        <Button onClick={handelClick}>View Profile</Button>
                    </ButtonGroup>
                </CardActions>
            </CardOverflow>
        </Card>
    );
};

export default VerticalCard;
