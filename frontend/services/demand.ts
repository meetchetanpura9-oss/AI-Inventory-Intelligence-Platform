import { api } from "./api";
import type { DemandRecord } from "@/types/analytics";

export async function getDemandData(city?: string, area?: string): Promise<DemandRecord[]> {
  const response = await api.get<DemandRecord[]>("/demand", {
    params: { city, area }
  });
  return response.data;
}

export async function calculateDemand(): Promise<{ status: string; records_calculated: number }> {
  const response = await api.post<{ status: string; records_calculated: number }>("/demand/calculate");
  return response.data;
}
