import axios from "axios";
import { Pagination } from "../types/Common";
import { maquininha_machines } from "../types/MaquininhaMachines";

const BASE_URL_D1 = import.meta.env.VITE_PUBLIC_CLOUDFLARE_D1_URL;

export const getMaquininhaMachines = async (page: number = 1, limit?: number): Promise<Pagination<maquininha_machines>> => {
  const response = await axios.get(`${BASE_URL_D1}/maquininha-machines/`, {
    params: {
      page,
      limit,
    },
  });
  return response.data;
};

export const getMaquininhaMachine = async (id: number): Promise<maquininha_machines> => {
  const response = await axios.get(`${BASE_URL_D1}/maquininha-machines/${id}`);
  return response.data;
};

export const createMaquininhaMachine = async (payload: Omit<maquininha_machines, "id" | "createdAt" | "updatedAt">): Promise<maquininha_machines> => {
  const response = await axios.post(`${BASE_URL_D1}/maquininha-machines/`, payload, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};

export const updateMaquininhaMachine = async (
  id: number,
  payload: Partial<Omit<maquininha_machines,  "createdAt" | "updatedAt">>
): Promise<maquininha_machines> => {
  const response = await axios.patch(`${BASE_URL_D1}/maquininha-machines/${id}`, payload, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};

export const deleteMaquininhaMachine = async (id: number): Promise<unknown> => {
  const response = await axios.delete(`${BASE_URL_D1}/maquininha-machines/${id}`);
  return response.data;
};
