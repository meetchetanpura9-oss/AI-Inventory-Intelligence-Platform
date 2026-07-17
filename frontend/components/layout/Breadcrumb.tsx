"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

export function Breadcrumb() {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);
  const formatSegment = (segment: string) =>
    segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  return (
    <nav className="flex min-w-0 items-center gap-1.5 text-xs text-[#94a3b8]" aria-label="Breadcrumb">
      <Link href="/dashboard" className="flex shrink-0 items-center gap-1 transition-colors hover:text-white">
        <Home className="size-3.5" />
        <span className="sr-only">Dashboard</span>
      </Link>
      {pathSegments.map((segment, index) => {
        const url = `/${pathSegments.slice(0, index + 1).join("/")}`;
        const isLast = index === pathSegments.length - 1;
        const displayName = formatSegment(segment);

        return (
          <React.Fragment key={url}>
            <ChevronRight className="size-3 shrink-0 text-[#64748b]" />
            {isLast ? (
              <span className="truncate font-semibold text-white">{displayName}</span>
            ) : (
              <Link href={url} className="transition-colors hover:text-white">
                {displayName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
