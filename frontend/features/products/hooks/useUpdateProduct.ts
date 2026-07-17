import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "../services/productService";
import { toast } from "sonner";
import { getFriendlyErrorMessage } from "@/utils/api-error";
import type { UpdateProduct } from "../types";

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateProduct }) =>
      productService.updateProduct(id, payload),
    onSuccess: (updatedProduct) => {
      toast.success(`Product "${updatedProduct.product_name}" updated successfully!`);
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
export default useUpdateProduct;
