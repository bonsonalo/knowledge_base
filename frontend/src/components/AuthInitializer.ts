import { useAuth } from "../state/hook";
import { useEffect } from "react";



export function AuthInitializer() {
    const { fetchUser, status, isAuthenticated }= useAuth();

    useEffect(() => {
        if (status === 'idle' && !isAuthenticated) {
            fetchUser();
        }
    }, [fetchUser, status, isAuthenticated])

    return null;
}