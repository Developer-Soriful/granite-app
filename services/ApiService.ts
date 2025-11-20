import axios, { InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL: string = 'https://www.granitefinance.io';

const ApiService = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

ApiService.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        const token: string | null = await getAuthTokenFromStorage();

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

async function getAuthTokenFromStorage(): Promise<string | null> {
    return null;
}

export default ApiService;