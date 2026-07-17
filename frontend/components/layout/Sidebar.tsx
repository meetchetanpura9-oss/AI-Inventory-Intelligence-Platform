"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Boxes,
  ChevronsLeft,
  ChevronsRight,
  LogOut,
  X,
} from "lucide-react";

import { ROUTES } from "@/constants/routes";
import { canAccessNavigationItem, navigationItems } from "@/constants/navigation";
import { useAuthStore } from "@/store/auth-store";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isMobile?: boolean;
  onClose?: () => void;
  onNavigate?: () => void;
}

export function Sidebar({ isMobile = false, onClose, onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const showLabels = isMobile || !isCollapsed;
  const visibleNavigationItems = navigationItems.filter((item) =>
    canAccessNavigationItem(user?.role, item)
  );

  return (
    <motion.aside
      className={cn(
        "flex h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground shadow-2xl shadow-black/25",
        isMobile ? "fixed inset-y-0 left-0 z-50 w-[18.5rem] p-4 lg:hidden" : "sticky top-0 hidden p-4 lg:flex",
        !isMobile && (isCollapsed ? "w-20" : "w-72"),
      )}
      initial={isMobile ? { x: -320 } : false}
      animate={isMobile ? { x: 0 } : { width: isCollapsed ? 80 : 288 }}
      exit={isMobile ? { x: -320 } : undefined}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={cn("mb-6 flex items-start gap-3", isCollapsed && !isMobile ? "justify-center" : "justify-between")}>
        <Link
          href={ROUTES.dashboard}
          onClick={onNavigate}
          className={cn("flex min-w-0 items-center gap-3", isCollapsed && !isMobile && "justify-center")}
          aria-label="AI Inventory Intelligence Platform"
        >
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#38bdf8] via-[#2563eb] to-[#22c55e] shadow-lg shadow-blue-500/20">
            <Boxes className="size-5.5 text-white" aria-hidden="true" />
          </div>
          {showLabels && (
            <motion.div
              className="min-w-0"
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <p className="text-sm font-semibold leading-tight text-white">
                AI Inventory Intelligence Platform
              </p>
              <p className="mt-1 text-xs leading-tight text-[#94a3b8]">
                Smarter Inventory. Better Decisions.
              </p>
            </motion.div>
          )}
        </Link>

        {isMobile ? (
          <button
            type="button"
            onClick={onClose}
            className="flex size-9 shrink-0 items-center justify-center rounded-lg text-[#94a3b8] hover:bg-white/10 hover:text-white"
            aria-label="Close sidebar"
          >
            <X className="size-5" />
          </button>
        ) : null}
      </div>

      {!isMobile && (
        <button
          type="button"
          onClick={() => setIsCollapsed((value) => !value)}
          className={cn(
            "mb-4 flex h-9 items-center rounded-lg border border-white/10 bg-white/[0.03] px-3 text-xs font-medium text-[#94a3b8] hover:bg-white/10 hover:text-white",
            isCollapsed ? "justify-center px-0" : "justify-between",
          )}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {showLabels && (
            <motion.span
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              Collapse
            </motion.span>
          )}
          {isCollapsed ? <ChevronsRight className="size-4" /> : <ChevronsLeft className="size-4" />}
        </button>
      )}

      <nav className="flex-1 space-y-1 overflow-y-auto pr-1" aria-label="Sidebar navigation">
        {visibleNavigationItems.map(({ href, title, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              title={!showLabels ? title : undefined}
              className={cn(
                "group relative flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-all duration-300 ease-out",
                isCollapsed && !isMobile && "justify-center px-0",
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "text-[#94a3b8] hover:bg-sidebar-accent hover:text-sidebar-foreground",
              )}
            >
              {isActive && (
                <span
                  className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-white shadow-lg shadow-white/30"
                  aria-hidden="true"
                />
              )}
              <Icon className="size-5 shrink-0" aria-hidden="true" />
              {showLabels && (
                <motion.span
                  className="truncate"
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                >
                  {title}
                </motion.span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className={cn("mt-4 rounded-xl border border-sidebar-border bg-sidebar-accent/50 p-3", isCollapsed && !isMobile && "p-2")}>
        <div className={cn("flex items-center gap-3", isCollapsed && !isMobile && "justify-center")}>
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-tr from-[#22c55e] to-[#38bdf8] text-sm font-bold uppercase text-white">
            {user?.name ? user.name.slice(0, 2) : "DU"}
          </div>
          {showLabels && (
            <motion.div
              className="min-w-0 flex-1"
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              <p className="truncate text-sm font-semibold text-sidebar-foreground">{user?.name || "Demo User"}</p>
              <p className="truncate text-xs text-[#94a3b8]">{user?.role || "Inventory Manager"}</p>
            </motion.div>
          )}
        </div>
        {showLabels && (
          <button
            type="button"
            onClick={logout}
            className="mt-3 flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-sidebar-border text-xs font-medium text-[#94a3b8] hover:bg-[#ef4444]/10 hover:text-[#fca5a5]"
          >
            <LogOut className="size-4" />
            Logout
          </button>
        )}
      </div>
    </motion.aside>
  );
}
