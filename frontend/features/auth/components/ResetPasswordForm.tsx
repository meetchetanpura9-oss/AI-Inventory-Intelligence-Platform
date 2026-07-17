"use client";

import React, { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants/routes";
import { AuthPanel } from "@/features/auth/components/auth-panel";

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm your password"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  async function onSubmit() {
    await new Promise((resolve) => setTimeout(resolve, 800));
    toast.info("Coming Soon", {
      description: "Password reset will connect to the backend later.",
    });
  }

  return (
    <AuthPanel
      title="Create a new password"
      subtitle="Choose a strong password for your inventory intelligence workspace."
      footer={
        <Link
          href={ROUTES.login}
          className="font-medium text-blue-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          Return to login
        </Link>
      }
    >
      <motion.form
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18, duration: 0.4 }}
        className="space-y-5"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        {(["password", "confirmPassword"] as const).map((field) => (
          <div key={field}>
            <label htmlFor={field} className="mb-2 block text-sm font-medium text-slate-200">
              {field === "password" ? "Password" : "Confirm password"}
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
              <Input
                id={field}
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                aria-invalid={Boolean(errors[field])}
                className="h-12 rounded-2xl border-white/10 bg-white/[0.06] pl-10 pr-11 text-white placeholder:text-slate-500 focus-visible:border-blue-400"
                placeholder="Minimum 8 characters"
                {...register(field)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "Hide passwords" : "Show passwords"}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {errors[field] && <p className="mt-2 text-sm text-red-300">{errors[field]?.message}</p>}
          </div>
        ))}

        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="h-12 w-full rounded-2xl bg-gradient-to-r from-primary to-secondary text-base font-semibold shadow-xl shadow-blue-950/40 hover:scale-[1.01]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Updating...
            </>
          ) : (
            "Update password"
          )}
        </Button>
      </motion.form>
    </AuthPanel>
  );
}
export default ResetPasswordForm;
