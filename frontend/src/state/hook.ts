import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from './store'
import { clearError, fetchUserProfile, forceLogout, loginUser, logoutUser } from "./auth/authSlice";


export const useAppDispatch= () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState>= useSelector;


export const useAuth= () => {
    const dispatch= useAppDispatch();
    const auth= useAppSelector(state => state.authReducer);


    return {
        currentUser: auth.currentUser,
        isAuthenticated: auth.isAuthenticated,
        status: auth.status,
        error: auth.error,


        login: (email: string, password: string) => {
            dispatch(loginUser({email, password}))
        },
        logout: () => {
            dispatch(logoutUser())
        },
        fetchUser: () => dispatch(fetchUserProfile()),
        clearError: () => dispatch(clearError()),
        forceLogout: () => dispatch(forceLogout())

    }
}