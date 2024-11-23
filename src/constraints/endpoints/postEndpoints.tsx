
export const API_GATEWAY_BASE_URL = `${import.meta.env.VITE_FRONTEN_URL}/post`;


export const postEndpoints = {
    getAllPosts: `${API_GATEWAY_BASE_URL}/getAllPosts`,
    reportedPost:`${API_GATEWAY_BASE_URL}/reportedPost`,
    getreportPost: `${API_GATEWAY_BASE_URL}/getreportPost`,
    addPost: `${API_GATEWAY_BASE_URL}/add-post`,
    findBuddy: `${API_GATEWAY_BASE_URL}/findBuddy`,
    getfindBuddy: `${API_GATEWAY_BASE_URL}/getfindBuddy`,
    likedPosts: `${API_GATEWAY_BASE_URL}/likedPosts`,
    getPost: `${API_GATEWAY_BASE_URL}/getPost`,
    editPost: `${API_GATEWAY_BASE_URL}/editPost`,
    deletePost: `${API_GATEWAY_BASE_URL}/deletePost`,
    deletePostAdmin: `${API_GATEWAY_BASE_URL}/deletePostAdmin`,
    reportPost: `${API_GATEWAY_BASE_URL}/reportPost`,
    deleteImage:`${API_GATEWAY_BASE_URL}/deleteImage`,
    getNewPosts:`${API_GATEWAY_BASE_URL}/getNewPosts`,
    searchPost:`${API_GATEWAY_BASE_URL}/searchPost`,
}