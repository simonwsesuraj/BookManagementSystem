import axios from "axios";

export const BASE_URL = "http://127.0.0.1:8000";

export const api = axios.create({
    baseURL: `${BASE_URL}/api/`,
});

api.interceptors.request.use(
    (config) => {

        const accessToken =
            localStorage.getItem("access_token") ||
            sessionStorage.getItem("access_token");

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


export const apiAccounts = axios.create({
    baseURL: `${BASE_URL}/accounts/`,
});