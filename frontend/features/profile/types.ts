export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: "Active" | "Inactive";
  created_at: string;
  last_login?: string;
  last_password_change?: string;
  avatar?: string;
  department?: string;
  is_online: boolean;
}

export interface ProfileActivity {
  id: string;
  timestamp: string;
  browser: string;
  device: string;
  ip_address?: string;
  status: "Success" | "Failed";
}
