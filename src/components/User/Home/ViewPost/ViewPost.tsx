import * as React from 'react';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Divider from '@mui/joy/Divider';
import Avatar from '@mui/joy/Avatar';
import { IoThumbsUpOutline, IoShareSocialOutline, IoBookmarkOutline } from "react-icons/io5";
import Typography from '@mui/material/Typography';
import moment from 'moment';
import Box from '@mui/joy/Box';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import IconButton from '@mui/joy/IconButton';
import Face from '@mui/icons-material/Face';
import './ViewPost.css';
import Navbar from "../NavBar/NavBar";
import { useEffect, useState } from "react";
import axiosInstance from "../../../../constraints/axios/userAxios";
import { postEndpoints } from "../../../../constraints/endpoints/postEndpoints";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store/sotre";
import Input from '@mui/joy/Input';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Skeleton from '@mui/joy/Skeleton';
import AspectRatio from '@mui/joy/AspectRatio';
import Button from '@mui/joy/Button';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import Sheet from '@mui/joy/Sheet';
import { TextField } from '@mui/material';
import Stack from '@mui/joy/Stack';
import Snackbar from '@mui/joy/Snackbar';


import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

import Menu from '@mui/joy/Menu';
import MenuItem from '@mui/joy/MenuItem';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import ListDivider from '@mui/joy/ListDivider';
import MoreVert from '@mui/icons-material/MoreVert';
import Edit from '@mui/icons-material/Edit';
import DeleteForever from '@mui/icons-material/DeleteForever';
import MenuButton from '@mui/joy/MenuButton';
import Dropdown from '@mui/joy/Dropdown';
import { MdOutlineReportGmailerrorred } from "react-icons/md";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import Alert from '@mui/joy/Alert';

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
    comments: Comment[];
}

