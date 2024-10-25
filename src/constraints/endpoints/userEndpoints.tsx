
export const API_GATEWAY_BASE_URL = `${import.meta.env.VITE_FRONTEN_URL}`;


export const userEndpoints = {
    register: `${API_GATEWAY_BASE_URL}/register`,
    otp: `${API_GATEWAY_BASE_URL}/otp`,
    verifyOtp: `${API_GATEWAY_BASE_URL}/verifyOtp`,
    login: `${API_GATEWAY_BASE_URL}/login`,
    forgotPasword: `${API_GATEWAY_BASE_URL}/forgotPassword`,
    resetPassword: `${API_GATEWAY_BASE_URL}/resetPassword`,
    googleLogin: `${API_GATEWAY_BASE_URL}/google-login`,
    resendOtp: `${API_GATEWAY_BASE_URL}/resendOtp`,
    verifyEmail: `${API_GATEWAY_BASE_URL}/verifyEmail`,
    searchUser: `${API_GATEWAY_BASE_URL}/searchUser`,
    getFriends: `${API_GATEWAY_BASE_URL}/getFriends`,
    changeVisibility: `${API_GATEWAY_BASE_URL}/changeVisibility`,
    newUsers: `${API_GATEWAY_BASE_URL}/newUsers`,
    savePost: `${API_GATEWAY_BASE_URL}/savePost`,
    membership: `${API_GATEWAY_BASE_URL}/membership`,
    savePayment: `${API_GATEWAY_BASE_URL}/savePayment`

}