import { useQuery } from "@tanstack/react-query";
import { transactionService } from "../services/transactionService";

export function useTransaction(id?: number | null) {
  return useQuery({
    queryKey: ["transaction", id],
    queryFn: () => transactionService.getTransaction(Number(id)),
    enabled: Boolean(id),
    staleTime: 30_000,
  });
}

export default useTransaction;
