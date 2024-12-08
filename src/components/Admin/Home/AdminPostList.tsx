import React, { useState, useEffect } from 'react';
import { postEndpoints } from '../../../constraints/endpoints/postEndpoints';
import axiosInstance from '../../../constraints/axios/adminAxios';
import { Button, Card, CardContent, Typography, Grid, Pagination, Box, CardMedia, Avatar, Skeleton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { toast } from 'sonner';

const AdminPostList: React.FC = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [reportedPosts, setReportedPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(5);  
    const [totalPosts, setTotalPosts] = useState<number>(0); 
    const [showReported, setShowReported] = useState(false);

    // State for Modal
    const [openModal, setOpenModal] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState<string>('');
    const [selectedUserId, setSelectedUserId] = useState<string>('');

    useEffect(() => {
        fetchPosts();
    }, [showReported, currentPage]);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            if (showReported) {
                const repoData = await axiosInstance.get(`${postEndpoints.reportedPost}?page=${currentPage}`);
                const datas = repoData.data.data;
                setReportedPosts(datas);
                console.log(repoData.data)
                setTotalPosts(repoData.data.count.count || 0);  
            } else {
                const response = await axiosInstance.get(`${postEndpoints.getAllPosts}?page=${currentPage}&admin=true`);
                const data = response.data.data;
                console.log(response.data)
                setPosts(data.filter((val: any) => val.reportPost.length === 0));
                setTotalPosts(response.data.count.count || 0); 
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
        setLoading(false);
    };

    const handlePageChange = (event: React.ChangeEvent<unknown>, pageNumber: number) => {
        console.log(event);
        setCurrentPage(pageNumber); 
    };

    const toggleShowReported = () => {
        setShowReported(!showReported);
        setCurrentPage(1); 
    };

    const handleDeleteClick = (postId: string, userId: string) => {
        setSelectedPostId(postId);
        setSelectedUserId(userId);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedPostId('');
    };

    const confirmDelete = async () => {
        if (selectedPostId) {
            try {
                const result = await axiosInstance.put(postEndpoints.deletePostAdmin, {
                    postId: selectedPostId,
                    userId: selectedUserId,
                });
                if (result.data.success) {
                    fetchPosts();
                    toast.success('Post has been deleted successfully');
                }
            } catch (error) {
                console.error('Error deleting post:', error);
            }
        }
        handleCloseModal();
    };

    const displayedPosts = showReported ? reportedPosts : posts;
    const totalPages = Math.ceil(totalPosts / postsPerPage); 

    return (
        <Box sx={{ padding: '30px', minHeight: '100vh', color: '#fff', marginTop: 10 }}>
            <Typography variant="h4" sx={{ marginBottom: '20px', fontWeight: 'bold', color: '#fff', textAlign: 'center' }}>
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
                                                src={post.user.profilePicture || 'default_avatar_url'}
                                                alt={post.user.username}
                                                sx={{ width: 50, height: 50, marginRight: '10px' }}
                                            />
                                            <Typography variant="h6">{post.user.name}</Typography>
                                        </Box>

                                        {post.imageUrl?.length > 0 && (
                                            <CardMedia
                                                component="img"
                                                image={post.imageUrl[0]}
                                                alt="Post image"
                                                sx={{ height: 200, objectFit: 'cover', marginBottom: '10px' }}
                                            />
                                        )}

                                        <Typography>Description: {post.description || 'No description'}</Typography>
                                        <Typography>Location: {post.location.split(',')[0] || 'Not specified'}</Typography>
                                        <Typography>
                                            Created At: {new Date(post.created_at).toLocaleString()}
                                        </Typography>

                                        {post.reportPost.length > 0 && (
                                            <Box
                                                sx={{
                                                    marginTop: '10px',
                                                    backgroundColor: '#213547',
                                                    padding: '10px',
                                                    borderRadius: '8px',
                                                    border: '1px solid #ffebee', // Light red border
                                                }}
                                            >
                                                <Typography sx={{ fontWeight: 'bold', color: '#d32f2f' }}>
                                                    Reported: {post.reportPost.length} times
                                                </Typography>
                                                {post.reportPost.map((report: any, index: any) => (
                                                    <div key={index}>
                                                        <hr />
                                                        <Typography>Report Reason: {report.reason}</Typography>
                                                        <Typography>Status: {report.status}</Typography>
                                                    </div>
                                                ))}
                                            </Box>
                                        )}

                                        {showReported && (
                                            <Button
                                                variant="contained"
                                                color="error"
                                                sx={{ marginTop: '10px' }}
                                                onClick={() => handleDeleteClick(post._id, post.user.id)}
                                            >
                                                Delete Post
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))
                    )}
                </Grid>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={handlePageChange}
                        color="primary"
                    />
                </Box>
            )}

            {/* Confirmation Dialog */}
            <Dialog open={openModal} onClose={handleCloseModal}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this post? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={confirmDelete} color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminPostList;
