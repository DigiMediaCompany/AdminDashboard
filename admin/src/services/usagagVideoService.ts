import axios from "axios";
import { Pagination } from "../types/Common";
import { UsagagVideo } from "../types/UsagagVideo";

const BASE_URL_D1 = import.meta.env.VITE_PUBLIC_CLOUDFLARE_D1_URL;

export const getUsagagVideos = async (page: number = 1, limit?: number): Promise<Pagination<UsagagVideo>> => {
  const response = await axios.get(`${BASE_URL_D1}/usagag-videos/`, {
    params: {
      page,
      limit,
    },
  });
  return response.data;
};

export const getUsagagVideo = async (id: number): Promise<UsagagVideo> => {
  const response = await axios.get(`${BASE_URL_D1}/usagag-videos/${id}`);
  return response.data;
};

export const createUsagagVideo = async (payload: Omit<UsagagVideo, "id" | "createdAt" | "updatedAt">): Promise<UsagagVideo> => {
  const response = await axios.post(`${BASE_URL_D1}/usagag-videos/`, payload, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};

export const updateUsagagVideo = async (
  id: number,
  payload: Partial<Omit<UsagagVideo,  "createdAt" | "updatedAt">>
): Promise<UsagagVideo> => {
  const response = await axios.patch(`${BASE_URL_D1}/usagag-videos/${id}`, payload, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};

export const deleteUsagagVideo = async (id: number): Promise<unknown> => {
  const response = await axios.delete(`${BASE_URL_D1}/usagag-videos/${id}`);
  return response.data;
};

// R2
const R2_URL = import.meta.env.VITE_PUBLIC_CLOUDFLARE_R2_URL;

export const uploadToR2 = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axios.post(`${R2_URL}/files`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  if (res.data?.filename) {
    return `${R2_URL}/files/${res.data.filename}`;
  } else {
    throw new Error("Upload failed");
  }
};
export const deleteFile = async (filename: string): Promise<unknown> => {
    const res = await axios.delete(`${R2_URL}/files/${filename}`);
    return res.data;
};

export const getFile = async (filename: string): Promise<Blob> => {
    const response = await axios.get(`${R2_URL}/files/${filename}`, {
        responseType: "blob",
    });
    return response.data;
};