export const API_GATEWAY_BASE_URL = 'http://localhost:4000/admin'

export const adminEndpoints = {
    login : `${API_GATEWAY_BASE_URL}/login`,
    getNewUsers:`${API_GATEWAY_BASE_URL}/getNewUsers`,
    getTotalUsers:`${API_GATEWAY_BASE_URL}/getTotalUsers`,
    getUserData:`${API_GATEWAY_BASE_URL}/getUserData`,
}