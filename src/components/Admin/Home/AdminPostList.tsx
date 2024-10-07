import React, { useState, useEffect } from 'react';
import { postEndpoints } from '../../../constraints/endpoints/postEndpoints';
import axiosInstance from '../../../constraints/axios/adminAxios';
import {
    Button,
    Card,
    CardContent,
    Typography,
    Grid,
    CircularProgress,
    Pagination,
    Box,
    CardMedia,
    Avatar,
    Skeleton
} from '@mui/material';

const AdminPostList: React.FC = () => {
    const [posts, setPosts] = useState<any[]>([]); // State for all posts
    const [reportedPosts, setReportedPosts] = useState<any[]>([]); // State for reported posts
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(5);
    const [totalPosts, setTotalPosts] = useState(0); // Total posts for pagination
    const [showReported, setShowReported] = useState(false); // Toggling between all and reported posts

    useEffect(() => {
        fetchPosts();
    }, [showReported, currentPage]);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            if (showReported) {
                // Fetch reported posts
                const response = await axiosInstance.get(
                    `${postEndpoints.getAllPosts}?page=${currentPage}`
                );

                const data = response.data.data.filter((val: any) => val.reportPost.length > 0);
                setReportedPosts(data); // Set reported posts
                setTotalPosts(response.data.total); // Total number of reported posts
            } else {
                // Fetch all posts
                const response = await axiosInstance.get(
                    `${postEndpoints.getAllPosts}?page=${currentPage}`
                );
                const data = response.data.data.filter((val: any) => val.reportPost.length === 0);
                setPosts(data); // Set all posts
                setTotalPosts(response.data.total); // Total number of posts
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
        setTimeout(()=>{
            setLoading(false);
        },2000)
        
    };

    const handlePageChange = (event: React.ChangeEvent<unknown>, pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const toggleShowReported = () => {
        setShowReported(!showReported);
        setCurrentPage(1); 
    };

    const displayedPosts = showReported ? reportedPosts : posts;

    return (
        <Box sx={{ padding: '30px', minHeight: '100vh', color: '#fff', marginTop: 10 }}>
            <Typography variant="h4" sx={{ marginBottom: '20px', fontWeight: 'bold', color: '#fff',marginLeft:'40%' }}>
                {showReported ? 'Reported Posts' : 'All User Posts'}
            </Typography>

            <Button
                variant="contained"
                sx={{
                    marginBottom: '20px',
                    backgroundColor: '#1e88e5',
                    color: '#fff',
                    '&:hover': {
                        backgroundColor: '#1565c0',
                    },
                }}
                onClick={toggleShowReported}
            >
                {showReported ? 'Show All Posts' : 'Show Reported Posts'}
            </Button>

            {loading ? (
                <Grid container spacing={4}>
                    {Array.from(new Array(postsPerPage)).map((_, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Skeleton variant="rectangular" width="100%" height={200} />
                            <Skeleton width="60%" />
                            <Skeleton width="80%" />
                            <Skeleton width="40%" />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Grid container spacing={4}>
                    {displayedPosts.length === 0 ? (
                        <Typography>No posts found.</Typography>
                    ) : (
                        displayedPosts.map((post) => (
                            <Grid item xs={12} sm={6} md={4} key={post._id}>
                                <Card
                                    sx={{
                                        minHeight: '300px',
                                        backgroundColor: '#1f1f1f',
                                        boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.3)',
                                        borderRadius: '10px',
                                        color: '#fff',
                                    }}
                                >
                                    <CardContent sx={{ padding: '20px' }}>
                                        <Box display="flex" alignItems="center" mb={2}>
                                            <Avatar
                                                src={post.user.profilePicture || 'default_avatar_url'} // User's profile picture
                                                alt={post.user.username}
                                                sx={{ width: 50, height: 50, marginRight: '10px' }}
                                            />
                                            <Typography variant="h6">{post.user.name}</Typography>
                                        </Box>

                                        {post.imageUrl?.length > 0 && (
                                            <CardMedia
                                                component="img"
                                                image={post.imageUrl[0]} // Display the first image
                                                alt="Post image"
                                                sx={{ height: 200, objectFit: 'cover', marginBottom: '10px' }}
                                            />
                                        )}

                                        <Typography>Description: {post.description || 'No description'}</Typography>
                                        <Typography>Location: {post.location || 'Not specified'}</Typography>
                                        <Typography>
                                            Created At: {new Date(post.created_at).toLocaleString()}
                                        </Typography>

                                        {post.reportPost.length > 0 && (
                                            <Box
                                                sx={{
                                                    marginTop: '10px',
                                                    backgroundColor: '#d32f2f',
                                                    padding: '10px',
                                                    borderRadius: '8px',
                                                }}
                                            >
                                                <Typography sx={{ fontWeight: 'bold', color: '#fff' }}>
                                                    Reported: {post.reportPost.length} times
                                                </Typography>
                                                {post.reportPost.map((report: any, index: any) => (
                                                    <div key={index}>
                                                        <Typography>Report Reason: {report.reason}</Typography>
                                                        <Typography>Status: {report.status}</Typography>
                                                    </div>
                                                ))}
                                            </Box>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))
                    )}
                </Grid>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
                <Pagination
                    count={Math.ceil(totalPosts / postsPerPage)}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                />
                
            </Box>
        </Box>
    );
};

export default AdminPostList;
