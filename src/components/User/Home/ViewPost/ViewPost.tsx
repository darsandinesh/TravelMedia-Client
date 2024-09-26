import { useLocation } from "react-router-dom";
import Divider from '@mui/joy/Divider';
import Avatar from '@mui/joy/Avatar';
import { IoThumbsUpOutline, IoChatbubbleOutline, IoShareSocialOutline, IoBookmarkOutline } from "react-icons/io5";
import Typography from '@mui/material/Typography';
import moment from 'moment';
import Box from '@mui/joy/Box';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import IconButtons from '@mui/joy/IconButton';
import Face from '@mui/icons-material/Face';
import './ViewPost.css';
import Navbar from "../NavBar/NavBar";
import { ShowChart } from "@mui/icons-material";
import { useEffect, useState } from "react";
import axiosInstance from "../../../../constraints/axios/userAxios";
import { postEndpoints } from "../../../../constraints/endpoints/postEndpoints";

interface Comment {
    userId: string;
    avatar: string;
    content: string;
    createdAt: string;
    userName: string;
}

interface Post {
    comments: Comment[];  // Array of Comment objects
    created_at: string;
    description: string;
    imageUrl: string[];
    likes: string[];
    location: string;
    userId: string;
}


const ViewPost = () => {
    const [showEmoji, setShowEmoji] = useState<boolean>(false)
    const [data, setData] = useState<Post>();
    const location = useLocation();


    const postId = location.state.postId;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await axiosInstance.get(`${postEndpoints.getPost}?postId=${postId}`);
                console.log(result.data.data.data);
                if (result.data.data.success) {
                    setData(result.data.data.data);
                }

                setTimeout(() => {
                    console.log(data, 'data from backend');
                }, 2000);
            } catch (error) {

            }
        }

        fetchData()

    }, []);

    return (
        <>
            <Navbar />

            {/* Modal Container */}
            <div className="viewpost-container">
                {/* Image Section */}
                <div className="viewpost-image-section">
                    <img
                        src={data?.imageUrl[0]}
                        alt="Post"
                        className="viewpost-image"
                        
                    />
                </div>

                {/* Content Section */}
                <div className="viewpost-content-section">
                    <div className="viewpost-header">
                        <Avatar alt="User" src="/static/images/avatar/1.jpg" size="lg" />
                        <h2 style={{ marginLeft: '5%', cursor: 'pointer' }}>UserName</h2>
                        <strong style={{ marginLeft: '2%', marginTop: '-2.5%' }}>.</strong>
                        <h6 style={{ marginLeft: '2%', color: 'blue' }}>following</h6>

                    </div>
                    <br />
                    <Divider />
                    <br />
                    <div className="viewpost-comments">
                        <h6>Comments...</h6>
                        <Divider/>
                        <br />
                        {/* Comments List */}
                        {
                            data?.comments.map((comment, index) => (
                                <Box key={index} display="flex" alignItems="flex-start" mb={2}>
                                    {/* Avatar */}
                                    <Avatar
                                        src={comment.avatar}
                                        alt={''}
                                        sx={{ marginRight: 2 }}
                                    />

                                    {/* Comment details */}
                                    <Box flex={1}>
                                        {/* Name and Date */}
                                        <Typography variant="body2" color="textSecondary">
                                            <strong>{comment.userName}</strong> • {moment(comment.createdAt).fromNow()}
                                        </Typography>

                                        {/* Comment Content */}
                                        <Typography variant="body1" paragraph>
                                            {comment.content}
                                        </Typography>
                                    </Box>


                                </Box>
                            ))
                        }

                    </div>
                    <div className="viewpost-comment-input">
                        {
                            showEmoji && <EmojiPicker style={{ zIndex: 1000 }} />

                        }
                        <IconButtons size="sm" variant="plain" color="neutral" sx={{ ml: -1 }}
                            onClick={() => setShowEmoji(prev => !prev)}
                        >
                            <Face />
                        </IconButtons>
                        <input type="text" placeholder="Post a new comment..." />
                        <button style={{ backgroundColor: '#2d3748', color: 'white' }}>Post</button>
                        {/* Implement the emoji picker here */}
                    </div>

                    <div className="viewpost-footer">
                        <p><strong>{data?.likes.length} likes</strong></p>
                        <p className="viewpost-timestamp">{moment(data?.created_at).fromNow()}</p>
                        {/* Action Icons */}
                        <div className="viewpost-action-icons">
                            <IoThumbsUpOutline className="action-icon" title="Like" />
                            <IoShareSocialOutline className="action-icon" title="Share" />
                            <IoBookmarkOutline className="action-icon" title="Save" />
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
};

export default ViewPost;
