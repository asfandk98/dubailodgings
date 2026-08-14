import httpClient from "./httpClient";

export interface AuthUser {
  id: string | number;
  name: string;
  email: string;
  role?: string;
}

export interface AuthResponse {
  data: {
    token: string;
    user: AuthUser;
  };
}

export const registerUser = (data: { name: string; email: string; password: string }) =>
  httpClient.post<AuthResponse["data"]>("/register", data);

export const loginUser = (data: { email: string; password: string }) =>
  httpClient.post<AuthResponse["data"]>("/login", data);

export const getUser = () => httpClient.get<AuthUser>("/user");

export const logoutUser = () => httpClient.post("/logout");