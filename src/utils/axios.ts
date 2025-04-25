import { appConfig } from "@/configs/appConfig";
import axios from "axios";

export interface ApiResponse<T> {
  status: boolean;
  data: T | null;
}

export const axiosInstance = axios.create({
  withCredentials: true,
  baseURL: appConfig.apiBaseUrl,
  headers: { "Content-Type": "application/json" },
});

export const errorHandler = (error: string | string[]) =>
  typeof error === "string" ? error : error[0];
