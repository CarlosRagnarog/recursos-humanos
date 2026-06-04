import api from "../api/axiosConfig";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  email: string;
  roles: string[];
}

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/Auth/login", data);
  return response.data;
};

export const getMe = async () => {
  const response = await api.get("/Auth/me");
  return response.data;
};