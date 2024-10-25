export const API_GATEWAY_BASE_URL = `${import.meta.env.VITE_FRONTEN_URL}/admin`

export const adminEndpoints = {
    login : `${API_GATEWAY_BASE_URL}/login`,
    getNewUsers:`${API_GATEWAY_BASE_URL}/getNewUsers`,
    getTotalUsers:`${API_GATEWAY_BASE_URL}/getTotalUsers`,
    getUserData:`${API_GATEWAY_BASE_URL}/getUserData`,
}