const ViewPost = () => {
    const [showEmoji, setShowEmoji] = useState<boolean>(false);
    const [comment, setComment] = useState<string>('');
    const [postData, setPostData] = useState<Post | null>(null); // Fixed type definition
    const [userData, setUserData] = useState<any>();
    const [visibleReplies, setVisibleReplies] = useState<{ [key: string]: boolean }>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [replyTo, setReplyTo] = useState<string | null>(null);
    const [replyText, setReplyText] = useState('');
    const [open, setOpen] = React.useState<boolean>(false);
    const [reason, setReason] = useState('');
    const [snackbar, setSnackbar] = React.useState(false);
    const [message, setMessage] = useState<boolean>(false);

    const navigate = useNavigate();

    const location = useLocation();
    const { id, uId } = useParams();
    const postId = location.state?.postId || id;

    const loggeduser = useSelector((state: RootState) => state.userAuth.userData);

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            try {
                const userId = location.state.userId || uId
                const result = await axiosInstance.get(`${postEndpoints.getPost}?postId=${postId || id}&userId=${userId || uId}`);
                if (result.data.post.success) {
                    setPostData(result.data.post.data);
                    setUserData(result.data.user);
                }
                setTimeout(() => {
                    setLoading(false);
                }, 2000)
            } catch (error: any) {
                setLoading(false);
                toast.error('Something went wrong', error);
            }
        };
        fetchData();
    }, [postId]);

    const handleLikeClick = async () => {
        if (!postData) return;
        try {
            const result = await axiosInstance.post('/post/likePost', {
                logged: loggeduser?._id,
                postId: postData._id
            });
            if (result.data.success) {
                setPostData({
                    ...postData,
                    likes: [...postData.likes, { UserId: loggeduser?._id }]
                });
                toast.success('Liked the post');
            } else {
                toast.info('Unable to like, Try after some time');
            }
        } catch (error) {
            console.error('Error handling like/unlike:', error);
        }
    };

    const handleUnLikeClick = async () => {
        if (!postData) return;
        try {
            const result = await axiosInstance.post('/post/unlikePost', {
                logged: loggeduser?._id,
                postId: postData._id
            });
            if (result.data.success) {
                setPostData({
                    ...postData,
                    likes: postData.likes.filter(like => like.UserId !== loggeduser?._id)
                });
                toast.success('Unliked the post');
            } else {
                toast.info('Unable to unlike, Try after some time');
            }
        } catch (error) {
            console.error('Error handling like/unlike:', error);
        }
    };

    const isUserLikedPost = () => {
        return postData?.likes.some((like: Like) => like.UserId === loggeduser?._id);
    };


    const toggleRepliesVisibility = (commentId: string) => {
        setVisibleReplies(prev => ({
            ...prev,
            [commentId]: !prev[commentId],
        }));
    };

    const handleReplyClick = (commentId: string) => {
        setReplyTo(commentId);
        setReplyText('');
    };

    const handelComment = async (
        postId: string,
        parentCommentId?: any,
    ) => {
        try {
            const payload = {
                postId,
                content: comment, // use replyText for replies, comment for normal comment
                userId: loggeduser?._id,
                avatar: loggeduser?.avatar,
                userName: loggeduser?.name,
                replayText: '',
                parentCommentId: '', // null if it's a normal comment
            };

            if (replyTo) {
                payload.parentCommentId = replyTo;
                payload.replayText = replyText;
            }

            const result = await axiosInstance.post('/post/comment', payload);

            if (result.data.success) {
                const newComment = {
                    _id: result.data.commentId,
                    UserId: loggeduser?._id,
                    content: comment,
                    createdAt: new Date().toISOString(),
                    avatar: loggeduser?.avatar,
                    userName: loggeduser?.name,
                    replies: parentCommentId ? [] : [], // Empty replies array for a new comment
                };

                // Update state based on whether it's a reply or a new comment
                setPostData((prevPost) => {
                    if (parentCommentId) {
                        // Handle reply
                        return {
                            ...prevPost!,
                            comments: prevPost!.comments.map((comment) => {
                                if (comment._id === parentCommentId) {
                                    return {
                                        ...comment,
                                        replies: [
                                            ...comment.replies,
                                            {
                                                _id: result.data.commentId,
                                                UserId: loggeduser?._id,
                                                content: replyText,
                                                createdAt: new Date().toISOString(),
                                                avatar: loggeduser?.avatar,
                                                userName: loggeduser?.name,
                                            },
                                        ],
                                    };
                                }
                                return comment;
                            }),
                        };
                    } else {
                        return {
                            ...prevPost!,
                            comments: [...prevPost!.comments, newComment],
                        };
                    }
                });

                setComment('');
                toast.success('Comment added successfully');
            } else {
                toast.error('Failed to add comment/reply');
            }
        } catch (error) {
            toast.error('Something went wrong');
        }
    };

    const handelDelete = async () => {
        try {
            const result = await axiosInstance.put(postEndpoints.deletePost, {
                postId: postData?._id
            })

            console.log(result);
            if (result.data.success) {
                toast.success(result.data.message);
            } else {
                toast.info(result.data.message)
            }
        } catch (error) {
            toast.error('Unable to delte the post')
        }
    }


    const handleSubmitReport = async () => {
        if (reason.trim()) {
            try {
                const result = await axiosInstance.put(postEndpoints.reportPost,
                    {
                        userId: loggeduser?._id, postId: postData?._id, reason: reason
                    }
                )
                if (result.data.success) {
                    setMessage(true)
                } else {
                    toast.error('Unable to report the post ')
                }
            } catch (error) {

            }
            console.log('Reported reason:', reason);
            setOpen(false);
        } else {
            setSnackbar(true)
            // alert('Please provide a reason for reporting the post.');
        }
    };

    const copyToClipboard = () => {
        const currentUrl = window.location.href;
        const postId = location.state?.postId;
        const userId = location.state?.userId
        const urlToShare = `${currentUrl}/${postId}/${userId}`;
        navigator.clipboard.writeText(urlToShare)
            .then(() => {
                toast.success('URL copied to clipboard!')
            })
            .catch(err => {
                console.error('Failed to copy the URL: ', err);
            });
    };

    return (
        <>
            <Navbar />
            <div className="viewpost-container" style={{ backgroundColor: '#213547' }}>

                {loading ? (
                    <Box sx={{ m: 'auto', width: '50%', height: '100%' }}>
                        <AspectRatio variant="plain">
                            <Skeleton variant="rectangular" width="100%" height="400px">
                                <img
                                    src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
                                    alt="Loading"
                                />
                            </Skeleton>
                        </AspectRatio>
                    </Box>
                ) : (
                    <div className="viewpost-image-section">
                        {postData?.imageUrl && (
                            <Carousel showThumbs={false} infiniteLoop={true} autoPlay={false}>
                                {postData.imageUrl.map((image, index) => (
                                    <div key={index} style={{ height: '100%', objectFit: 'cover' }}>
                                        <img src={image} alt={`Post ${index}`} className="viewpost-image" />
                                    </div>
                                ))}
                            </Carousel>
                        )}
                    </div>
                )}


                <div className="viewpost-content-section" style={{ backgroundColor: 'white' }}>
                    {
                        loading ?
                            <>
                                <Card
                                    variant="outlined"
                                    sx={{ width: 'full', height: 'full', borderRadius: 0, '--Card-radius': 0, backgroundColor: 'white' }}
                                >
                                    <CardContent orientation="horizontal" >
                                        <Skeleton variant="rectangular" width={44} height={44} />
                                        <div>
                                            <Skeleton variant="text" width={100} />
                                            <Skeleton level="body-sm" variant="text" width={200} />
                                        </div>
                                    </CardContent>
                                    <CardContent sx={{ gap: 0.5, mt: 1 }}>
                                        <Skeleton level="body-xs" variant="text" width="92%" />
                                        <Skeleton level="body-xs" variant="text" width="99%" />
                                        <Skeleton level="body-xs" variant="text" width="96%" />
                                    </CardContent>
                                </Card>
                            </>
                            :
                            <>
                                {
                                    message &&
                                    <Box sx={{ display: 'flex', gap: 2, width: '100%', flexDirection: 'column' }}>

                                        <Alert
                                            sx={{ alignItems: 'flex-start' }}
                                            startDecorator={<CheckCircleIcon />}
                                            variant="soft"
                                            color='success'
                                            endDecorator={
                                                <IconButton variant="soft" color='success' onClick={() => setMessage(false)} >
                                                    <CloseRoundedIcon />
                                                </IconButton>
                                            }
                                        >
                                            <div>
                                                <div>{'Success'}</div>
                                                {/* <Typography level="body-sm" color='success'> */}
                                                The Post is Reported successfully
                                                {/* </Typography> */}
                                            </div>
                                        </Alert>

                                    </Box>
                                }
                                <div className="viewpost-header" >
                                    <Avatar alt="User" src={userData?.profilePicture} size="lg" />
                                    <h2 style={{ marginLeft: '5%', cursor: 'pointer' }}>{userData?.name || 'UserName'}</h2>
                                    <h6 style={{ marginLeft: '2%', color: 'blue' }}>following</h6>
                                    <div style={{ marginLeft: 'auto' }}>
                                        {
                                            loggeduser?._id == userData?._id
                                                ?

                                                < Dropdown >
                                                    <MenuButton
                                                        slots={{ root: IconButton }}
                                                        slotProps={{ root: { variant: 'outlined', color: 'neutral' } }}
                                                    >
                                                        <MoreVert />
                                                    </MenuButton>
                                                    <Menu placement="bottom-end">

                                                        <MenuItem onClick={() => navigate('/editPost', { state: { data: postData } })}>
                                                            <ListItemDecorator>
                                                                <Edit />
                                                            </ListItemDecorator>{' '}
                                                            Edit post
                                                        </MenuItem>
                                                        <ListDivider />
                                                        <MenuItem variant="soft" color="danger" onClick={handelDelete}>
                                                            <ListItemDecorator sx={{ color: 'inherit' }}>
                                                                <DeleteForever />
                                                            </ListItemDecorator>{' '}
                                                            Delete
                                                        </MenuItem>

                                                    </Menu>
                                                </Dropdown>
                                                :
                                                <>
                                                    <React.Fragment>
                                                        <Button
                                                            variant="outlined"
                                                            onClick={() => setOpen(true)}
                                                            sx={{
                                                                color: '#f44336',
                                                                borderColor: '#f44336',
                                                                '&:hover': { color: '#fff' },
                                                            }}
                                                        >
                                                            <MdOutlineReportGmailerrorred size={25} color="red" title="Report" />
                                                        </Button>
                                                        <Modal
                                                            aria-labelledby="modal-title"
                                                            aria-describedby="modal-desc"
                                                            open={open}
                                                            onClose={() => setOpen(false)}
                                                            sx={{
                                                                display: 'flex',
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                backdropFilter: 'blur(5px)', // Dark theme blur effect
                                                            }}
                                                        >
                                                            <Sheet
                                                                variant="outlined"
                                                                sx={{
                                                                    maxWidth: 500,
                                                                    borderRadius: 'md',
                                                                    p: 3,
                                                                    boxShadow: 'lg',
                                                                    backgroundColor: '#1c1c1e',
                                                                    color: '#f5f5f5', // Light text
                                                                }}
                                                            >
                                                                <ModalClose
                                                                    variant="plain"
                                                                    sx={{ m: 1, color: '#f5f5f5', '&:hover': { color: '#f44336' } }}
                                                                />
                                                                <Typography id="modal-title" variant="h6" sx={{ mb: 2 }}>
                                                                    Report Post
                                                                </Typography>
                                                                <Typography id="modal-desc" sx={{ mb: 2 }}>
                                                                    Please provide a reason for reporting this post.
                                                                </Typography>
                                                                <TextField
                                                                    variant="outlined"
                                                                    label="Reason"
                                                                    multiline
                                                                    rows={4}
                                                                    fullWidth
                                                                    value={reason}
                                                                    onChange={(e: any) => setReason(e.target.value)}
                                                                    sx={{
                                                                        backgroundColor: '#333',
                                                                        color: '#f5f5f5',
                                                                        '& .MuiInputBase-input': { color: '#f5f5f5' },
                                                                        '& label': { color: '#888' },
                                                                        '& label.Mui-focused': { color: '#f44336' },
                                                                        '& .MuiOutlinedInput-root': {
                                                                            '& fieldset': { borderColor: '#888' },
                                                                            '&:hover fieldset': { borderColor: '#f44336' },
                                                                            '&.Mui-focused fieldset': { borderColor: '#f44336' },
                                                                        },
                                                                    }}
                                                                />
                                                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                                                    <Button
                                                                        onClick={handleSubmitReport}
                                                                        sx={{
                                                                            backgroundColor: '#f44336',
                                                                            color: '#fff',
                                                                            '&:hover': { backgroundColor: '#d32f2f' },
                                                                        }}
                                                                    >
                                                                        Submit Report
                                                                    </Button>
                                                                </Box>
                                                            </Sheet>
                                                        </Modal>
                                                    </React.Fragment>
                                                </>

                                        }
                                        {
                                            snackbar &&
                                            <Stack spacing={2} sx={{ alignItems: 'center' }}>
                                                <Snackbar
                                                    autoHideDuration={4000}
                                                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                                                    open={snackbar}
                                                    variant='outlined'
                                                    color='danger'
                                                    onClose={(event, reason) => {
                                                        console.log(event);
                                                        if (reason === 'clickaway') {
                                                            return;
                                                        }
                                                        setSnackbar(false);
                                                    }}
                                                >
                                                    Please provide a reason for reporting this post.
                                                </Snackbar>
                                            </Stack>
                                        }

                                    </div>
                                </div>




                                <Divider sx={{ marginTop: 2 }} />
                                <Typography variant="body1" paragraph sx={{ marginTop: 4 }}>{postData?.description}</Typography>

                                <div className="viewpost-comments">
                                    <h6>Comments...</h6>
                                    <Divider />
                                    <br />

                                    {postData && postData?.comments.length > 0 ? (
                                        postData?.comments.map((comment) => {
                                            const isRepliesVisible = visibleReplies[comment._id] || false;
                                            return (
                                                <Box key={comment._id} display="flex" flexDirection="column" alignItems="flex-start" mb={2}>
                                                    <Box display="flex" alignItems="flex-start">
                                                        <Avatar src={comment.avatar || ''} alt={comment.userName || ''} sx={{ marginRight: 2 }} />
                                                        <Box flex={1}>
                                                            <Typography variant="body2" color="textSecondary">
                                                                <strong>{comment.userName}</strong> • {moment(comment.createdAt).fromNow()}
                                                            </Typography>
                                                            <Typography variant="body1">{comment.content}</Typography>

                                                            <IconButton
                                                                // size="small"
                                                                onClick={() => toggleRepliesVisibility(comment._id)}
                                                                sx={{ color: 'gray' }}>
                                                                {isRepliesVisible ? 'Hide replies' : 'View replies'}
                                                            </IconButton>

                                                            {isRepliesVisible && (
                                                                <Box ml={5}>
                                                                    {comment.replies.map((reply) => (
                                                                        <Box key={reply._id} display="flex" alignItems="flex-start" mb={2}>
                                                                            <Avatar src={reply.avatar || ''} alt={reply.userName || ''} sx={{ marginRight: 2 }} />
                                                                            <Box flex={1}>
                                                                                <Typography variant="body2" color="textSecondary">
                                                                                    <strong>{reply.userName}</strong> • {moment(reply.createdAt).fromNow()}
                                                                                </Typography>
                                                                                <Typography variant="body1">{reply.content}</Typography>
                                                                            </Box>
                                                                        </Box>
                                                                    ))}

                                                                    {replyTo === comment._id && (
                                                                        <Box display="flex" alignItems="center">
                                                                            <Input
                                                                                value={replyText}
                                                                                fullWidth
                                                                                onChange={(e) => setReplyText(e.target.value)}
                                                                                placeholder="Add a reply..."

                                                                            />
                                                                            <button onClick={() => handelComment(postData._id, comment._id)} style={{ backgroundColor: '#2d3748', color: 'white' }}>Reply</button>
                                                                        </Box>
                                                                    )}
                                                                    <button onClick={() => handleReplyClick(comment._id)} style={{ backgroundColor: '#2d3748', color: 'white' }}>Reply to comment</button>
                                                                </Box>
                                                            )}
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            );
                                        })
                                    ) : (
                                        <Typography>No comments yet</Typography>
                                    )}
                                </div>



                                <div className="viewpost-comment-input">
                                    {showEmoji && (
                                        <EmojiPicker
                                            onEmojiClick={(emoji: EmojiClickData) => setComment((prev) => prev + emoji.emoji)}
                                            style={{ zIndex: 1000 }}
                                        />
                                    )}

                                    <div onClick={() => setShowEmoji((prev) => !prev)}>
                                        <Face />
                                    </div>

                                    <input
                                        type="text"
                                        placeholder="Post a new comment..."
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                    />
                                    <button onClick={() => handelComment(postData?._id || '')} style={{ backgroundColor: '#2d3748', color: 'white' }}>
                                        Post
                                    </button>
                                </div>

                                <div className="viewpost-footer">
                                    <p><strong>{postData?.likes.length} likes</strong></p>
                                    <p className="viewpost-timestamp">{moment(postData?.created_at).fromNow()}</p>

                                    {/* Action Icons */}
                                    <div className="viewpost-action-icons">
                                        {
                                            isUserLikedPost()
                                                ?
                                                <IoThumbsUpOutline style={{ color: 'red' }} className="action-icon" title="Like" onClick={handleUnLikeClick} />
                                                :
                                                <IoThumbsUpOutline className="action-icon" title="Like" onClick={handleLikeClick} />

                                        }
                                        <IoShareSocialOutline onClick={() => copyToClipboard()} className="action-icon" title="Share" />
                                        <IoBookmarkOutline className="action-icon" title="Save" />
                                    </div>
                                </div>
                            </>
                    }

                </div>
            </div >
        </>
    );
};

export default ViewPost;
