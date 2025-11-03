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
        baseURL: `${import.meta.env.VITE_PUBLIC_CLOUDFLARE_D1_ADMIN_URL}${module}`,
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

export function generateRandomEmail(): string {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    const domains = [
        "gmail.com",
        "yahoo.com",
        "outlook.com",
        "icloud.com",
        "proton.me",
        "hotmail.com",
        "mail.com",
        "aol.com",
        "zoho.com",
        "example.com",
    ];

    // Generate a random username
    const nameLength = Math.floor(Math.random() * 8) + 5; // 5–12 chars
    const username = Array.from({ length: nameLength }, () =>
        chars.charAt(Math.floor(Math.random() * chars.length))
    ).join("");

    // Add timestamp & random 3-char suffix to make it unique
    const uniqueSuffix = `${Date.now().toString(36)}${Math.random()
        .toString(36)
        .slice(2, 5)}`;

    const domain = domains[Math.floor(Math.random() * domains.length)];

    return `${username}.${uniqueSuffix}@${domain}`;
}

