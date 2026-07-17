"use client";

import { motion, useReducedMotion } from "framer-motion";

export function BackgroundGlow() {
  const reduceMotion = useReducedMotion();

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[#071827]" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(7,24,39,0.96)_0%,rgba(10,35,54,0.92)_46%,rgba(5,16,28,0.98)_100%)]" />
      <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,0.13)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.13)_1px,transparent_1px)] [background-size:56px_56px]" />
      <motion.div
        className="absolute -left-40 -top-40 size-[30rem] rounded-full bg-blue-500/20 blur-3xl will-change-transform"
        animate={reduceMotion ? undefined : { transform: ["translate3d(0,0,0) scale(1)", "translate3d(28px,18px,0) scale(1.04)", "translate3d(0,0,0) scale(1)"] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-36 bottom-[-10rem] size-[32rem] rounded-full bg-emerald-400/18 blur-3xl will-change-transform"
        animate={reduceMotion ? undefined : { transform: ["translate3d(0,0,0) scale(1)", "translate3d(-24px,-20px,0) scale(1.05)", "translate3d(0,0,0) scale(1)"] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
