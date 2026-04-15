import { useAuth } from "../state/hook";
import { useEffect } from "react";



export function AuthInitializer() {
    const { fetchUser, status, isAuthenticated }= useAuth();
    console.log("AuthInitializer effect running", { status, isAuthenticated });
    useEffect(() => {
        if (status === 'idle' && !isAuthenticated) {
            console.log("Calling fetchUserProfile");
            fetchUser();
        }
    }, [status, isAuthenticated])

    return null;
}