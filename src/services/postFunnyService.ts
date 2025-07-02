import axios from "axios"
import {constants} from "../utils/constants.ts";
import {Pagination} from "../types/Common.ts";
import {Quiz} from "../types/PostFunny.ts";

const BASE_URL = import.meta.env.VITE_CLOUDFLARE_D1_URL;
export const getQuizzes = async (page: number=0): Promise<Pagination> => {
    const response = await axios.get(`${BASE_URL}/quizzes?offset=${page * 
    constants.STANDARD_LIMIT}&limit=${constants.STANDARD_LIMIT}`)
    const parsedData: Quiz[] = response.data.data.map((quiz: any) => ({
        ...quiz,
        quizzes: JSON.parse(quiz.quizzes),
        answers: JSON.parse(quiz.answers),
    }))

    return {
        ...response.data,
        data: parsedData,
    }
}
