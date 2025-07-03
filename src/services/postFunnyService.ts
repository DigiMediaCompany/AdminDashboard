import axios from "axios"
import {constants} from "../utils/constants.ts";
import {Pagination} from "../types/Common.ts";
import {Quiz} from "../types/PostFunny.ts";

const BASE_URL = import.meta.env.VITE_PUBLIC_CLOUDFLARE_D1_URL;
export const getQuizzes = async (page: number=0): Promise<Pagination<Quiz>> => {
    const response = await axios.get(`${BASE_URL}/quizzes`, {
        params: {
            offset:  page * constants.STANDARD_LIMIT,
            limit:  constants.STANDARD_LIMIT,
        }
    })

    const parsedData: Quiz[] = response.data.data.map((quiz: any) => {
        const {
            created_at,
            created_by,
            quizzes,
            answers,
            ...rest
        } = quiz

        return {
            ...rest,
            createdAt: created_at,
            createdBy: created_by,
            quizzes: JSON.parse(quizzes),
            answers: JSON.parse(answers),
        }
    })

    return {
        ...response.data,
        data: parsedData,
    }
}