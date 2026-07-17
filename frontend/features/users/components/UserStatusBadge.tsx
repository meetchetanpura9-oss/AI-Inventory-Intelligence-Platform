import React from "react";
import { Badge } from "@/components/ui/badge";

interface UserStatusBadgeProps {
  status: "Active" | "Inactive" | string;
}

export function UserStatusBadge({ status }: UserStatusBadgeProps) {
  const norm = status.toLowerCase();

  if (norm === "active") {
    return (
      <Badge className="bg-[#22c55e]/10 text-[#86efac] border-[#22c55e]/20 hover:bg-[#22c55e]/15 font-semibold text-xs py-0.5 px-2">
        <span className="mr-1.5 inline-block text-[8px]">🟢</span>
        Active
      </Badge>
    );
  }

  return (
    <Badge className="bg-[#ef4444]/10 text-[#fca5a5] border-[#ef4444]/20 hover:bg-[#ef4444]/15 font-semibold text-xs py-0.5 px-2">
      <span className="mr-1.5 inline-block text-[8px]">🔴</span>
      Inactive
    </Badge>
  );
}

export default UserStatusBadge;
