import { mockDashboard } from "../data/mockDashboard";
import type { DashboardSnapshot } from "../types/dashboard";

export async function getDashboardSnapshot(): Promise<DashboardSnapshot> {
  return mockDashboard;
}
