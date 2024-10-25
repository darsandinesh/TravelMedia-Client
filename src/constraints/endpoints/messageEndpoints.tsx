export const API_GATEWAY_BASE_URL =`${import.meta.env.VITE_FRONTEN_URL}/message`;

export const messageEndpoints = {
    getConversationData : `${API_GATEWAY_BASE_URL}/getconversationdata`,
    createChatId:`${API_GATEWAY_BASE_URL}/createChatId`,
    getMessage:`${API_GATEWAY_BASE_URL}/getmessages`,
    sendImages:`${API_GATEWAY_BASE_URL}/sendImage`,
    sendVideo:`${API_GATEWAY_BASE_URL}/sendVideo`,
    getNotification:`${API_GATEWAY_BASE_URL}/getNotification`,
    readNotification:`${API_GATEWAY_BASE_URL}/readNotification`
}