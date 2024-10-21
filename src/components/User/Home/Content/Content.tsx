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
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useEffect, useState } from 'react';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import DeleteIcon from '@mui/icons-material/Delete';
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded';


import Dropdown from '@mui/joy/Dropdown';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import MoreVert from '@mui/icons-material/MoreVert';


import moment from 'moment';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { postEndpoints } from '../../../../constraints/endpoints/postEndpoints';

// joy ui
import Link from '@mui/joy/Link';
import Box from '@mui/joy/Box';
import CardContents from '@mui/joy/CardContent';
import IconButtons from '@mui/joy/IconButton';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import ModeCommentOutlined from '@mui/icons-material/ModeCommentOutlined';
import SendOutlined from '@mui/icons-material/SendOutlined';
import Face from '@mui/icons-material/Face';
import Input from '@mui/joy/Input';
import CircularProgress from '@mui/joy/CircularProgress';

// emoji picker
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import axiosInstance from '../../../../constraints/axios/userAxios';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store/sotre';
import { toast } from 'sonner';
import { userEndpoints } from '../../../../constraints/endpoints/userEndpoints';

interface Like {
    UserId?: string | null | undefined;
    createdAt?: string;
    _id?: string;
}


interface Reply {
    _id: string;
    UserId: string | null | undefined;
    content: string | null | undefined;
    createdAt: string;
    avatar: string | null | undefined;
    userName: string | null | undefined;
}

interface Comment {
    _id: string;
    UserId: string | null | undefined;
    content: string | null | undefined;
    createdAt: string;
    avatar: string | null | undefined;
    userName: string | null | undefined;
    replies: Reply[];
}

interface Post {
    id: number;
    _id: string;
    user?: {
        id?: number;
        name?: string;
        avatar?: string;
    };
    title?: string;
    location?: string;
    imageUrl?: string[];
    description?: string;
    created_at?: string;
    likes: Like[];
    comments: Comment[]
}

