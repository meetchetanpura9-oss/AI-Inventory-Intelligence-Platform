export interface User {
  id: number;
  name: string; // Mapped from full_name
  email: string;
  phone: string;
  role: "ADMIN" | "STORE_MANAGER" | "STAFF" | "VIEWER" | string;
  status: "Active" | "Inactive"; // Mapped from is_active
  created_at: string;
  last_login?: string | null;
  avatar?: string | null;
  two_factor_enabled?: boolean;
}

export interface UserResponse {
  total: number;
  page: number;
  limit: number;
  users: User[];
}

export interface UserSummary {
  totalUsers: number;
  adminsCount: number;
  managersCount: number;
  staffCount: number;
  viewersCount: number;
  activeUsersCount: number;
}

export interface UserActivity {
  id: string;
  action: string;
  timestamp: string;
  ip_address?: string | null;
}
