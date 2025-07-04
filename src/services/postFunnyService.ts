import axios from "axios"
import {constants} from "../utils/constants.ts";
import {Pagination} from "../types/Common.ts";
import {FileUploadResponse, Quiz} from "../types/PostFunny.ts";

const BASE_URL_D1 = import.meta.env.VITE_PUBLIC_CLOUDFLARE_D1_URL;
const BASE_URL_R2 = import.meta.env.VITE_PUBLIC_CLOUDFLARE_R2_URL;
export const getQuizzes = async (page: number=0): Promise<Pagination<Quiz>> => {
    const response = await axios.get(`${BASE_URL_D1}/quizzes`, {
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

export const saveQuiz = async (data: Quiz): Promise<unknown> => {
    return await axios.patch(`${BASE_URL_D1}/quizzes/${data.id}`, {answers: JSON.stringify(data.answers)}, {
        headers: {
            "Content-Type": "application/json"
        }
    });
}

export const uploadImage = async (file: File): Promise<FileUploadResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axios.post(`${BASE_URL_R2}/files`, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return response.data;
}

export const deleteImage = async (filename: string): Promise<unknown> => {
    const res = await axios.delete(`${BASE_URL_R2}/files/${filename}`);
    return res.data;
};