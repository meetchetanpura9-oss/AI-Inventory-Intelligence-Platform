import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsService } from "../services/settingsService";
import type { AppSettings } from "../types";

export function useSettings() {
  const queryClient = useQueryClient();

  const settingsQuery = useQuery({
    queryKey: ["appSettings"],
    queryFn: () => settingsService.getSettings(),
  });

  const sessionsQuery = useQuery({
    queryKey: ["sessionInfo"],
    queryFn: () => settingsService.getSessionInfo(),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["appSettings"] });
  };

  const updateMutation = useMutation({
    mutationFn: (settings: AppSettings) => settingsService.updateSettings(settings),
    onSuccess: invalidate,
  });

  const resetMutation = useMutation({
    mutationFn: () => settingsService.resetSettings(),
    onSuccess: invalidate,
  });

  const importMutation = useMutation({
    mutationFn: (fileContent: string) => settingsService.importSettings(fileContent),
    onSuccess: invalidate,
  });

  return {
    settings: settingsQuery.data,
    sessions: sessionsQuery.data ?? [],
    isLoading: settingsQuery.isLoading || sessionsQuery.isLoading,
    isError: settingsQuery.isError || sessionsQuery.isError,
    error: settingsQuery.error || sessionsQuery.error,
    refetch: () => {
      settingsQuery.refetch();
      sessionsQuery.refetch();
    },
    updateSettings: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    resetSettings: resetMutation.mutateAsync,
    isResetting: resetMutation.isPending,
    importSettings: importMutation.mutateAsync,
    isImporting: importMutation.isPending,
  };
}
export default useSettings;
