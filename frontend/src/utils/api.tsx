import axios from "axios";

const api= axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true  // since we're using cookies
})

export default api




// interceptor for token refresh

api.interceptors.request.use(
    (response) => response, // if success, pass through
    async (error) => {
        if (error.response?.status == 401) { // if 401 error happens(invalid token)
            try{
                await api.post("/api/v1/auth/refresh");
                return api.request(error.config) // Retry original request
            }
            catch{
                // Refresh failed - redirect to login
                window.location.href= "/login" // we could have used navigate() but window.... is better because it forces it, navigate is with in react, but window is outside of it
            }
        }
        return Promise.reject(error)
    }
)