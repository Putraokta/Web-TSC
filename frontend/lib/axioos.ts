import environtment from "@/config/environment";
import { SessionExtended } from "@/types/Auth";
import axios from "axios";
import { getSession } from "next-auth/react";

const headers = {
  "Content-Type": "application/json",
};

export const instance = axios.create({
  baseURL: environtment.API_URL,
  headers,
  timeout: 60 * 1000,
});

// Attach token from localStorage on each request (client-side)
instance.interceptors.request.use(
  (config) => {
    try {
      if (typeof window !== "undefined") {
        const t = localStorage.getItem("accessToken");
        if (t) {
          if (!config.headers) (config.headers as any) = {};
          (config.headers as any)["Authorization"] = `Bearer ${t}`;
        }
      }
    } catch (e) {
      // ignore storage errors
    }
    return config;
  },
  (error) => Promise.reject(error),
);

instance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);

export function setAuthToken(token?: string | null) {
  if (typeof window === "undefined") return;
  try {
    if (token) {
      localStorage.setItem("accessToken", token);
      instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      localStorage.removeItem("accessToken");
      delete instance.defaults.headers.common["Authorization"];
    }
  } catch (e) {
    // ignore
  }
}