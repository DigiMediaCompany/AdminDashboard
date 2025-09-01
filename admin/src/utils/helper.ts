import axios from "axios";

export function snakeToTitleCase(input: string): string {
    return input
        .split('_')
        .map(word =>
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(' ');
}

const adminApi = axios.create({
    baseURL: import.meta.env.VITE_PUBLIC_CLOUDFLARE_D1_ADMIN_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add a token dynamically if needed
adminApi.interceptors.request.use((config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default adminApi;