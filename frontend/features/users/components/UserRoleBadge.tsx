import React from "react";
import { Badge } from "@/components/ui/badge";

interface UserRoleBadgeProps {
  role: "ADMIN" | "STORE_MANAGER" | "STAFF" | "VIEWER" | string;
}

export function UserRoleBadge({ role }: UserRoleBadgeProps) {
  const norm = role.toUpperCase();

  if (norm === "ADMIN") {
    return (
      <Badge className="bg-[#ef4444]/10 text-[#fca5a5] border-[#ef4444]/20 hover:bg-[#ef4444]/15 font-semibold text-xs py-0.5 px-2">
        <span className="mr-1.5 inline-block text-[10px]">🟥</span>
        Admin
      </Badge>
    );
  }

  if (norm === "STORE_MANAGER") {
    return (
      <Badge className="bg-[#3b82f6]/10 text-[#93c5fd] border-[#3b82f6]/20 hover:bg-[#3b82f6]/15 font-semibold text-xs py-0.5 px-2">
        <span className="mr-1.5 inline-block text-[10px]">🟦</span>
        Manager
      </Badge>
    );
  }

  if (norm === "STAFF") {
    return (
      <Badge className="bg-[#10b981]/10 text-[#6ee7b7] border-[#10b981]/20 hover:bg-[#10b981]/15 font-semibold text-xs py-0.5 px-2">
        <span className="mr-1.5 inline-block text-[10px]">🟩</span>
        Staff
      </Badge>
    );
  }

  return (
    <Badge className="bg-slate-500/10 text-slate-300 border-slate-500/20 hover:bg-slate-500/15 font-semibold text-xs py-0.5 px-2">
      <span className="mr-1.5 inline-block text-[10px]">⚪</span>
      Viewer
    </Badge>
  );
}

export default UserRoleBadge;
