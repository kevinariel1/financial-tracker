import  axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const axiosInstance = axios.create({
    baseURL: baseURL, 
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("token");
        if (accessToken){
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    }, 
    (error) => {
        return Promise.reject(error);
    }
);

// Request Interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // ONLY redirect if we are NOT on the auth pages (Login/SignUp)
            const isAuthPage = window.location.pathname === "/login" || window.location.pathname === "/signup";

            if (error.response.status === 401 && !isAuthPage) {
                localStorage.removeItem("token");
                window.location.href = "/login";
            } else if (error.response.status === 500) {
                console.error("Server error. Please try again later.");
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;