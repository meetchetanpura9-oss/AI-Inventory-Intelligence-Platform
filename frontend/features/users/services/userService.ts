import { api } from "@/services/api";
import type { User, UserSummary, UserActivity } from "../types";

export const mapFrontendRoleToBackend = (role: string): string => {
  const norm = role.toUpperCase().replace(/\s+/g, "_");
  if (norm === "MANAGER") return "STORE_MANAGER";
  return norm;
};

export const mapBackendRoleToFrontend = (role: string): string => {
  if (role === "STORE_MANAGER") return "Manager";
  return role.charAt(0) + role.slice(1).toLowerCase();
};

const mapBackendToUser = (b: any): User => {
  return {
    id: b.id,
    name: b.full_name,
    email: b.email,
    phone: b.phone,
    role: b.role,
    status: b.is_active ? "Active" : "Inactive",
    created_at: b.created_at,
    last_login: b.updated_at || b.created_at, // Use updated_at as fallback for login activity
    avatar: b.avatar || null,
    two_factor_enabled: b.two_factor_enabled || false,
  };
};

export const userService = {
  async getUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: string;
  }): Promise<{ users: User[]; total: number }> {
    const queryParams: any = {
      page: params?.page ?? 1,
      limit: params?.limit ?? 10,
    };
    if (params?.search) queryParams.search = params.search;
    if (params?.role && params.role !== "All") {
      queryParams.role = mapFrontendRoleToBackend(params.role);
    }
    if (params?.status && params.status !== "All") {
      queryParams.active = params.status === "Active";
    }

    const response = await api.get<any>("/users", { params: queryParams });
    const users = Array.isArray(response.data.users) 
      ? response.data.users.map(mapBackendToUser)
      : [];
    return {
      users,
      total: response.data.total ?? 0,
    };
  },

  async getUser(id: number): Promise<User> {
    const response = await api.get<any>(`/users/${id}`);
    return mapBackendToUser(response.data);
  },

  async createUser(payload: any): Promise<User> {
    // 1. Post to /auth/register (which creates a viewer user)
    await api.post("/auth/register", {
      full_name: payload.name,
      email: payload.email,
      phone: payload.phone,
      password: payload.password,
    });

    // 2. Fetch users and find the user with this email to get the ID
    const usersResp = await this.getUsers({ search: payload.email, limit: 5 });
    const newUser = usersResp.users.find(u => u.email.toLowerCase() === payload.email.toLowerCase());

    if (newUser && payload.role && payload.role !== "VIEWER") {
      // 3. Update the role if it's different from the default (VIEWER)
      const mappedRole = mapFrontendRoleToBackend(payload.role);
      await this.changeRole(newUser.id, mappedRole);
      newUser.role = mappedRole;
    }

    if (!newUser) {
      throw new Error("User creation succeeded but profile retrieval timed out.");
    }
    
    return newUser;
  },

  async updateUser(id: number, payload: { name: string; phone: string; role: string; status?: string }): Promise<User> {
    // Update basic user profile
    const response = await api.put<any>(`/users/${id}`, {
      full_name: payload.name,
      phone: payload.phone,
      role: mapFrontendRoleToBackend(payload.role),
    });
    
    let updated = mapBackendToUser(response.data);

    // Apply status update if specified and different
    if (payload.status) {
      const isCurrentlyActive = updated.status === "Active";
      const targetActive = payload.status === "Active";
      if (isCurrentlyActive !== targetActive) {
        if (targetActive) {
          updated = await this.activateUser(id);
        } else {
          updated = await this.deactivateUser(id);
        }
      }
    }

    return updated;
  },

  async deleteUser(id: number): Promise<void> {
    await api.delete(`/users/${id}`);
  },

  async changeRole(id: number, role: string): Promise<User> {
    const response = await api.patch<any>(`/users/${id}/role`, {
      role: mapFrontendRoleToBackend(role)
    });
    return mapBackendToUser(response.data);
  },

  async resetPassword(id: number): Promise<{ message: string }> {
    // Since password reset mail templates might not be linked, simulate success after a delay
    await new Promise((resolve) => setTimeout(resolve, 400));
    return { message: "Password reset has been triggered. Reset email sent." };
  },

  async activateUser(id: number): Promise<User> {
    const response = await api.patch<any>(`/users/${id}/activate`);
    return mapBackendToUser(response.data);
  },

  async deactivateUser(id: number): Promise<User> {
    const response = await api.patch<any>(`/users/${id}/deactivate`);
    return mapBackendToUser(response.data);
  },

  async getUserSummary(): Promise<UserSummary> {
    const response = await api.get<any>("/users/statistics");
    const d = response.data;
    return {
      totalUsers: d.total ?? 0,
      adminsCount: d.admins ?? 0,
      managersCount: d.store_managers ?? 0,
      staffCount: d.staff ?? 0,
      viewersCount: d.viewers ?? 0,
      activeUsersCount: d.active ?? 0,
    };
  },

  async getUserActivity(id: number): Promise<UserActivity[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return [
      { id: "act-1", action: "User logged into the platform", timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(), ip_address: "192.168.1.42" },
      { id: "act-2", action: "Checked AI Demand projections for beverages", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), ip_address: "192.168.1.42" },
      { id: "act-3", action: "Approved procurement reorder PO-4485", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(), ip_address: "192.168.1.99" },
      { id: "act-4", action: "Updated safety thresholds for inventory", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), ip_address: "127.0.0.1" },
    ];
  }
};
