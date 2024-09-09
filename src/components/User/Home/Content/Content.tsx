import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import moment from 'moment';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { postEndpoints } from '../../../../constraints/endpoints/postEndpoints';

interface Post {
    id: number;
    user?: {
        id?: number; // Add this field to get the user ID
        name?: string;
    };
    title?: string;
    location?: string;
    imageUrl?: string[];
    description?: string;
    created_at?: string;
    likes: number; // Add this field to hold the likes count directly from the API
}

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

const Container = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '300px',
    minHeight: '800px',
    margin: '0',
    padding: theme.spacing(2),
    position: 'absolute',
    top: '10%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: 'calc(100% - 2rem)',
    maxWidth: '700px',
    [theme.breakpoints.down('sm')]: {
        minWidth: '300px',
    },
}));

const arr = [1, 2, 3, 4];

const SkeletonPlaceholder = () => (
    <Stack spacing={2} sx={{ width: '100%' }}>
        {arr.map(val => (
            <Stack spacing={2} sx={{ width: '100%' }} key={val}>
                <Skeleton variant="text" width="100%" height={60} />
                <Skeleton variant="circular" width={40} height={40} />
                <Skeleton variant="rectangular" width="100%" height={300} />
                <Skeleton variant="rounded" width="100%" height={60} />
            </Stack>
        ))}
    </Stack>
);

const Subheader = ({ date, location }: { date?: string; location?: string }) => {
    const now = moment();
    const postDate = date ? moment(date) : null;

    let displayDate;
    if (postDate) {
        if (postDate.isSame(now, 'day')) {
            displayDate = 'Just posted';
        } else if (postDate.isAfter(now.subtract(1, 'week'))) {
            displayDate = 'Last week';
        } else {
            displayDate = postDate.format('MMMM Do YYYY, h:mm:ss a'); // Customize format as needed
        }
    } else {
        displayDate = 'No Date';
    }

    return (
        <div>
            <Typography variant="body2">{displayDate}</Typography>
            {location && <Typography variant="body2">{location}</Typography>}
        </div>
    );
};

const CarouselContainer = styled('div')({
    position: 'relative',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
});

const CarouselTrack = styled('div')({
    display: 'flex',
    transition: 'transform 0.5s ease-in-out',
    width: '100%',
});

const CarouselImage = styled('img')({
    flexShrink: 0,
    width: '100%',
    height: '350px',
    objectFit: 'cover',
});

const ArrowButton = styled(IconButton)({
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    color: 'white',
});

const LeftArrow = styled(ArrowButton)({
    left: '10px',
});

const RightArrow = styled(ArrowButton)({
    right: '10px',
});

