import {constants} from "../utils/constants.ts";
import {Pagination} from "../types/Common.ts";
import {getAdminApiInstance} from "../utils/helper.ts";

const api = getAdminApiInstance('article')

export const getApi = async <T>(
    model: string,
    page: number = 1,
    relation: string = '',
    sort: string = '',
    filter: Record<string, any> = {}
): Promise<Pagination<T>> => {
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

export const postApi = async (
    model: string,
    payload: object
): Promise<unknown> => {
    const response = await api.post(`/${model}`, payload);
    return response.data;
};

export const updateApi = async <T, R = T>(
    model: string,
    id: number | string,
    payload: Partial<T>
): Promise<R> => {
    const response = await api.patch(`/${model}/${id}`, payload);
    return response.data as R;
};
export const deleteApi = async (
    model: string,
    id: number | string
): Promise<unknown> => {
    const response = await api.delete(`/${model}/${id}`);
    return response.data;
};
