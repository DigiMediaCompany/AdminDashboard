import axios from "axios";

export function snakeToTitleCase(input: string): string {
    return input
        .split('_')
        .map(word =>
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(' ');
}

export function getAdminApiInstance(module: string) {
    const api = axios.create({
        baseURL: `${import.meta.env.VITE_PUBLIC_CLOUDFLARE_D1_ADMIN_URL}/${module}`,
        headers: {
            "Content-Type": "application/json",
            // "Access-Control-Allow-Origin": "*"
            // TODO: handle this later
        },
    });
    api.interceptors.request.use((config) => {
        const token = import.meta.env.VITE_PUBLIC_API_TOKEN;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    return api;
}

export function isValidYouTubeUrl(url: string) {
    const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}(&.*)?$/;
    return pattern.test(url);
}