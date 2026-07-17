import React, { useState } from "react";
import { Eye, Edit2, Trash2, Key, ToggleLeft, ToggleRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { User } from "../types";
import { UserRoleBadge } from "./UserRoleBadge";
import { UserStatusBadge } from "./UserStatusBadge";

interface UserTableProps {
  users: User[];
  total: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onResetPassword: (user: User) => void;
  onToggleStatus: (user: User) => void;
  canManage?: boolean;
}

export function UserTable({
  users,
  total,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onView,
  onEdit,
  onDelete,
  onResetPassword,
  onToggleStatus,
  canManage = false,
}: UserTableProps) {
  const totalPages = Math.ceil(total / pageSize);
  const startRow = (currentPage - 1) * pageSize + 1;
  const endRow = Math.min(currentPage * pageSize, total);

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric"
      });
    } catch {
      return dateString;
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-4">
      {/* Desktop view */}
      <div className="hidden lg:block overflow-hidden rounded-2xl border border-border bg-card shadow-lg select-none">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-[#0f172a] text-[#94a3b8] uppercase font-semibold text-xs tracking-wider border-b border-border/80">
              <tr>
                <th className="px-5 py-4 font-semibold text-foreground w-14">Avatar</th>
                <th className="px-5 py-4 font-semibold text-foreground">Name</th>
                <th className="px-5 py-4 font-semibold text-foreground">Email</th>
                <th className="px-5 py-4 font-semibold text-foreground">Phone</th>
                <th className="px-5 py-4 font-semibold text-foreground">Role</th>
                <th className="px-5 py-4 font-semibold text-foreground">Status</th>
                <th className="px-5 py-4 font-semibold text-foreground">Last Login</th>
                <th className="px-5 py-4 font-semibold text-foreground">Created Date</th>
                <th className="px-5 py-4 font-semibold text-foreground text-right w-44">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {users.map((item, idx) => (
                <tr
                  key={item.id}
                  className={`transition hover:bg-muted/40 ${
                    idx % 2 === 0 ? "bg-card/45" : "bg-card"
                  }`}
                >
                  {/* Avatar */}
                  <td className="px-5 py-3.5">
                    {item.avatar ? (
                      <img 
                        src={item.avatar} 
                        alt={item.name} 
                        className="size-8.5 rounded-full object-cover border border-border"
                      />
                    ) : (
                      <div className="size-8.5 rounded-full bg-gradient-to-tr from-[#3b82f6]/20 to-[#14b8a6]/20 text-primary flex items-center justify-center font-bold text-xs border border-primary/20">
                        {getInitials(item.name)}
                      </div>
                    )}
                  </td>

                  {/* Name */}
                  <td className="px-5 py-3.5 font-bold text-white max-w-[150px] truncate">
                    {item.name}
                  </td>

                  {/* Email */}
                  <td className="px-5 py-3.5 font-medium text-[#e2e8f0]">
                    {item.email}
                  </td>

                  {/* Phone */}
                  <td className="px-5 py-3.5 font-mono text-xs text-[#94a3b8]">
                    {item.phone || "-"}
                  </td>

                  {/* Role */}
                  <td className="px-5 py-3.5">
                    <UserRoleBadge role={item.role} />
                  </td>

                  {/* Status */}
                  <td className="px-5 py-3.5">
                    <UserStatusBadge status={item.status} />
                  </td>

                  {/* Last Login */}
                  <td className="px-5 py-3.5 text-xs text-[#94a3b8]">
                    {formatDate(item.last_login || "")}
                  </td>

                  {/* Created Date */}
                  <td className="px-5 py-3.5 text-xs text-[#64748b] font-medium">
                    {formatDate(item.created_at)}
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onView(item)}
                        title="View User Details"
                        className="inline-flex size-8 items-center justify-center rounded-lg border border-border bg-card text-[#94a3b8] transition hover:bg-muted hover:text-white"
                      >
                        <Eye className="size-4" />
                      </button>
                      
                      {canManage && (
                        <>
                          <button
                            onClick={() => onEdit(item)}
                            title="Edit User"
                            className="inline-flex size-8 items-center justify-center rounded-lg border border-border bg-card text-primary transition hover:bg-primary/10 hover:text-white"
                          >
                            <Edit2 className="size-3.5" />
                          </button>
                          <button
                            onClick={() => onToggleStatus(item)}
                            title={item.status === "Active" ? "Deactivate User" : "Activate User"}
                            className={`inline-flex size-8 items-center justify-center rounded-lg border border-border bg-card transition ${
                              item.status === "Active" 
                                ? "text-amber-500 hover:bg-amber-500/10" 
                                : "text-emerald-500 hover:bg-emerald-500/10"
                            }`}
                          >
                            {item.status === "Active" ? <ToggleRight className="size-4.5" /> : <ToggleLeft className="size-4.5" />}
                          </button>
                          <button
                            onClick={() => onResetPassword(item)}
                            title="Reset Password"
                            className="inline-flex size-8 items-center justify-center rounded-lg border border-border bg-card text-[#14b8a6] transition hover:bg-[#14b8a6]/10 hover:text-white"
                          >
                            <Key className="size-3.5" />
                          </button>
                          <button
                            onClick={() => onDelete(item)}
                            title="Delete User"
                            className="inline-flex size-8 items-center justify-center rounded-lg border border-border bg-card text-rose-500 transition hover:bg-rose-500/10 hover:text-white"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile list view */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:hidden select-none">
        {users.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4.5 shadow-lg hover:border-primary/40 transition"
          >
            {/* Header info */}
            <div className="flex items-start justify-between gap-3 border-b border-border/40 pb-2.5">
              <div className="flex items-center gap-2.5 min-w-0">
                {item.avatar ? (
                  <img src={item.avatar} alt={item.name} className="size-9 rounded-full object-cover" />
                ) : (
                  <div className="size-9 rounded-full bg-gradient-to-tr from-[#3b82f6]/20 to-[#14b8a6]/20 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                    {getInitials(item.name)}
                  </div>
                )}
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-white leading-snug truncate">{item.name}</h4>
                  <span className="text-[10px] text-[#94a3b8] block truncate">{item.email}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <UserRoleBadge role={item.role} />
                <UserStatusBadge status={item.status} />
              </div>
            </div>

            {/* Info details */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs py-0.5">
              <div>
                <span className="text-[#64748b] block text-[9px] uppercase font-bold tracking-wider">Phone</span>
                <span className="text-white font-semibold font-mono">{item.phone || "-"}</span>
              </div>
              <div>
                <span className="text-[#64748b] block text-[9px] uppercase font-bold tracking-wider">Last Login</span>
                <span className="text-white font-medium">{formatDate(item.last_login || "")}</span>
              </div>
            </div>

            {/* Actions toolbar */}
            <div className="pt-2 border-t border-border/40 flex items-center justify-end gap-1.5">
              <button
                onClick={() => onView(item)}
                className="inline-flex h-8 items-center gap-1 px-2.5 rounded-lg border border-border text-xs text-[#94a3b8] hover:bg-muted font-semibold transition mr-auto"
              >
                <Eye className="size-3.5" />
                View Profile
              </button>

              {canManage && (
                <>
                  <button
                    onClick={() => onEdit(item)}
                    className="inline-flex size-8 items-center justify-center rounded-lg border border-border text-primary hover:bg-primary/10 transition"
                    title="Edit"
                  >
                    <Edit2 className="size-3.5" />
                  </button>
                  <button
                    onClick={() => onToggleStatus(item)}
                    className={`inline-flex size-8 items-center justify-center rounded-lg border border-border transition ${
                      item.status === "Active" ? "text-amber-500" : "text-emerald-500"
                    }`}
                    title={item.status === "Active" ? "Deactivate" : "Activate"}
                  >
                    {item.status === "Active" ? <ToggleRight className="size-4" /> : <ToggleLeft className="size-4" />}
                  </button>
                  <button
                    onClick={() => onResetPassword(item)}
                    className="inline-flex size-8 items-center justify-center rounded-lg border border-border text-[#14b8a6] transition"
                    title="Reset Password"
                  >
                    <Key className="size-3.5" />
                  </button>
                  <button
                    onClick={() => onDelete(item)}
                    className="inline-flex size-8 items-center justify-center rounded-lg border border-border text-rose-500 hover:bg-rose-500/10 transition"
                    title="Delete"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination component */}
      {totalPages > 0 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-border/40 pt-4 select-none">
          <div className="flex items-center gap-3 text-xs text-[#94a3b8]">
            <span>
              Showing <span className="font-semibold text-white">{startRow}</span>–
              <span className="font-semibold text-white">{endRow}</span> of{" "}
              <span className="font-semibold text-white">{total}</span> users
            </span>
            <div className="flex items-center gap-1.5">
              <span>Page size:</span>
              <select
                value={pageSize}
                onChange={(e) => onPageSizeChange(parseInt(e.target.value, 10))}
                className="h-8 rounded border border-border bg-card px-1 text-xs text-foreground outline-none cursor-pointer"
              >
                {[10, 25, 50].map((size) => (
                  <option key={size} value={size}>
                    {size} rows
                  </option>
                ))}
              </select>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="inline-flex size-8 items-center justify-center rounded-lg border border-border bg-card text-[#94a3b8] transition hover:bg-muted disabled:opacity-40"
              >
                <ChevronLeft className="size-4" />
              </button>
              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum)}
                    className={`inline-flex size-8 items-center justify-center rounded-lg text-xs font-semibold border transition ${
                      currentPage === pageNum
                        ? "bg-primary border-primary text-primary-foreground shadow"
                        : "border-border bg-card text-[#94a3b8] hover:bg-muted hover:text-white"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="inline-flex size-8 items-center justify-center rounded-lg border border-border bg-card text-[#94a3b8] transition hover:bg-muted disabled:opacity-40"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default UserTable;
