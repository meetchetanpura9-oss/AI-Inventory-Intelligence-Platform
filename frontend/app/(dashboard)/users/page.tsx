"use client";

import React, { useState } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/PageHeader";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth-store";

// Import Custom Users Module Elements
import { useUsers } from "@/features/users/hooks/useUsers";
import { useUser } from "@/features/users/hooks/useUser";
import { UserSummaryCards } from "@/features/users/components/UserSummaryCards";
import { UserToolbar } from "@/features/users/components/UserToolbar";
import { UserTable } from "@/features/users/components/UserTable";
import { UserDrawer } from "@/features/users/components/UserDrawer";
import { CreateUserDialog } from "@/features/users/components/CreateUserDialog";
import { EditUserDialog } from "@/features/users/components/EditUserDialog";
import { DeleteUserDialog } from "@/features/users/components/DeleteUserDialog";
import { ResetPasswordDialog } from "@/features/users/components/ResetPasswordDialog";
import { LoadingSkeleton } from "@/features/users/components/LoadingSkeleton";
import { EmptyState } from "@/features/users/components/EmptyState";
import type { User } from "@/features/users/types";

export default function UsersPage() {
  const { user: currentUser } = useAuthStore();

  // Role authorization checks (Step 22)
  const isAdmin = currentUser?.role === "ADMIN";

  // State Management for Filters & Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal Dialog Open/Close States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Selected User states for drawer/dialogs
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Fetch Users & summary metrics
  const {
    users,
    total,
    summary,
    isLoading,
    isError,
    refetch,
  } = useUsers({
    page: currentPage,
    limit: pageSize,
    search: searchQuery,
    role: selectedRole,
    status: selectedStatus,
  });

  // Individual user action mutators
  const {
    createMutate,
    isCreating,
    updateMutate,
    isUpdating,
    deleteMutate,
    isDeleting,
    resetPasswordMutate,
    isResettingPassword,
    activateMutate,
    deactivateMutate,
  } = useUser(selectedUser?.id);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleRoleChange = (val: string) => {
    setSelectedRole(val);
    setCurrentPage(1);
  };

  const handleStatusChange = (val: string) => {
    setSelectedStatus(val);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedRole("All");
    setSelectedStatus("All");
    setCurrentPage(1);
  };

  // Toggle User Status Activation/Deactivation
  const handleToggleStatus = async (user: User) => {
    if (!isAdmin) {
      toast.error("Only Administrators can modify user statuses.");
      return;
    }
    if (user.id === currentUser?.id) {
      toast.error("You cannot deactivate your own active session account.");
      return;
    }

    try {
      if (user.status === "Active") {
        await deactivateMutate(user.id);
        toast.success(`Account status for "${user.name}" set to Inactive.`);
      } else {
        await activateMutate(user.id);
        toast.success(`Account status for "${user.name}" set to Active.`);
      }
      refetch();
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || err?.message || "Failed to update account status.");
    }
  };

  const handleTriggerView = (user: User) => {
    setSelectedUser(user);
    setIsDrawerOpen(true);
  };

  const handleTriggerEdit = (user: User) => {
    if (!isAdmin) {
      toast.error("Only Administrators can edit user details.");
      return;
    }
    setSelectedUser(user);
    setIsEditOpen(true);
  };

  const handleTriggerReset = (user: User) => {
    if (!isAdmin) {
      toast.error("Only Administrators can trigger password resets.");
      return;
    }
    setSelectedUser(user);
    setIsResetOpen(true);
  };

  const handleTriggerDelete = (user: User) => {
    if (!isAdmin) {
      toast.error("Only Administrators can delete user accounts.");
      return;
    }
    if (user.id === currentUser?.id) {
      toast.error("You cannot delete your own active session account.");
      return;
    }
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] border border-border bg-card rounded-2xl p-6 text-center space-y-4">
        <AlertTriangle className="size-12 text-[#ef4444]" />
        <h2 className="text-lg font-bold text-foreground">Unable to load users</h2>
        <p className="text-sm text-[#94a3b8]">Could not connect to FastAPI server. Please check backend connection.</p>
        <Button onClick={() => refetch()} size="sm" className="gap-2">
          <RefreshCw className="size-4" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users Management"
        subtitle="Manage access control credentials and role assignments for platform operators."
      />

      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <>
          {/* Summary KPI stats */}
          <UserSummaryCards summary={summary} />

          {/* Filters Toolbar */}
          <UserToolbar
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            selectedRole={selectedRole}
            onRoleChange={handleRoleChange}
            selectedStatus={selectedStatus}
            onStatusChange={handleStatusChange}
            onRefresh={refetch}
            onCreateUserClick={() => setIsCreateOpen(true)}
            canCreate={isAdmin} // Restricted to ADMIN only (Step 22)
          />

          {/* User list table */}
          {users.length === 0 ? (
            <EmptyState onClearFilters={handleClearFilters} />
          ) : (
            <UserTable
              users={users}
              total={total}
              currentPage={currentPage}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={handlePageSizeChange}
              onView={handleTriggerView}
              onEdit={handleTriggerEdit}
              onDelete={handleTriggerDelete}
              onResetPassword={handleTriggerReset}
              onToggleStatus={handleToggleStatus}
              canManage={isAdmin} // Restricted to ADMIN only (Step 22)
            />
          )}
        </>
      )}

      {/* Slide-over Profile Drawer */}
      <UserDrawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedUser(null);
        }}
        userId={selectedUser?.id ?? null}
      />

      {/* Dialog Modals */}
      <CreateUserDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={createMutate}
        isCreating={isCreating}
      />

      <EditUserDialog
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onSubmit={updateMutate}
        isUpdating={isUpdating}
      />

      <DeleteUserDialog
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onConfirm={deleteMutate}
        isDeleting={isDeleting}
      />

      <ResetPasswordDialog
        isOpen={isResetOpen}
        onClose={() => {
          setIsResetOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onConfirm={resetPasswordMutate}
        isResetting={isResettingPassword}
      />
    </div>
  );
}
