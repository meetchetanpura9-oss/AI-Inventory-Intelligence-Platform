"use client";

import { useState, useEffect } from "react";
import type { Product } from "@/types/product";
import { getProducts } from "@/services/product";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        setIsLoading(true);
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load products"));
      } finally {
        setIsLoading(false);
      }
    }

    loadProducts();
  }, []);

  return {
    products,
    isLoading,
    error,
  };
}
export default useProducts;
