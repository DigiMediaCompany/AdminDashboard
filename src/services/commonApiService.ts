import {Info} from "../types/Common.ts";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_CLOUDFLARE_D1_URL;
export const getInfo = async (site: string): Promise<Info> => {
    const response = await axios.get(`${BASE_URL}/git/${site}`)
    return response.data;
}

export const saveInfo = async (site: string, data: Info): Promise<unknown> => {
    return await axios.post(`${BASE_URL}/git/${site}`, data, {
        headers: {
            "Content-Type": "application/json"
        }
    });
}