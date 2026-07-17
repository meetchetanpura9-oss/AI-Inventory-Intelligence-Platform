"use client";

import React, { type ReactNode, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useAuthStore } from "@/store/auth-store";
import { Loading } from "@/components/common/Loading";
import { AccessDenied } from "@/components/common/AccessDenied";
import { canAccessPath } from "@/constants/navigation";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router, isMounted]);

  if (!isMounted || isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#071827]">
        <Loading />
      </div>
    );
  }

  const canAccessCurrentPath = canAccessPath(user?.role, pathname);

  return (
    <div className="flex min-h-screen overflow-hidden bg-background text-foreground">
      <Sidebar />

      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/55 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            <Sidebar
              isMobile
              onNavigate={() => setIsMobileSidebarOpen(false)}
              onClose={() => setIsMobileSidebarOpen(false)}
            />
          </>
        )}
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col">
        <Header onMenuClick={() => setIsMobileSidebarOpen(true)} />
        <motion.main
          className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
        >
            <div className="mx-auto w-full max-w-7xl">
              {canAccessCurrentPath ? children : <AccessDenied />}
            </div>
        </motion.main>
      </div>
    </div>
  );
}
export default DashboardLayout;
