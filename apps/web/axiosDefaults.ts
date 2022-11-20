import axios from "axios";


export const instance = axios.create({
    baseURL: 'http://localhost:3010/'
})

instance.interceptors.request.use(
    function(config) {
        const token = localStorage.getItem("token"); 
        if (token) {
        config.headers!["Authorization"] = 'Bearer ' + token;
        }
        return config;
    }
)