import { useQuery } from "@tanstack/react-query";
import { userService } from "../services/userService";

export interface UsersFilters {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
}

export function useUsers(filters?: UsersFilters) {
  const usersQuery = useQuery({
    queryKey: ["users", filters],
    queryFn: () => userService.getUsers(filters),
  });

  const summaryQuery = useQuery({
    queryKey: ["usersSummary"],
    queryFn: () => userService.getUserSummary(),
  });

  return {
    users: usersQuery.data?.users ?? [],
    total: usersQuery.data?.total ?? 0,
    summary: summaryQuery.data,
    isLoading: usersQuery.isLoading || summaryQuery.isLoading,
    isError: usersQuery.isError || summaryQuery.isError,
    error: usersQuery.error || summaryQuery.error,
    refetch: () => {
      usersQuery.refetch();
      summaryQuery.refetch();
    },
  };
}
