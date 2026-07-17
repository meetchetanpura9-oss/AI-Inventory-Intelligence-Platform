import React, { useState, useEffect } from "react";
import { Search, RotateCw, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedRole: string;
  onRoleChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  onRefresh: () => void;
  onCreateUserClick: () => void;
  canCreate?: boolean;
}

export function UserToolbar({
  searchQuery,
  onSearchChange,
  selectedRole,
  onRoleChange,
  selectedStatus,
  onStatusChange,
  onRefresh,
  onCreateUserClick,
  canCreate = false,
}: UserToolbarProps) {
  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Implement 500ms debounce for search query
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localSearch);
    }, 500);
    return () => clearTimeout(timer);
  }, [localSearch, onSearchChange]);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  const roles = ["All", "Admin", "Manager", "Staff", "Viewer"];
  const statuses = ["All", "Active", "Inactive"];

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card/25 p-5 shadow-sm backdrop-blur-md md:flex-row md:items-end md:justify-between select-none">
      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end flex-1 max-w-4xl">
        {/* Search */}
        <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">
            Search User
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#94a3b8]" />
            <input
              type="text"
              placeholder="Search name or email..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-4 text-sm text-foreground placeholder-[#94a3b8] outline-none transition focus:border-primary"
            />
          </div>
        </div>

        {/* Role filter */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">
            Role Filter
          </label>
          <select
            value={selectedRole}
            onChange={(e) => onRoleChange(e.target.value)}
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-primary cursor-pointer hover:bg-muted/40 font-medium"
          >
            {roles.map((r) => (
              <option key={r} value={r}>
                {r === "All" ? "All Roles" : r}
              </option>
            ))}
          </select>
        </div>

        {/* Status filter */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">
            Status Filter
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-primary cursor-pointer hover:bg-muted/40 font-medium"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s === "All" ? "All Statuses" : s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-2 mt-4 md:mt-0 shrink-0">
        <Button
          variant="outline"
          onClick={onRefresh}
          className="h-10 border-border hover:bg-muted font-medium text-xs px-3.5 gap-1.5"
          title="Refresh Data"
        >
          <RotateCw className="size-4" />
          <span>Refresh</span>
        </Button>
        {canCreate && (
          <Button
            onClick={onCreateUserClick}
            className="h-10 font-semibold text-xs px-4 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <UserPlus className="size-4.5" />
            <span>Create User</span>
          </Button>
        )}
      </div>
    </div>
  );
}

export default UserToolbar;
