import axios from "axios";
import { Pagination } from "../types/Common";
import { maquininha_articles } from "../types/MaquininhaArticles";

const BASE_URL_D1 = import.meta.env.VITE_PUBLIC_CLOUDFLARE_D1_URL;

export const getMaquininhaArticles = async (page: number = 1, limit?: number): Promise<Pagination<maquininha_articles>> => {
  const response = await axios.get(`${BASE_URL_D1}/maquininha-articles/`, {
    params: {
      page,
      limit,
    },
  });
  return response.data;
};

export const getMaquininhaArticle = async (id: number): Promise<maquininha_articles> => {
  const response = await axios.get(`${BASE_URL_D1}/maquininha-articles/${id}`);
  return response.data;
};

export const createMaquininhaArticle = async (payload: Omit<maquininha_articles, "id" | "createdAt" | "updatedAt">): Promise<maquininha_articles> => {
  const response = await axios.post(`${BASE_URL_D1}/maquininha-articles/`, payload, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};

export const updateMaquininhaArticle = async (
  id: number,
  payload: Partial<Omit<maquininha_articles,  "createdAt" | "updatedAt">>
): Promise<maquininha_articles> => {
  const response = await axios.patch(`${BASE_URL_D1}/maquininha-articles/${id}`, payload, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};

export const deleteMaquininhaArticle = async (id: number): Promise<unknown> => {
  const response = await axios.delete(`${BASE_URL_D1}/maquininha-articles/${id}`);
  return response.data;
};
