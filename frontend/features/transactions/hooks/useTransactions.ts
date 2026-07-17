import { useQuery } from "@tanstack/react-query";
import { transactionService } from "../services/transactionService";
import type { TransactionFilters } from "../types";

export function useTransactions(filters: TransactionFilters = {}) {
  return useQuery({
    queryKey: ["transactions", filters],
    queryFn: () => transactionService.getTransactionQuery(filters),
    staleTime: 30_000,
  });
}

export default useTransactions;
