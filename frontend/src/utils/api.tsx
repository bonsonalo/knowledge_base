import axios from "axios";

const api= axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true  // since we're using cookies
})

export default api




// interceptor for token refresh
let isRefreshing = false;

api.interceptors.response.use(
    (response) => response, // if success, pass through
    async (error) => {
        const originalRequest = error.config;
        // true when the 401 came from the refresh endpoint itself
        const isRefreshCall = originalRequest?.url?.includes("/api/v1/auth/refresh");
        // _retry prevents the retried request from re-entering this block if it
        // also gets a 401 — without it the interceptor loops: refresh → retry → 401
        // → refresh → retry → 401 forever
        if (error.response?.status === 401 && !isRefreshing && !isRefreshCall && !originalRequest._retry) {
            originalRequest._retry = true;
            isRefreshing = true;
            try{
                await api.post("/api/v1/auth/refresh");
                isRefreshing = false;
                return api.request(originalRequest)
            }
            catch{
                isRefreshing = false;
            }
        }
        return Promise.reject(error)
    }
)