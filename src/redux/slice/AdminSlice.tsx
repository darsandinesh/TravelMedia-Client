import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AdminData {
    _id: string | null;
    email: string | null;
}

interface AdminState {
    isAuthenticated: boolean;
    token: string | null;
    adminData: AdminData | null;
}

const initialState: AdminState = {
    isAuthenticated: false,
    token: null,
    adminData: null
}

const adminAuthSlice = createSlice({
    name: 'AdminAuth',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<{ token: string; adminData:AdminData }>) => {
            state.isAuthenticated = true;
            state.token = action.payload.token;
            state.adminData = action.payload.adminData;
        },
    }

})

export const {login} = adminAuthSlice.actions
export default adminAuthSlice