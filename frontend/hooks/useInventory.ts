"use client";

import { useState, useEffect } from "react";
import type { InventoryItem } from "@/types/inventory";
import { getInventory } from "@/services/inventory";

export function useInventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadInventory() {
      try {
        setIsLoading(true);
        const data = await getInventory();
        setInventory(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load inventory"));
      } finally {
        setIsLoading(false);
      }
    }

    loadInventory();
  }, []);

  return {
    inventory,
    isLoading,
    error,
  };
}
export default useInventory;
