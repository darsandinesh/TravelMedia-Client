
export const API_GATEWAY_BASE_URL ='http://localhost:4000/post';


export const postEndpoints = {
    getAllPosts : `${API_GATEWAY_BASE_URL}/getAllPosts`,
    addPost : `${API_GATEWAY_BASE_URL}/add-post`,
    likedPosts:`${API_GATEWAY_BASE_URL}/likedPosts`,
    
}