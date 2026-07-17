import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "../services/productService";
import { toast } from "sonner";
import { getFriendlyErrorMessage } from "@/utils/api-error";

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => productService.deleteProduct(id),
    onSuccess: () => {
      toast.success("Product deleted successfully!");
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
export default useDeleteProduct;
