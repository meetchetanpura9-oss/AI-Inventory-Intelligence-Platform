import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth-store";
import { profileService } from "../services/profileService";
import type { ChangePasswordRequest } from "@/types/auth";

export function useProfile() {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

  const profileQuery = useQuery({
    queryKey: ["userProfile"],
    queryFn: () => profileService.getProfile(),
  });

  const activityQuery = useQuery({
    queryKey: ["profileActivity"],
    queryFn: () => profileService.getLoginActivity(),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    queryClient.invalidateQueries({ queryKey: ["currentUser"] });
  };

  const updateMutation = useMutation({
    mutationFn: (payload: { name: string; phone: string; avatar?: string }) =>
      profileService.updateProfile(payload.name, payload.phone, payload.avatar),
    onSuccess: (updated) => {
      invalidate();
      setUser({
        id: updated.id,
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
        role: updated.role as any,
        is_active: updated.status === "Active",
        created_at: updated.created_at,
        avatar: updated.avatar,
      } as any);
    },
  });

  const passwordMutation = useMutation({
    mutationFn: (payload: ChangePasswordRequest) => profileService.changePassword(payload),
    onSuccess: () => {
      invalidate();
    },
  });

  return {
    profile: profileQuery.data,
    activities: activityQuery.data ?? [],
    isLoading: profileQuery.isLoading || activityQuery.isLoading,
    isError: profileQuery.isError || activityQuery.isError,
    error: profileQuery.error || activityQuery.error,
    refetch: () => {
      profileQuery.refetch();
      activityQuery.refetch();
    },
    updateProfile: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    changePassword: passwordMutation.mutateAsync,
    isChangingPassword: passwordMutation.isPending,
  };
}
export default useProfile;
