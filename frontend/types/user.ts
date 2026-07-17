import type { Role } from "@/constants/roles";

export interface User {
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

export interface UserUpdate {
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
}

export interface UserRoleUpdate {
  role: Role;
}

export interface UserListResponse {
  total: number;
  page: number;
  limit: number;
  users: User[];
}

export interface UserStatistics {
  total: number;
  active: number;
  inactive: number;
  admins: number;
  store_managers: number;
  staff: number;
  viewers: number;
}
