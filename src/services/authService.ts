import axios from "axios";
import Cookies from "js-cookie";
import type { LoginRequest, TokenResponse, User } from "../types/auth";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const authApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 1000000,
});

// Add request interceptor to include auth token
authApi.interceptors.request.use(
  (config) => {
    const token = Cookies.get("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      Cookies.remove("auth_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (credentials: LoginRequest): Promise<TokenResponse> => {
    const response = await authApi.post("/auth/login", credentials);
    return response.data;
  },

  signup: async (payload: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    terms_agreed: boolean;
    recaptcha_token?: string;
  }): Promise<{ message: string }> => {
    const response = await authApi.post("/auth/register", payload);
    return response.data;
  },

  forgotPassword: async (payload: { email: string }) => {
    const response = await authApi.post("/auth/forgot-password", payload);
    return response.data;
  },

  resetPassword: async (payload: {
    token: string;
    new_password: string;
    reenter_password: string;
  }): Promise<{ message: string }> => {
    const response = await authApi.post("/auth/reset-password", payload);
    return response.data;
  },

  verifyToken: async (): Promise<User> => {
    // Use /user/profile to verify authentication
    const response = await authApi.get("/user/profile");
    return response.data;
  },

  refreshToken: async (): Promise<TokenResponse> => {
    const response = await authApi.post("/auth/refresh");
    return response.data;
  },

  logout: () => {
    Cookies.remove("auth_token");
  },

  setToken: (token: string) => {
    Cookies.set("auth_token", token, { expires: 1 }); // 1 day
  },

  getToken: (): string | null => {
    return Cookies.get("auth_token") || null;
  },
};
