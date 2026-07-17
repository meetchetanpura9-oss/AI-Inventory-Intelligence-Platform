"use client";

import { useState, useEffect } from "react";
import type { Sale } from "@/types/sales";
import { getSales } from "@/services/sales";

export function useSales() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadSales() {
      try {
        setIsLoading(true);
        const data = await getSales();
        setSales(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load sales"));
      } finally {
        setIsLoading(false);
      }
    }

    loadSales();
  }, []);

  return {
    sales,
    isLoading,
    error,
  };
}
export default useSales;
