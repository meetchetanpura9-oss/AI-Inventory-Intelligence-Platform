"use client";

import React, { type ReactNode } from "react";
import { motion } from "framer-motion";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  actions?: ReactNode;
  action?: ReactNode;
}

export function PageHeader({ title, subtitle, description, actions, action }: PageHeaderProps) {
  const supportingText = subtitle || description;
  const headerAction = action || actions;

  return (
    <motion.div
      className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
    >
      <div>
        <h1 className="text-2xl font-semibold tracking-normal text-white sm:text-3xl">{title}</h1>
        {supportingText && (
          <p className="mt-2 max-w-2xl text-sm text-[#94a3b8]">{supportingText}</p>
        )}
      </div>
      {headerAction && (
        <div className="flex shrink-0 items-center gap-3">
          {headerAction}
        </div>
      )}
    </motion.div>
  );
}