export default function Content() {
    const [expanded, setExpanded] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [postData, setPostData] = useState<Post[]>([]);
    const [currentImageIndex, setCurrentImageIndex] = useState<number[]>([]);
    const [likes, setLikes] = useState<{ [key: number]: boolean }>({});
    const navigate = useNavigate(); // Initialize navigate

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const handlePrev = (index: number) => {
        setCurrentImageIndex(prevIndexes => {
            const newIndexes = [...prevIndexes];
            newIndexes[index] = (newIndexes[index] === 0 ? (postData[index]?.imageUrl?.length ?? 1) - 1 : newIndexes[index] - 1);
            return newIndexes;
        });
    };

    const handleNext = (index: number) => {
        setCurrentImageIndex(prevIndexes => {
            const newIndexes = [...prevIndexes];
            newIndexes[index] = (newIndexes[index] === (postData[index]?.imageUrl?.length ?? 1) - 1 ? 0 : newIndexes[index] + 1);
            return newIndexes;
        });
    };

    const handleLikeClick = async (postId: number, index: number) => {
        try {
            const action = likes[index] ? 'unlike' : 'like';
            await axios.post(`YOUR_BACKEND_URL_HERE/posts/${postId}/${action}`); // Update with your backend URL
            setLikes(prevLikes => {
                const updatedLikes = { ...prevLikes, [index]: !prevLikes[index] };
                setPostData(prevPosts => {
                    const updatedPosts = [...prevPosts];
                    updatedPosts[index] = {
                        ...updatedPosts[index],
                        likes: updatedPosts[index].likes + (updatedLikes[index] ? 1 : -1),
                    };
                    return updatedPosts;
                });
                return updatedLikes;
            });
        } catch (error) {
            console.error('Error handling like/unlike:', error);
        }
    };

    const handleUserClick = (userId: number) => {
        navigate(`/userProfile/${userId}`);
    };

    useEffect(() => {
        const fetchData = async () => {
            console.log('Fetching data from backend to get all the posts');
            setLoading(true);
            try {
                const result = await axios.get(postEndpoints.getAllPosts); // Update with your backend URL
                const posts = result.data.data;
                console.log(posts[0].likes);
                setPostData(posts);
                setCurrentImageIndex(posts.map(() => 0)); // Initialize indices for all posts
                setLikes(posts.reduce((acc: { [key: number]: boolean }, post: any) => {
                    acc[post.id] = false; // Initially not liked
                    return acc;
                }, {}));

                setTimeout(() => {
                    setLoading(false);
                }, 2000);
            } catch (error) {
                console.error('Error fetching posts:', error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <Container>
            {loading ? (
                <SkeletonPlaceholder />
            ) : (
                postData.length > 0 ? (
                    postData.map((post, index) => (
                        <Card key={post.id} sx={{ width: '100%' }}>
                            <CardHeader
                                avatar={
                                    <Avatar
                                        sx={{ bgcolor: red[500], cursor: 'pointer' }}
                                        aria-label="recipe"
                                        onClick={() => post.user?.id && handleUserClick(post.user.id)} // Navigate on click
                                    >
                                        {post.user?.name?.charAt(0).toUpperCase()}
                                    </Avatar>
                                }
                                action={
                                    <IconButton aria-label="settings">
                                        <MoreVertIcon />
                                    </IconButton>
                                }
                                title={
                                    <Typography
                                        variant="body1"
                                        sx={{ cursor: 'pointer' }}
                                        onClick={() => post.user?.id && handleUserClick(post.user.id)} // Navigate on click
                                    >
                                        {post.user?.name}
                                    </Typography>
                                }
                                subheader={<Subheader date={post.created_at} location={post.location} />}
                            />
                            <CardMedia>
                                <CarouselContainer>
                                    <CarouselTrack style={{ transform: `translateX(-${currentImageIndex[index] * 100}%)` }}>
                                        {post.imageUrl?.map((image, imgIndex) => (
                                            <CarouselImage key={imgIndex} src={image} alt={`Image ${imgIndex + 1}`} />
                                        ))}
                                    </CarouselTrack>
                                    {post?.imageUrl?.length > 1 && (
                                        <>
                                            <LeftArrow onClick={() => handlePrev(index)}>
                                                <ChevronLeftIcon />
                                            </LeftArrow>
                                            <RightArrow onClick={() => handleNext(index)}>
                                                <ChevronRightIcon />
                                            </RightArrow>
                                        </>
                                    )}
                                </CarouselContainer>
                            </CardMedia>
                            <CardContent>
                                <Typography variant="body2" color="text.secondary">
                                    {post.description}
                                </Typography>
                            </CardContent>
                            <CardActions disableSpacing>
                                <IconButton
                                    aria-label="add to favorites"
                                    onClick={() => handleLikeClick(post.id, index)}
                                    sx={{ color: likes[index] ? red[500] : 'inherit' }}
                                >
                                    <FavoriteIcon />
                                </IconButton>
                                <Typography variant="body2" color="text.secondary">
                                    {post.likes} {post.likes === 1 ? 'like' : 'likes'}
                                </Typography>
                                {/* <IconButton aria-label="share">
                                    <ShareIcon />
                                </IconButton> */}
                                <ExpandMore
                                    expand={expanded}
                                    onClick={handleExpandClick}
                                    aria-expanded={expanded}
                                    aria-label="show more"
                                >
                                    <ExpandMoreIcon />
                                </ExpandMore>
                            </CardActions>
                            <Collapse in={expanded} timeout="auto" unmountOnExit>
                                <CardContent>
                                    <Typography paragraph>
                                    comments
                                    </Typography>
                                </CardContent>
                            </Collapse>
                        </Card>
                    ))
                ) : (
                    <Typography variant="h6">No posts available</Typography>
                )
            )}
        </Container>
    );
}
