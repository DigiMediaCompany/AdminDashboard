import axios from "axios"
import {constants} from "../utils/constants.ts";
import {Pagination} from "../types/Common.ts";
import {FileUploadResponse, Quiz} from "../types/PostFunny.ts";

const BASE_URL_D1 = import.meta.env.VITE_PUBLIC_CLOUDFLARE_D1_URL;
const BASE_URL_R2 = import.meta.env.VITE_PUBLIC_CLOUDFLARE_R2_URL;
export const getQuizzes = async (page: number=1): Promise<Pagination<Quiz>> => {
    const offset = page >= 1 ? page - 1 : 0;
    const response = await axios.get(`${BASE_URL_D1}/quizzes`, {
        params: {
            offset:  offset * constants.STANDARD_LIMIT,
            limit:  constants.STANDARD_LIMIT,
        }
    })

    const parsedData: Quiz[] = response.data.data.map((quiz: unknown) => {
        return quiz
        // const {
        //     created_at,
        //     created_by,
        //     quizzes,
        //     answers,
        //     ...rest
        // } = quiz
        //
        // return {
        //     ...rest,
        //     createdAt: created_at,
        //     createdBy: created_by,
        //     quizzes: JSON.parse(quizzes),
        //     answers: JSON.parse(answers),
        // }
    })

    return {
        ...response.data,
        data: parsedData,
    }
}

export const saveQuiz = async (data: Quiz): Promise<unknown> => {
    return await axios.patch(`${BASE_URL_D1}/quizzes/${data.id}`, {
        answers: JSON.stringify(data.answers),
        quizzes: JSON.stringify(data.quizzes)
    }, {
        headers: {
            "Content-Type": "application/json"
        }
    });
}

export const uploadR2File = async (file: File): Promise<FileUploadResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axios.post(`${BASE_URL_R2}/files`, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return response.data;
}

export const deleteFile = async (filename: string): Promise<unknown> => {
    const res = await axios.delete(`${BASE_URL_R2}/files/${filename}`);
    return res.data;
};

export const getFile = async (filename: string): Promise<Blob> => {
    const response = await axios.get(`${BASE_URL_R2}/files/${filename}`, {
        responseType: "blob",
    });
    return response.data;
};

export const downloadFile = async (filename: string): Promise<void> => {
    const blob = await getFile(filename);

    // Create a temporary object URL
    const url = window.URL.createObjectURL(blob);

    // Create a hidden <a> element
    const link = document.createElement("a");
    link.href = url;
    link.download = filename; // suggest the filename

    // Append, click, and cleanup
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
}

export const uploadFile = async (file: File): Promise<FileUploadResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axios.post(`${BASE_URL_R2}/files`, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return response.data;
}