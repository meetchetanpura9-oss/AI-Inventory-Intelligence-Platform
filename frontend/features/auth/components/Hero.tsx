"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { memo } from "react";

import { Logo } from "@/components/common/Logo";
import { BRAND } from "@/constants/colors";
import { AIIllustration } from "@/features/auth/components/AIIllustration";
import { KPICards } from "@/features/auth/components/KPICards";
import { TrustSection } from "@/features/auth/components/TrustSection";

export const Hero = memo(function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      className="flex min-h-full flex-col justify-center gap-10 py-10 lg:gap-12 lg:py-12"
      initial={reduceMotion ? false : { opacity: 0, transform: "translate3d(-24px,0,0)" }}
      animate={reduceMotion ? undefined : { opacity: 1, transform: "translate3d(0,0,0)" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="space-y-8">
        <Logo />

        <div className="max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-medium text-blue-100 shadow-xl shadow-blue-950/10 backdrop-blur-xl">
            <Sparkles className="size-4 text-cyan-200" aria-hidden="true" />
            AI Powered Inventory Intelligence
          </div>

          <p className="mb-5 text-2xl font-semibold text-white sm:text-3xl">
            {BRAND.tagline.split(". ")[0]}.<br />
            {BRAND.tagline.split(". ")[1]}
          </p>

          <h1 className="max-w-3xl text-[2.85rem] font-semibold leading-[1.05] tracking-tight text-white sm:text-[3.35rem] xl:text-[3.85rem]">
            AI That Runs Modern Inventory.
          </h1>

          <p className="mt-8 max-w-2xl text-xl leading-9 text-slate-300 sm:text-[1.35rem]">
            Predict demand. Optimize inventory. Prevent stock-outs. Automate decisions.
          </p>

          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-400">
            Turn operational data into intelligent purchasing, forecasting, replenishment,
            and inventory optimization.
          </p>
        </div>
      </div>

      <div className="space-y-8">
        <KPICards />
        <AIIllustration />
        <TrustSection />
      </div>
    </motion.section>
  );
});
