import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "../services/userService";

export function useUser(userId?: number | null) {
  const queryClient = useQueryClient();

  const userDetailQuery = useQuery({
    queryKey: ["userDetail", userId],
    queryFn: () => userService.getUser(userId!),
    enabled: !!userId,
  });

  const activityQuery = useQuery({
    queryKey: ["userActivity", userId],
    queryFn: () => userService.getUserActivity(userId!),
    enabled: !!userId,
  });

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ["users"] });
    queryClient.invalidateQueries({ queryKey: ["usersSummary"] });
    if (userId) {
      queryClient.invalidateQueries({ queryKey: ["userDetail", userId] });
      queryClient.invalidateQueries({ queryKey: ["userActivity", userId] });
    }
  };

  const createMutation = useMutation({
    mutationFn: (payload: any) => userService.createUser(payload),
    onSuccess: invalidateAll,
  });

  const updateMutation = useMutation({
    mutationFn: (payload: { id: number; name: string; phone: string; role: string; status?: string }) =>
      userService.updateUser(payload.id, payload),
    onSuccess: invalidateAll,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => userService.deleteUser(id),
    onSuccess: invalidateAll,
  });

  const roleMutation = useMutation({
    mutationFn: (payload: { id: number; role: string }) => userService.changeRole(payload.id, payload.role),
    onSuccess: invalidateAll,
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (id: number) => userService.resetPassword(id),
  });

  const activateMutation = useMutation({
    mutationFn: (id: number) => userService.activateUser(id),
    onSuccess: invalidateAll,
  });

  const deactivateMutation = useMutation({
    mutationFn: (id: number) => userService.deactivateUser(id),
    onSuccess: invalidateAll,
  });

  return {
    userDetail: userDetailQuery.data,
    activities: activityQuery.data ?? [],
    isLoadingDetail: userDetailQuery.isLoading,
    isLoadingActivity: activityQuery.isLoading,
    createMutate: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateMutate: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteMutate: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    roleMutate: roleMutation.mutateAsync,
    isChangingRole: roleMutation.isPending,
    resetPasswordMutate: resetPasswordMutation.mutateAsync,
    isResettingPassword: resetPasswordMutation.isPending,
    activateMutate: activateMutation.mutateAsync,
    isActivating: activateMutation.isPending,
    deactivateMutate: deactivateMutation.mutateAsync,
    isDeactivating: deactivateMutation.isPending,
  };
}
export default useUser;
