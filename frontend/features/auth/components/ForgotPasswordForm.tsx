"use client";

import React from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Loader2, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants/routes";
import { AuthPanel } from "@/features/auth/components/auth-panel";

const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit() {
    await new Promise((resolve) => setTimeout(resolve, 800));
    toast.info("Coming Soon", {
      description: "Password recovery will connect to the backend later.",
    });
  }

  return (
    <AuthPanel
      title="Reset your password"
      subtitle="Enter your work email and we will prepare recovery instructions once auth APIs are connected."
      footer={
        <Link
          href={ROUTES.login}
          className="font-medium text-blue-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          Back to login
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
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-200">
            Email
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              className="h-12 rounded-2xl border-white/10 bg-white/[0.06] pl-10 text-white placeholder:text-slate-500 focus-visible:border-blue-400"
              placeholder="you@company.com"
              {...register("email")}
            />
          </div>
          {errors.email && <p className="mt-2 text-sm text-red-300">{errors.email.message}</p>}
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="h-12 w-full rounded-2xl bg-gradient-to-r from-primary to-secondary text-base font-semibold shadow-xl shadow-blue-950/40 hover:scale-[1.01]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Sending...
            </>
          ) : (
            "Send recovery link"
          )}
        </Button>
      </motion.form>
    </AuthPanel>
  );
}
export default ForgotPasswordForm;
