"use client";

import React, { type ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { BackgroundGlow } from "@/features/auth/components/BackgroundGlow";
import { FloatingGlow } from "@/features/auth/components/FloatingGlow";
import { Hero } from "@/features/auth/components/Hero";

interface AuthLayoutProps {
  children: ReactNode;
  eyebrow?: string;
  allowAuthenticated?: boolean;
}

function DashboardPreview() {
  const rows = [
    { label: "Inventory", value: "12,847", status: "Healthy" },
    { label: "Demand Forecast", value: "96%", status: "Rising" },
    { label: "Warehouses", value: "18", status: "Synced" },
    { label: "Alerts", value: "8", status: "Low stock" },
  ];

  return (
    <div
      aria-hidden="true"
      className="absolute -right-6 top-12 hidden w-80 rotate-2 rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 opacity-45 shadow-2xl shadow-blue-950/30 backdrop-blur-xl lg:block"
    >
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Live Dashboard</p>
          <p className="mt-1 text-lg font-semibold text-white">Operations Pulse</p>
        </div>
        <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-medium text-emerald-100">
          Online
        </span>
      </div>
      <div className="grid gap-3">
        {rows.map((row) => (
          <div key={row.label} className="rounded-2xl border border-white/10 bg-[#071827]/50 p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">{row.label}</span>
              <span className="text-xs text-blue-100">{row.status}</span>
            </div>
            <p className="mt-2 text-xl font-semibold text-white">{row.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function TechFooter() {
  return (
    <footer className="relative z-10 mx-auto flex w-full max-w-[94rem] flex-wrap items-center justify-center gap-x-4 gap-y-2 px-5 pb-6 text-xs text-slate-500 sm:px-8 lg:justify-start lg:px-10">
      <span>Powered by</span>
      {["FastAPI", "Next.js", "PostgreSQL", "Redis", "AI Forecast Engine"].map((tech) => (
        <span
          key={tech}
          className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1 text-slate-300 backdrop-blur-xl"
        >
          {tech}
        </span>
      ))}
    </footer>
  );
}

export function AuthLayout({ children, allowAuthenticated = false }: AuthLayoutProps) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && !allowAuthenticated) {
      router.push("/dashboard");
    }
  }, [allowAuthenticated, isAuthenticated, router]);
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#071827] text-foreground">
      <BackgroundGlow />
      <section className="relative z-10 mx-auto grid min-h-screen w-full max-w-[94rem] grid-cols-1 gap-12 px-5 py-8 sm:px-8 lg:grid-cols-[minmax(0,1.04fr)_minmax(31rem,0.96fr)] lg:items-center lg:px-10 xl:gap-16">
        <div className="min-w-0">
          <Hero />
        </div>
        <div className="relative flex min-w-0 items-center justify-center pb-8 lg:pb-0">
          <FloatingGlow />
          <DashboardPreview />
          <div className="relative z-10 w-full">{children}</div>
        </div>
      </section>
      <TechFooter />
    </main>
  );
}
