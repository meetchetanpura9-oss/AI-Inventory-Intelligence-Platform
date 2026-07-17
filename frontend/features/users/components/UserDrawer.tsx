import React from "react";
import { X, User2, Calendar, Mail, PhoneCall, ShieldCheck, Activity, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { User } from "../types";
import { UserRoleBadge } from "./UserRoleBadge";
import { UserStatusBadge } from "./UserStatusBadge";
import { useUser } from "../hooks/useUser";

interface UserDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number | null;
}

export function UserDrawer({ isOpen, onClose, userId }: UserDrawerProps) {
  const { userDetail: user, activities, isLoadingDetail, isLoadingActivity } = useUser(userId);

  if (!userId) return null;

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
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
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer container */}
          <motion.div
            className="fixed inset-y-0 right-0 z-50 flex h-full w-full max-w-md flex-col border-l border-border bg-[#0f172a] shadow-2xl p-6 select-none"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/55 pb-4 mb-5">
              <div className="min-w-0">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <User2 className="size-5 text-primary" />
                  <span>User Profile Card</span>
                </h3>
                <p className="text-xs text-[#94a3b8] mt-0.5">Full credentials and security logs</p>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-1.5 text-[#94a3b8] hover:bg-white/10 hover:text-white transition"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Profile Content */}
            {isLoadingDetail ? (
              <div className="flex flex-col justify-center items-center h-48 space-y-3">
                <RefreshCw className="size-8 animate-spin text-primary" />
                <p className="text-xs text-[#94a3b8]">Loading details...</p>
              </div>
            ) : !user ? (
              <p className="text-xs text-[#94a3b8] text-center py-10">User profile could not be loaded.</p>
            ) : (
              <div className="flex-1 overflow-y-auto pr-1 space-y-6">
                {/* User Card Header */}
                <div className="flex flex-col items-center justify-center p-4 bg-card/25 border border-border rounded-2xl text-center space-y-3">
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="size-16 rounded-full object-cover border border-primary/20 shadow-md"
                    />
                  ) : (
                    <div className="size-16 rounded-full bg-gradient-to-tr from-[#3b82f6]/20 to-[#14b8a6]/20 text-primary flex items-center justify-center font-black text-xl border border-primary/20 shadow-md">
                      {getInitials(user.name)}
                    </div>
                  )}
                  <div>
                    <h4 className="text-base font-bold text-white leading-snug">{user.name}</h4>
                    <span className="text-xs text-[#94a3b8] font-mono select-all block mt-0.5">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <UserRoleBadge role={user.role} />
                    <UserStatusBadge status={user.status} />
                  </div>
                </div>

                {/* Properties list */}
                <div className="space-y-4">
                  <h5 className="text-xs font-bold text-[#64748b] uppercase tracking-wider">Account Information</h5>
                  <div className="divide-y divide-border/30 border border-border rounded-xl overflow-hidden text-xs">
                    <div className="flex items-center justify-between p-3.5 bg-card/10">
                      <span className="text-[#94a3b8] flex items-center gap-2">
                        <Mail className="size-3.5 text-[#64748b]" /> Email Address
                      </span>
                      <span className="font-semibold text-white select-all">{user.email}</span>
                    </div>
                    <div className="flex items-center justify-between p-3.5 bg-card/10">
                      <span className="text-[#94a3b8] flex items-center gap-2">
                        <PhoneCall className="size-3.5 text-[#64748b]" /> Phone Number
                      </span>
                      <span className="font-semibold text-white">{user.phone || "-"}</span>
                    </div>
                    <div className="flex items-center justify-between p-3.5 bg-card/10">
                      <span className="text-[#94a3b8] flex items-center gap-2">
                        <Calendar className="size-3.5 text-[#64748b]" /> Created Date
                      </span>
                      <span className="font-semibold text-white">{formatDate(user.created_at)}</span>
                    </div>
                    <div className="flex items-center justify-between p-3.5 bg-card/10">
                      <span className="text-[#94a3b8] flex items-center gap-2">
                        <Activity className="size-3.5 text-[#64748b]" /> Last Login
                      </span>
                      <span className="font-semibold text-white">{formatDate(user.last_login || "")}</span>
                    </div>
                    <div className="flex items-center justify-between p-3.5 bg-card/10">
                      <span className="text-[#94a3b8] flex items-center gap-2">
                        <ShieldCheck className="size-3.5 text-[#64748b]" /> 2-Factor Auth
                      </span>
                      <span className={`font-bold ${user.two_factor_enabled ? "text-[#22c55e]" : "text-[#94a3b8]"}`}>
                        {user.two_factor_enabled ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Audit activities list */}
                <div className="space-y-3">
                  <h5 className="text-xs font-bold text-[#64748b] uppercase tracking-wider flex items-center gap-1.5">
                    <Activity className="size-3.5 text-[#64748b]" />
                    Recent Activity logs
                  </h5>
                  {isLoadingActivity ? (
                    <div className="flex items-center gap-2 text-xs text-[#94a3b8] py-4">
                      <RefreshCw className="size-3.5 animate-spin text-primary" />
                      Loading logs...
                    </div>
                  ) : activities.length === 0 ? (
                    <p className="text-xs text-[#64748b] italic py-2">No logs registered.</p>
                  ) : (
                    <div className="space-y-3">
                      {activities.map((act) => (
                        <div 
                          key={act.id} 
                          className="bg-card/20 rounded-xl p-3 border border-border/30 space-y-1.5"
                        >
                          <p className="text-xs font-semibold text-[#e2e8f0] leading-snug">{act.action}</p>
                          <div className="flex items-center justify-between text-[10px] text-[#64748b]">
                            <span>{formatDate(act.timestamp)}</span>
                            {act.ip_address && (
                              <span className="font-mono">IP: {act.ip_address}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="border-t border-border/40 pt-4 flex justify-end mt-4">
              <button
                onClick={onClose}
                className="h-9 px-4 rounded-lg bg-border hover:bg-border/80 text-xs font-bold text-foreground transition"
              >
                Close Profile
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default UserDrawer;
