import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export type AppRole = 'admin' | 'manager' | 'staff';

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

export interface UserWithRoles {
  id: string;
  email: string;
  roles: AppRole[];
}

export function useUserRoles() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch current user's roles
  const { data: currentUserRoles, isLoading: rolesLoading } = useQuery({
    queryKey: ['user-roles', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data as UserRole[];
    },
    enabled: !!user?.id,
  });

  // Check if user has a specific role
  const hasRole = (role: AppRole): boolean => {
    return currentUserRoles?.some(ur => ur.role === role) ?? false;
  };

  const isAdmin = hasRole('admin');
  const isManager = hasRole('manager');
  const isAdminOrManager = isAdmin || isManager;

  // Fetch all users with their roles (admin only)
  const { data: allUsersWithRoles, isLoading: usersLoading } = useQuery({
    queryKey: ['all-users-roles'],
    queryFn: async () => {
      // First get all user_roles
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');
      
      if (rolesError) throw rolesError;

      // Group roles by user_id
      const userRolesMap = new Map<string, AppRole[]>();
      roles?.forEach(role => {
        const existing = userRolesMap.get(role.user_id) || [];
        userRolesMap.set(role.user_id, [...existing, role.role as AppRole]);
      });

      // Get user details from profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, email, full_name');
      
      if (profilesError) throw profilesError;

      return profiles?.map(profile => ({
        id: profile.user_id,
        email: profile.email || '',
        fullName: profile.full_name || '',
        roles: userRolesMap.get(profile.user_id) || [],
      })) || [];
    },
    enabled: isAdmin,
  });

  // Add role to user
  const addRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: AppRole }) => {
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role, created_by: user?.id });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-users-roles'] });
      toast.success('Role added successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to add role: ${error.message}`);
    },
  });

  // Remove role from user
  const removeRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: AppRole }) => {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', role);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-users-roles'] });
      toast.success('Role removed successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to remove role: ${error.message}`);
    },
  });

  return {
    currentUserRoles,
    rolesLoading,
    hasRole,
    isAdmin,
    isManager,
    isAdminOrManager,
    allUsersWithRoles,
    usersLoading,
    addRole: addRoleMutation.mutate,
    removeRole: removeRoleMutation.mutate,
  };
}
