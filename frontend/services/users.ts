import { api } from "./api";
import type { Role } from "@/constants/roles";
import type { UserStatistics } from "@/types/user";

export interface UserResponse {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  role: Role;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserListResponse {
  total: number;
  page: number;
  limit: number;
  users: UserResponse[];
}

export interface UserUpdatePayload {
  full_name?: string;
  email?: string;
  phone?: string;
}

export async function getUsers(params?: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  active?: boolean;
  sort?: string;
  order?: "asc" | "desc";
}): Promise<UserListResponse> {
  const response = await api.get<UserListResponse>("/users", { params });
  return response.data;
}

export async function getUserStatistics(): Promise<UserStatistics> {
  const response = await api.get<UserStatistics>("/users/statistics");
  return response.data;
}

export async function getUser(userId: number): Promise<UserResponse> {
  const response = await api.get<UserResponse>(`/users/${userId}`);
  return response.data;
}

export async function updateUser(userId: number, payload: UserUpdatePayload): Promise<UserResponse> {
  const response = await api.put<UserResponse>(`/users/${userId}`, payload);
  return response.data;
}

export async function changeUserRole(userId: number, role: Role): Promise<UserResponse> {
  const response = await api.patch<UserResponse>(`/users/${userId}/role`, { role });
  return response.data;
}

export async function activateUser(userId: number): Promise<UserResponse> {
  const response = await api.patch<UserResponse>(`/users/${userId}/activate`);
  return response.data;
}

export async function deactivateUser(userId: number): Promise<UserResponse> {
  const response = await api.patch<UserResponse>(`/users/${userId}/deactivate`);
  return response.data;
}

export async function deleteUser(userId: number): Promise<{ message: string }> {
  const response = await api.delete<{ message: string }>(`/users/${userId}`);
  return response.data;
}
