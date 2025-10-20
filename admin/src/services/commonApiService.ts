import {Ads, Info, Pagination} from "../types/Common.ts";
import axios from "axios";
import {getAdminApiInstance} from "../utils/helper.ts";
import {constants} from "../utils/constants.ts";

const BASE_URL = import.meta.env.VITE_PUBLIC_CLOUDFLARE_D1_URL;
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

export const getAds = async (site: string): Promise<Pagination<Ads>> => {
    const response = await axios.get(`${BASE_URL}/ads`, {
        params: {
            site: site
        }}
    )
    return response.data;
}

export const updateAds = async (script: string, id: number): Promise<unknown> => {
    return await axios.patch(`${BASE_URL}/ads/${id}`, {script: script})
}

// TODO: change module and model the way that you don't have to add /
export const getApi = async <T>({
    model,
    page = 1,
    relation = '',
    sort = '',
    filter = {},
    module = '',
}: {
    model: string;
    page?: number;
    relation?: string;
    sort?: string;
    filter?: Record<string, never>;
    module?: string;
}): Promise<Pagination<T>> => {
    const api = getAdminApiInstance(module)
    const response = await api.get(`/` + model, {
        params: {
            page,
            limit: constants.STANDARD_LIMIT,
            ...(relation ? { include: relation } : {}),
            ...(sort ? { sort } : {}),
            ...filter
        },
    });

    return {
        ...response.data,
        data: response.data.data as T[],
    };
};

export const postApi = async <T = unknown>({
   model,
   payload,
   module = '',
}: {
    model: string;
    payload: object;
    module?: string;
}): Promise<T> => {
    const api = getAdminApiInstance(module);
    const response = await api.post(`/${model}`, payload);
    return response.data as T;
};
export const updateApi = async <T, R = T>({
    model,
    id,
    payload,
    module = '',
}: {
    model: string;
    id: number | string;
    payload: Partial<T>;
    module?: string;
}): Promise<R> => {
    const api = getAdminApiInstance(module);
    const response = await api.patch(`/${model}/${id}`, payload);
    return response.data as R;
};