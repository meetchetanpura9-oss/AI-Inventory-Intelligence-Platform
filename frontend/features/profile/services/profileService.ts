import { authService } from "@/services/auth";
import { getStoredUser, setStoredUser } from "@/utils/storage";
import type { UserProfile, ProfileActivity } from "../types";

export const profileService = {
  async getProfile(): Promise<UserProfile> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const stored = getStoredUser<any>();
    if (!stored) {
      throw new Error("No user profile session active.");
    }
    
    return {
      id: stored.id ?? 1,
      name: stored.name || stored.full_name || "John Doe",
      email: stored.email || "john@company.com",
      phone: stored.phone || "+919876543210",
      role: stored.role || "VIEWER",
      status: stored.is_active !== false ? "Active" : "Inactive",
      created_at: stored.created_at || new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
      last_login: stored.last_login || new Date().toISOString(),
      last_password_change: stored.last_password_change || new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
      avatar: stored.avatar || undefined,
      department: "Logistics Operations",
      is_online: true,
    };
  },

  async updateProfile(name: string, phone: string, avatar?: string): Promise<UserProfile> {
    const updated = await authService.updateProfile({
      full_name: name,
      email: getStoredUser<any>()?.email || "",
      phone: phone,
    });
    
    const userWithAvatar = {
      ...updated,
      avatar: avatar !== undefined ? avatar : (getStoredUser<any>()?.avatar || undefined)
    };

    setStoredUser(userWithAvatar);
    return this.getProfile();
  },

  async changePassword(payload: any): Promise<void> {
    await authService.changePassword(payload);
    const stored = getStoredUser<any>();
    if (stored) {
      stored.last_password_change = new Date().toISOString();
      setStoredUser(stored);
    }
  },

  async getLoginActivity(): Promise<ProfileActivity[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return [
      {
        id: "log-1",
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        browser: "Chrome 126.0",
        device: "Windows Desktop",
        ip_address: "192.168.1.10",
        status: "Success",
      },
      {
        id: "log-2",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        browser: "Firefox 127.0",
        device: "Windows Desktop",
        ip_address: "192.168.1.10",
        status: "Success",
      },
      {
        id: "log-3",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
        browser: "Safari Mobile",
        device: "iPhone 15",
        ip_address: "172.56.21.90",
        status: "Success",
      },
      {
        id: "log-4",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
        browser: "Chrome Mobile",
        device: "Android Phone",
        ip_address: "172.56.21.92",
        status: "Failed",
      }
    ];
  }
};
export default profileService;
