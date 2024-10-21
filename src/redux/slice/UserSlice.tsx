import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the user data interface
export interface UserData {
    _id: string | null;
    email: string | null;
    name: string | null;
    avatar?: string | null;
    prime?: boolean;
}

// Define the user state interface
export interface UserState {
    isAuthenticated: boolean;
    token: string | null;
    userData: UserData | null;
}

// Set the initial state
const initialState: UserState = {
    isAuthenticated: false,
    token: null,
    userData: null
};

// Create the user slice
export const userSlice = createSlice({
    name: 'userAuth',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<{ token: string; userData: UserData }>) => {
            state.isAuthenticated = true;
            state.token = action.payload.token;
            state.userData = action.payload.userData;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.token = null;
            state.userData = null;
        },
        updateUser: (state, action: PayloadAction<{ name: string, avatar: string }>) => {
            if (state.userData) {
                state.userData.name = action.payload.name;
                state.userData.avatar = action.payload.avatar;
            }

        }
    },
});

// Export the actions and reducer
export const { login, logout, updateUser } = userSlice.actions;
export default userSlice.reducer;
