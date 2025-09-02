import {constants} from "../utils/constants.ts";
import {Pagination} from "../types/Common.ts";
import {getAdminApiInstance} from "../utils/helper.ts";

const api = getAdminApiInstance('article')
// export const getJobs = async (page: number=1): Promise<Pagination<Job>> => {
//     const response = await api.get('/jobs', {
//         params: {
//             page:  page,
//             limit:  constants.STANDARD_LIMIT,
//         }
//     })
//
//     return {
//         ...response.data,
//         data: response.data,
//     }
// }

export const getApi = async <T>(
    model: string,
    page: number = 1
): Promise<Pagination<T>> => {
    const response = await api.get(`/` + model, {
        params: {
            page,
            limit: constants.STANDARD_LIMIT,
        },
    });

    return {
        ...response.data,
        data: response.data as T[], // ensure correct type
    };
};

export const postApi = async <T>(
    model: string,
    payload: T
): Promise<unknown> => {
    const response = await api.post(`/${model}`, payload);
    return response.data;
};

export const updateApi = async <T, R = T>(
    model: string,
    id: number | string,
    payload: Partial<T>
): Promise<R> => {
    const response = await api.put(`/${model}/${id}`, payload);
    return response.data as R;
};