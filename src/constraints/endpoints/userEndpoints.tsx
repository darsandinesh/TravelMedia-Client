
export const API_GATEWAY_BASE_URL ='http://localhost:4000';


export const userEndpoints = {
    register : `${API_GATEWAY_BASE_URL}/register`,
    otp : `${API_GATEWAY_BASE_URL}/otp`,
    verifyOtp : `${API_GATEWAY_BASE_URL}/verifyOtp`,
    login : `${API_GATEWAY_BASE_URL}/login`,
    forgotPasword : `${API_GATEWAY_BASE_URL}/forgotPassword`,
    resetPassword: `${API_GATEWAY_BASE_URL}/resetPassword`,
    googleLogin: `${API_GATEWAY_BASE_URL}/google-login`,
    resendOtp: `${API_GATEWAY_BASE_URL}/resendOtp`,
    verifyEmail: `${API_GATEWAY_BASE_URL}/verifyEmail`,
    searchUser: `${API_GATEWAY_BASE_URL}/searchUser`,
    
    
}