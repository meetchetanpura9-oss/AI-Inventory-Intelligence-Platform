import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "../services/productService";
import { toast } from "sonner";
import { getFriendlyErrorMessage } from "@/utils/api-error";
import type { CreateProduct } from "../types";

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProduct) => productService.createProduct(payload),
    onSuccess: (newProduct) => {
      toast.success(`Product "${newProduct.product_name}" created successfully!`);
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (error) => {
      toast.error(getFriendlyErrorMessage(error));
    },
  });
}
