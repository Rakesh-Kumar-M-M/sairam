import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { RegistrationStatus } from '@shared/schema';

export function useRegistrationStatus() {
  const queryClient = useQueryClient();

  // Query to get current registration status
  const {
    data: status,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['registrationStatus'],
    queryFn: async (): Promise<RegistrationStatus> => {
      const response = await apiRequest('GET', '/api/registration-status');
      const result = await response.json();
      return result.status;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });

  // Mutation to update registration status
  const updateStatusMutation = useMutation({
    mutationFn: async (newStatus: Partial<RegistrationStatus>) => {
      const response = await apiRequest('POST', '/api/registration-status', newStatus);
      const result = await response.json();
      return result.status;
    },
    onSuccess: () => {
      // Invalidate and refetch the status
      queryClient.invalidateQueries({ queryKey: ['registrationStatus'] });
    },
  });

  // Check if registration is currently open
  const isRegistrationOpen = status?.isOpen ?? true; // Default to open if no status

  return {
    status,
    isLoading,
    error,
    isRegistrationOpen,
    updateStatus: updateStatusMutation.mutate,
    isUpdating: updateStatusMutation.isPending,
    refetch
  };
}
