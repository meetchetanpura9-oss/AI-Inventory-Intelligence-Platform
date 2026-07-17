import React from "react";
import { Users, ShieldAlert, Users2, UserCheck } from "lucide-react";
import { MetricCard } from "@/components/cards/MetricCard";
import type { UserSummary } from "../types";

interface UserSummaryCardsProps {
  summary?: UserSummary;
}

export function UserSummaryCards({ summary }: UserSummaryCardsProps) {
  const total = summary?.totalUsers ?? 0;
  const admins = summary?.adminsCount ?? 0;
  const managersAndStaff = (summary?.managersCount ?? 0) + (summary?.staffCount ?? 0);
  const active = summary?.activeUsersCount ?? 0;

  const cards = [
    {
      title: "Total Users",
      value: total.toLocaleString(),
      icon: <Users className="size-5 text-[#3b82f6]" />,
      timeframe: "Total registered accounts",
    },
    {
      title: "Admins",
      value: admins.toLocaleString(),
      icon: <ShieldAlert className="size-5 text-[#ef4444]" />,
      timeframe: "Full access administrators",
    },
    {
      title: "Managers & Staff",
      value: managersAndStaff.toLocaleString(),
      icon: <Users2 className="size-5 text-[#eab308]" />,
      timeframe: "Operations and floor team",
    },
    {
      title: "Active Users",
      value: active.toLocaleString(),
      icon: <UserCheck className="size-5 text-[#22c55e]" />,
      timeframe: "Active system operators",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => (
        <MetricCard
          key={c.title}
          title={c.title}
          value={c.value}
          icon={c.icon}
          timeframe={c.timeframe}
        />
      ))}
    </div>
  );
}

export default UserSummaryCards;
