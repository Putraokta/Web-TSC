import environtment from "@/config/environment";
import axios from "axios";

const headers = {
  "Content-Type": "application/json",
};

export const instance = axios.create({
  baseURL: environtment.API_URL,
  headers,
  timeout: 60 * 1000,
  withCredentials: true,
});

instance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);

