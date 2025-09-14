import axios, { InternalAxiosRequestConfig } from "axios"
import Cookies from 'js-cookie'
export const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL
export const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
})

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = Cookies.get("access_token");
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});