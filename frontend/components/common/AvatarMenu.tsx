"use client";

import React, { useState } from "react";
import { User, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { ROUTES } from "@/constants/routes";

export function AvatarMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push(ROUTES.login);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg p-1.5 transition-all duration-200 hover:bg-white/10 focus:outline-none"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-tr from-[#3b82f6] to-[#14b8a6] text-sm font-bold text-white uppercase">
          {user?.name ? user.name.slice(0, 2) : "AI"}
        </div>
        <span className="hidden text-sm font-medium text-white md:block">
          {user?.name || "Demo User"}
        </span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2.5 w-48 origin-top-right rounded-xl border border-[#223046] bg-[#102235] p-1.5 shadow-xl z-20 animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="px-3 py-2 border-b border-[#223046] mb-1.5">
              <p className="text-xs text-[#94a3b8]">Signed in as</p>
              <p className="text-sm font-semibold text-white truncate">{user?.name || "Demo User"}</p>
            </div>
            <Link
              href={ROUTES.profile}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#94a3b8] hover:bg-[#07111f] hover:text-white transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <User className="size-4" />
              Profile
            </Link>
            <Link
              href={ROUTES.settings}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#94a3b8] hover:bg-[#07111f] hover:text-white transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="size-4" />
              Settings
            </Link>
            <span className="block h-px bg-[#223046] my-1.5" />
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#ef4444] hover:bg-[#ef4444]/10 transition-colors text-left"
            >
              <LogOut className="size-4" />
              Log Out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
export default AvatarMenu;