// Customizing the locale to show "a week ago" instead of exact days
moment.updateLocale('en', {
    relativeTime: {
        future: 'in %s',
        past: '%s ',
        s: 'just now',
        ss: '%d seconds',
        m: 'a minute',
        mm: '%d minutes',
        h: 'an hour',
        hh: '%d hours',
        d: 'a day',
        dd: (days) => {
            if (days === 1) {
                return 'yesterday';
            } else if (days < 7) {
                return 'This week';
            } else if (days < 14) {
                return 'a week';
            } else {
                return Math.floor(days / 7) + ' weeks';
            }
        },
        w: 'a week',
        ww: '%d weeks',
        M: 'a month',
        MM: '%d months',
        y: 'a year',
        yy: '%d years'
    }
});


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
    const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
    const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
    const [page, setPage] = useState<number>(1)
    const [loadinPage, setLoadingPage] = useState<boolean>(false)
    const [prevHeight, setPrevHeight] = useState<number>(0);
    const [visibleReplies, setVisibleReplies] = useState<{ [key: string]: boolean }>({});
    const [isCopied, setIsCopied] = useState(false);

    const navigate = useNavigate();


    const toggleRepliesVisibility = (commentId: string) => {
        setVisibleReplies(prev => ({
            ...prev,
            [commentId]: !prev[commentId], // Toggle visibility for this specific comment
        }));
    };

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const handleEmojiClick = (emojiData: EmojiClickData) => {
        setSelectedEmoji(selectedEmoji + emojiData.emoji); // Update state with selected emoji
        setShowEmojiPicker(false); // Close the emoji picker after selection
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
    useEffect(() => {
        const fetchData = async () => {
            console.log('Fetching data from backend to get all the posts');
            setLoadingPage(true);
            try {
                const result = await axiosInstance.get(`${postEndpoints.getAllPosts}?page=${page}`); // Update with your backend URL
                const posts = result.data.data;
                console.log(posts);
                setPostData(posts);
                setCurrentImageIndex(posts.map(() => 0));
                setTimeout(() => {
                    setLoadingPage(false);
                }, 2000);
            } catch (error) {
                console.error('Error fetching posts:', error);
                setLoading(false);
            }
        };
        fetchData();
    }, [page])

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 2000)
    }, []);

    const handleScroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.scrollHeight) {
            if (prevHeight < document.documentElement.scrollHeight) {
                setPrevHeight(document.documentElement.scrollHeight);
                setPage(prev => prev + 1);
            }
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [prevHeight]);


    const currentUserId = useSelector((state: RootState) => state.userAuth?.userData?._id);

    const handleLikeClick = async (index: number) => {
        try {
            const post = postData[index];
            const result = await axiosInstance.post('/post/likePost', {
                logged: currentUserId,
                postId: post._id
            });
            if (result.data.success) {
                // Update the post data with the new like status and count
                setPostData(prevPosts => prevPosts.map((p, i) =>
                    i === index ? {
                        ...p,
                        likes: [...p.likes, { UserId: currentUserId }]
                    } : p
                ));
                toast.success('Liked the post');
            } else {
                toast.info('Unable to like, Try after some time');
            }
        } catch (error) {
            console.error('Error handling like/unlike:', error);
        }
    };

    const handleUnLikeClick = async (index: number) => {
        try {
            const post = postData[index];
            const result = await axiosInstance.post('/post/UnlikePost', {
                logged: currentUserId,
                postId: post._id
            });
            if (result.data.success) {
                // Remove the like from the post data
                setPostData(prevPosts => prevPosts.map((p, i) =>
                    i === index ? {
                        ...p,
                        likes: p.likes.filter(like => like.UserId !== currentUserId)
                    } : p
                ));
                toast.success('Unliked the post');
            } else {
                toast.info('Unable to unlike, Try after some time');
            }
        } catch (error) {
            console.error('Error handling like/unlike:', error);
        }
    };


    const handleUserClick = (userId: number) => {
        navigate(`/userProfile`, { state: { userId: userId } });
    };



    const isUserLikedPost = (post: Post, userId: string | null | undefined): boolean => {
        return post.likes.some(like => like.UserId === userId);
    };

    const loggedUser = useSelector((state: RootState) => state.userAuth.userData)

    const handelComment = async (postId: string, parentCommentId?: any, text?: any) => {
        try {
            const payload = {
                postId,
                content: selectedEmoji, // This can be the emoji or any comment content
                userId: currentUserId,
                avatar: loggedUser?.avatar,
                userName: loggedUser?.name,
                parentCommentId: null,
                replayText: ''
            };

            if (parentCommentId) {
                // If replying to a comment, add parentCommentId
                payload.parentCommentId = parentCommentId;
                payload.replayText = text;
            }



            const result = await axiosInstance.post('/post/comment', payload);

            if (result.data.success) {
                setPostData((prevPosts) =>
                    prevPosts.map((p) =>
                        p._id === postId
                            ? {
                                ...p,
                                comments: p.comments.map((comment) => {
                                    if (comment._id === parentCommentId) {
                                        // If it's a reply, update the specific comment's replies array
                                        return {
                                            ...comment,
                                            replies: [
                                                ...comment.replies,
                                                {
                                                    _id: result.data.commentId,
                                                    UserId: currentUserId,
                                                    content: text,
                                                    createdAt: new Date().toISOString(),
                                                    avatar: loggedUser?.avatar,
                                                    userName: loggedUser?.name
                                                }
                                            ]
                                        };
                                    }
                                    return comment;
                                }),
                            }
                            : p
                    )
                );
                setSelectedEmoji(''); // Clear the input after posting
                toast.success('Reply added successfully');
            } else {
                toast.error('Failed to add comment/reply');
            }
        } catch (error) {
            toast.error('Something went wrong');
        }
    };





    const handleDeleteComment = async (commentId: string, postId: string, parentCommentId?: string) => {
        console.log(postId, '-----------', commentId, parentCommentId);
        try {
            const result = await axiosInstance.put('/post/deleteComment', {
                postId,
                commentId,
                parentCommentId, // Pass parentCommentId if it's a reply
                userId: loggedUser?._id
            });

            if (result.data.success) {
                // After successful deletion, update the state
                setPostData(prevPosts =>
                    prevPosts.map(post =>
                        post._id === postId
                            ? {
                                ...post,
                                comments: post.comments.map(comment => {
                                    if (parentCommentId && comment._id === parentCommentId) {
                                        // If deleting a reply, update the replies array of the parent comment
                                        return {
                                            ...comment,
                                            replies: comment.replies.filter(reply => reply._id !== commentId)
                                        };
                                    }
                                    return comment;
                                }).filter(comment => !parentCommentId && comment._id !== commentId) // Remove comment if no parentCommentId (top-level comment)
                            }
                            : post
                    )
                );
                toast.success(parentCommentId ? 'Reply deleted successfully' : 'Comment deleted successfully');
            } else {
                toast.info('Unable to delete the comment or reply');
            }
        } catch (error) {
            toast.error('Something went wrong');
        }
    };


    // replay comment filed
    const [replyTo, setReplyTo] = useState(null);
    const [replyText, setReplyText] = useState('');

    const handleReplyClick = (commentId: any) => {
        setReplyTo(commentId);
        setReplyText('');
    };

    const handlePostReply = (postId: any, commentId: any) => {
        handelComment(postId, commentId, replyText);
        setReplyText('');
        setReplyTo(null);
    };


    const copyToClipboard = () => {
        const currentUrl = window.location.href;
        navigator.clipboard.writeText(currentUrl)
            .then(() => {
                // setIsCopied(true); 
                // setTimeout(() => setIsCopied(false), 2000); 
                toast.success('URL copied to clipboard')
            })
            .catch(err => {
                console.error('Failed to copy the URL: ', err);
            });
    };

    const savePost = async (id: string) => {
        try {
            const result = await axiosInstance.post(userEndpoints.savePost,
                {
                    userId: currentUserId,
                    postId: id
                }
            );
            if(result.data.success){
                toast.success('Post saved successful');
            }else{
                toast.info('Unable to save the post')
            }
        } catch (error) {
            console.log('Failed to save the post -->', error);
        }
    }

    return (
        <Container>
            {loading ? (
                <SkeletonPlaceholder />
            ) : (
                postData.length > 0 ? (
                    postData.map((post: any, index) => (
                        <Card key={post.id} sx={{ width: '100%' }}>
                            <CardHeader
                                avatar={
                                    <Avatar
                                        sx={{ bgcolor: red[500], cursor: 'pointer' }}
                                        aria-label="recipe"
                                        src={post.user?.avatar}
                                        onClick={() => post.user?.id && handleUserClick(post.user.id)} // Navigate on click
                                    >
                                        {post.user?.name?.charAt(0).toUpperCase()}
                                    </Avatar>
                                }
                                action={
                                    <IconButton aria-label="settings">
                                        {/* <MoreVertIcon /> */}
                                        <Dropdown>
                                            <MenuButton
                                                slots={{ root: IconButton }}
                                                slotProps={{ root: { variant: 'outlined', color: 'neutral' } }}
                                            >
                                                <MoreVert />
                                            </MenuButton>
                                            <Menu
                                                sx={{
                                                    backgroundColor: '#f0f0f4',
                                                    color: 'black',
                                                    borderRadius: '8px',
                                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                                    width: '260px',
                                                    textAlign: 'center',
                                                    alignItems: 'center'
                                                }}
                                            >

                                                <MenuItem sx={{ color: '#555' }}
                                                    onClick={() => navigate(`/userProfile`, { state: { userId: post.user?.id } })}
                                                >View Profile</MenuItem>
                                                <hr style={{ margin: '0 10px', border: 'none', borderTop: '1px solid #ccc' }} />
                                                <MenuItem sx={{ color: '#555' }} onClick={() => savePost(post._id)}>Add to Saved Post</MenuItem>
                                                <hr style={{ margin: '0 10px', border: 'none', borderTop: '1px solid #ccc' }} />
                                                <MenuItem sx={{ color: '#555' }} onClick={() => navigate('/viewPost', { state: { postId: post._id, userId: post.user?.id } })} >View Post</MenuItem>
                                                {
                                                    <>
                                                        {
                                                            loggedUser?._id === post.user?.id
                                                            &&
                                                            <>
                                                                <hr style={{ margin: '0 10px', border: 'none', borderTop: '1px solid #ccc' }} />
                                                                <MenuItem sx={{ color: '#d32f2f' }} onClick={() => navigate('/editPost', { state: { data: post } })}>Edit Post</MenuItem>
                                                            </>
                                                        }

                                                    </>
                                                }
                                                <hr style={{ margin: '0 10px', border: 'none', borderTop: '1px solid #ccc' }} />
                                                <MenuItem sx={{ color: '#d32f2f' }}>Cancel</MenuItem>
                                                <hr style={{ margin: '0 10px', border: 'none', borderTop: '1px solid #ccc' }} />
                                                <MenuItem sx={{ color: '#d32f2f' }} onClick={() => navigate('/viewPost', { state: { postId: post._id, userId: post.user?.id } })} >Report</MenuItem>

                                            </Menu>
                                        </Dropdown>

                                    </IconButton>
                                }
                                title={
                                    <Typography
                                        variant="body1"
                                        sx={{ cursor: 'pointer' }}
                                        onClick={() => post.user?.id && handleUserClick(post.user.id)} // Navigate on click
                                    >
                                        {post.user?.name}
                                        <br />

                                        <Link
                                            component="button"
                                            underline="none"
                                            sx={{ fontSize: '10px', color: 'text.tertiary', my: 0.5, marginTop: -10 }}
                                        >
                                            {moment(post.created_at).fromNow()}
                                        </Link>
                                    </Typography>
                                }
                            // subheader={<Subheader date={post.created_at} location={post.location} />}
                            />
                            <CardMedia>
                                <CarouselContainer>
                                    <CarouselTrack style={{ transform: `translateX(-${currentImageIndex[index] * 100}%)` }}>
                                        {post.imageUrl?.map((image: any, imgIndex: any) => (
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
                            <CardContents key={index} orientation="horizontal" sx={{ alignItems: 'center', mx: -1, padding: '10px' }}>
                                <Box sx={{ width: 0, display: 'flex', gap: 3 }}>
                                    {
                                        isUserLikedPost(post, currentUserId) ? (
                                            <IconButtons style={{ color: 'red', marginLeft: '10px' }} variant="plain" color="neutral" size="sm" onClick={() => handleUnLikeClick(index)}>
                                                <FavoriteIcon style={{ color: 'red' }} />
                                            </IconButtons>
                                        ) : (
                                            <IconButtons style={{ marginLeft: '10px' }} variant="plain" color="neutral" size="sm" onClick={() => handleLikeClick(index)}>
                                                <FavoriteBorder />
                                            </IconButtons>
                                        )
                                    }
                                    <IconButtons variant="plain" color="neutral" size="sm">
                                        <ExpandMore
                                            expand={expanded}
                                            onClick={handleExpandClick}
                                            aria-expanded={expanded}
                                            aria-label="show more"
                                        >
                                            <ModeCommentOutlined />
                                        </ExpandMore>
                                    </IconButtons>
                                    <IconButtons variant="plain" color="neutral" size="sm">
                                        <SendOutlined onClick={copyToClipboard} />

                                        {isCopied && <p>URL copied to clipboard!</p>}
                                    </IconButtons>
                                    <IconButtons sx={{ marginLeft: "auto" }} variant="plain" color="neutral" size="sm" onClick={() => savePost(post._id)}>
                                        <BookmarkBorderRoundedIcon />
                                    </IconButtons>
                                </Box>

                            </CardContents>



                            <CardContent >
                                <Link
                                    component="button"
                                    underline="none"
                                    textColor="text.primary"
                                    sx={{ fontSize: 'sm', fontWeight: 'lg' }}
                                >
                                    {post.likes.length} {post.likes.length === 1 ? 'like' : 'likes'}
                                </Link>
                                <Typography sx={{ fontSize: 'sm' }}>
                                    {post.location.split(',')[0]}
                                </Typography>
                                <Typography sx={{ fontSize: 'sm' }}>
                                    {post.description}
                                </Typography>


                            </CardContent>

                            <CardActions disableSpacing sx={{ padding: 3, marginTop: -5 }}>

                            </CardActions>
                            <Collapse in={expanded} timeout="auto" unmountOnExit key={index + 1}>

                                <CardContent>
                                    {post.comments.length > 0 ? (
                                        <>
                                            {post.comments
                                                .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                                                .map((comment: any) => {
                                                    const isRepliesVisible = visibleReplies[comment._id] || false; // Check if replies are visible for this comment
                                                    return (
                                                        <Box key={comment._id} display="flex" flexDirection="column" alignItems="flex-start" mb={2}>
                                                            {/* Comment Avatar and Details */}
                                                            <Box display="flex" alignItems="flex-start">
                                                                <Avatar src={comment.avatar} alt={comment.userName} sx={{ marginRight: 2 }} />
                                                                <Box flex={1}>
                                                                    {/* Comment User and Date */}
                                                                    <Typography variant="body2" color="textSecondary">
                                                                        <strong>{comment.userName}</strong> • {moment(comment.createdAt).fromNow()}
                                                                    </Typography>
                                                                    {/* Comment Content */}
                                                                    <Typography variant="body1" paragraph>
                                                                        {comment.content}
                                                                    </Typography>

                                                                    {/* Reply Button and Reply Count */}
                                                                    <Box display="flex" alignItems="center">
                                                                        <Typography
                                                                            variant="body2"
                                                                            color="primary"
                                                                            sx={{ cursor: 'pointer', mt: 1, mr: 2 }}
                                                                            onClick={() => handleReplyClick(comment._id)}
                                                                        >
                                                                            Reply
                                                                        </Typography>

                                                                        {/* Reply Count */}
                                                                        {comment.replies.length > 0 && (
                                                                            <Typography
                                                                                variant="body2"
                                                                                color="textSecondary"
                                                                                sx={{ cursor: 'pointer', mt: 1 }}
                                                                                onClick={() => toggleRepliesVisibility(comment._id)}
                                                                            >
                                                                                {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                                                                            </Typography>
                                                                        )}
                                                                    </Box>

                                                                    {/* Reply Input (conditionally rendered) */}
                                                                    {replyTo === comment._id && (
                                                                        <Box mt={2}>
                                                                            {showEmojiPicker && (
                                                                                <Box sx={{ position: 'absolute', zIndex: 100 }}>
                                                                                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                                                                                </Box>
                                                                            )}
                                                                            <CardActions disableSpacing sx={{ padding: 1 }}>
                                                                                <IconButton
                                                                                    size="small"
                                                                                    color="primary"
                                                                                    onClick={() => setShowEmojiPicker((prev) => !prev)}
                                                                                >
                                                                                    <Face />
                                                                                </IconButton>
                                                                                <Input
                                                                                    fullWidth
                                                                                    placeholder="Reply to this comment..."
                                                                                    value={replyText}
                                                                                    onChange={(e) => setReplyText(e.target.value)}
                                                                                />
                                                                                <button
                                                                                    style={{ marginLeft: '10px', cursor: 'pointer', color: 'white' }}
                                                                                    onClick={() => handlePostReply(post._id, comment._id)}
                                                                                >
                                                                                    Reply
                                                                                </button>
                                                                            </CardActions>
                                                                        </Box>
                                                                    )}
                                                                </Box>

                                                                {/* Delete Comment Icon */}
                                                                {comment.UserId === currentUserId && (
                                                                    <IconButton
                                                                        edge="end"
                                                                        aria-label="delete"
                                                                        onClick={() => handleDeleteComment(comment._id, post._id, '')}
                                                                        sx={{ marginLeft: 'auto' }}
                                                                    >
                                                                        <DeleteIcon />
                                                                    </IconButton>
                                                                )}
                                                            </Box>

                                                            {/* Display Replies Conditionally */}
                                                            {isRepliesVisible && comment.replies.length > 0 && (
                                                                <Box ml={4} mt={2}>
                                                                    {comment.replies.map((reply: any) => (
                                                                        <Box key={reply._id} display="flex" alignItems="flex-start" mb={2}>
                                                                            {/* Reply Avatar */}
                                                                            <Avatar src={reply.avatar} alt={reply.userName} sx={{ marginRight: 2 }} />
                                                                            {/* Reply Content */}
                                                                            <Box flex={1}>
                                                                                <Typography variant="body2" color="textSecondary">
                                                                                    <strong>{reply.userName}</strong> • {moment(reply.createdAt).fromNow()}
                                                                                </Typography>
                                                                                <Typography variant="body1" paragraph>
                                                                                    {reply.content}
                                                                                </Typography>
                                                                            </Box>
                                                                            {reply.UserId === currentUserId && (
                                                                                <IconButton
                                                                                    edge="end"
                                                                                    aria-label="delete"
                                                                                    onClick={() => handleDeleteComment(reply._id, post._id, comment._id)}
                                                                                    sx={{ marginLeft: 'auto' }}
                                                                                >
                                                                                    <DeleteIcon />
                                                                                </IconButton>
                                                                            )}
                                                                        </Box>
                                                                    ))}
                                                                </Box>
                                                            )}
                                                        </Box>
                                                    );
                                                })}
                                        </>
                                    ) : (
                                        <Typography paragraph>You can be the first one to comment!</Typography>
                                    )}
                                </CardContent>




                                <CardActions disableSpacing sx={{ padding: 3, marginTop: -5 }}>
                                    {showEmojiPicker && (
                                        <Box sx={{ position: 'absolute', zIndex: 100 }}>
                                            <EmojiPicker onEmojiClick={handleEmojiClick} />
                                        </Box>
                                    )}
                                    <IconButtons size="sm" variant="plain" color="neutral" sx={{ ml: -1 }}
                                        onClick={() => setShowEmojiPicker(prev => !prev)}
                                    >
                                        <Face />
                                    </IconButtons>
                                    <Input
                                        variant="plain"
                                        size="sm"
                                        placeholder="Add a comment…"
                                        value={selectedEmoji || ''}

                                        onChange={(e) => setSelectedEmoji(e.target.value)}
                                        sx={{ flex: 1, px: 0, '--Input-focusedThickness': '0px', padding: 3 }}
                                    />
                                    {/* <Link disabled underline="none" role="button"  > */}
                                    <button style={{ color: 'white', cursor: 'pointer' }} onClick={() => handelComment(post._id)}>
                                        Post
                                    </button>
                                    {/* </Link> */}
                                </CardActions>
                            </Collapse>
                        </Card>
                    ))
                ) : (
                    <Typography variant="h6">No posts available</Typography>
                )
            )}

            {
                loadinPage &&
                <CircularProgress
                    color="primary"
                    determinate={false}
                    size="lg"
                    variant="plain"
                    sx={{ marginBottom: 10 }}
                />
            }

        </Container>
    );
}
