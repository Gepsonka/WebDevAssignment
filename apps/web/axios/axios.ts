import axios from "axios";


export const axiosInstance = axios.create({
    baseURL: "http://localhost:3010",
    headers: {
        "Content-Type": "application/json",
    },
});


axiosInstance.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem("token");
        if (token !== null) {
            // @ts-ignore
            config.headers = {
                ...config.headers,
                Authorization: `Bearer ${token}`,
            };
        }

        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async function (error) {
        const originalRequest = error.config;

        if (error.response.status === 403 && !originalRequest._retry && (error.response.data.msg === 'Token has expired')) {
            originalRequest._retry = true;
            const access_token = await axiosInstance.post('/refresh-token')
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + access_token.data.refreshedToken;
            console.log('token refreshed');
            localStorage.setItem('token', access_token.data.refreshedToken);
            return axiosInstance(originalRequest);
        }
        return Promise.reject(error);
    }
);