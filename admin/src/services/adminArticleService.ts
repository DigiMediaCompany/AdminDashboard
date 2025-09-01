import {constants} from "../utils/constants.ts";
import {Pagination} from "../types/Common.ts";
import {Job} from "../types/Article.ts";
import {getAdminApiInstance} from "../utils/helper.ts";

// const BASE_URL_D1_ADMIN = `${import.meta.env.VITE_PUBLIC_CLOUDFLARE_D1_ADMIN_URL}/article`;
const api = getAdminApiInstance('article')
export const getJobs = async (page: number=1): Promise<Pagination<Job>> => {
    const response = await api.get('/jobs', {
        params: {
            page:  page,
            limit:  constants.STANDARD_LIMIT,
        }
    })

    return {
        ...response.data,
        data: response.data,
    }
}

// export const saveQuiz = async (data: Quiz): Promise<unknown> => {
//     return await axios.patch(`${BASE_URL_D1}/quizzes/${data.id}`, {
//         answers: JSON.stringify(data.answers),
//         quizzes: JSON.stringify(data.quizzes)
//     }, {
//         headers: {
//             "Content-Type": "application/json"
//         }
//     });
// }