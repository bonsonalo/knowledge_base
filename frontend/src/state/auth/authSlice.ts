import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { User } from "../../types"
import api from "../../utils/api";



interface AuthState {
    currentUser: User | null;
    isAuthenticated: boolean;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: AuthState= {
    currentUser: null,
    isAuthenticated: false,
    status: 'idle',
    error: null

}


export const loginUser= createAsyncThunk<User, { email: string; password: string }>(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try{
            await api.post("/api/v1/auth/login", credentials)
            const profileResponse = await api.get("/api/v1/me/")
            return profileResponse.data
        }
        catch(error: any){
            return rejectWithValue(error.response?.data?.detail || "Login failed")
        }
    }
)

export const logoutUser= createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue}) => {
        try{
            await api.post("/api/v1/auth/logout");
        }
        catch (error: unknown) {
            return rejectWithValue("logout failed")
        }
    }
)

export const fetchUserProfile= createAsyncThunk<User>(
    'auth/profile',
    async (_, { rejectWithValue}) => {
        console.log("fetchUserProfile thunk executing");
        try{
            const response= await api.get("/api/v1/me/")
            console.log("fetchUserProfile success:", response.data);
            return response.data
        }
        catch (error: unknown) {
            console.log("fetchUserProfile failed:", error);
            return rejectWithValue("could not get user profile")
        }
    }
)


const authSlice= createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error= null
        },

        forceLogout: (state) => {
            state.currentUser= null;
            state.error= null;
            state.isAuthenticated= false;
            state.status= 'idle';

        }
    },

    extraReducers: (builder) => {
        //login
        builder
                .addCase(loginUser.pending, (state) => {
                    state.status= 'loading';
                    state.error= null;
                })
                .addCase(loginUser.fulfilled, (state, action) => {
                    state.currentUser= action.payload;
                    state.status= 'succeeded';
                    state.error= null;
                    state.isAuthenticated= true;
                })
                .addCase(loginUser.rejected, (state, action) => {
                    state.status= 'failed';
                    state.error= action.payload as string;
                    state.isAuthenticated= false;
                })

        // logout
        builder
                .addCase(logoutUser.pending, (state) => {
                    state.status= 'loading';
                })
                .addCase(logoutUser.fulfilled, (state) => {
                    state.currentUser= null;
                    state.status= 'idle';
                    state.error= null;
                    state.isAuthenticated= false;
                })
                .addCase(logoutUser.rejected, (state, action) => {
                    state.status= 'idle';
                    state.error= action.payload as string;
                    state.isAuthenticated= false;
                    state.currentUser= null;
                })

        // fetch profile
        builder
                .addCase(fetchUserProfile.pending, (state) => {
                    state.status= 'loading';
                })
                .addCase(fetchUserProfile.fulfilled, (state, action) => {
                    state.currentUser= action.payload;
                    state.status= 'succeeded';
                    state.error= null;
                    state.isAuthenticated= true;
                })
                .addCase(fetchUserProfile.rejected, (state, action) => {
                    state.status= 'failed';
                    state.error= action.payload as string;
                    state.isAuthenticated= false;
                    state.currentUser= null;
                })
    }
})



export const {clearError, forceLogout} = authSlice.actions;

export default authSlice.reducer;