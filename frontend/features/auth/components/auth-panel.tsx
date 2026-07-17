"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { Logo } from "@/components/common/Logo";

interface AuthPanelProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthPanel({ title, subtitle, children, footer }: AuthPanelProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="w-full max-w-md rounded-[2rem] border border-white/15 bg-slate-900/70 p-6 shadow-2xl shadow-black/40 backdrop-blur-2xl sm:p-8"
      aria-labelledby="auth-title"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.12, duration: 0.35 }}
        className="mb-8"
      >
        <Logo />
      </motion.div>
      <div className="mb-7">
        <h1 id="auth-title" className="text-3xl font-semibold tracking-tight text-white">
          {title}
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-400">{subtitle}</p>
      </div>
      {children}
      {footer && <div className="mt-7 text-center text-sm text-slate-400">{footer}</div>}
    </motion.section>
  );
}
