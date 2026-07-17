"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Logo } from "@/components/common/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants/routes";
import { SocialLogin } from "@/features/auth/components/SocialLogin";
import { useAuthStore } from "@/store/auth-store";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  remember: z.boolean(),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginCard() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [showPassword, setShowPassword] = useState(false);
  const [loginSucceeded, setLoginSucceeded] = useState(false);
  const loginStore = useAuthStore((state) => state.login);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: true },
  });

  async function onSubmit(values: LoginValues) {
    setLoginSucceeded(false);
    try {
      const user = await loginStore({
        email: values.email,
        password: values.password,
      });
      setLoginSucceeded(true);
      toast.success(`Welcome Back ${user.name}!`, {
        description: "Welcome back to your inventory command center.",
      });
      await new Promise((resolve) => setTimeout(resolve, 450));
      router.push(ROUTES.dashboard);
    } catch {
      toast.error("Invalid Email or Password", {
        description: "Please check your credentials and try again.",
      });
    }
  }

  return (
    <motion.section
      initial={reduceMotion ? false : { opacity: 0, transform: "translate3d(0,28px,0) scale(0.98)" }}
      animate={
        reduceMotion
          ? undefined
          : loginSucceeded
            ? { opacity: 0.42, transform: "translate3d(0,-14px,0) scale(1.035)" }
            : { opacity: 1, transform: "translate3d(0,0,0) scale(1)" }
      }
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="w-full max-w-[34.5rem] rounded-[2rem] border border-white/10 bg-white/[0.05] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-8"
      aria-labelledby="login-title"
    >
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
        animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.35 }}
        className="mb-8"
      >
        <Logo />
      </motion.div>

      <div className="mb-7">
        <p className="mb-3 inline-flex rounded-full border border-blue-300/15 bg-blue-400/10 px-3 py-1 text-xs font-medium text-blue-100">
          Enterprise secure access
        </p>
        <h2 id="login-title" className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Welcome Back
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          Sign in to continue monitoring inventory, sales, purchases, AI forecasts,
          and warehouse intelligence.
        </p>
      </div>

      <SocialLogin />

      <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-slate-500">
        <span className="h-px flex-1 bg-white/10" />
        Secure Access
        <span className="h-px flex-1 bg-white/10" />
      </div>

      <motion.form
        initial={reduceMotion ? false : { opacity: 0, transform: "translate3d(0,12px,0)" }}
        animate={reduceMotion ? undefined : { opacity: 1, transform: "translate3d(0,0,0)" }}
        transition={{ delay: 0.18, duration: 0.4 }}
        className="space-y-5"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-200">
            Email
          </label>
          <div className="group relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-500 transition-colors duration-300 group-focus-within:text-blue-200" />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="demo@inventory.ai"
              aria-invalid={Boolean(errors.email)}
              className="h-14 rounded-full border-white/10 bg-[#071827]/60 pl-11 pr-4 text-white shadow-inner shadow-black/20 placeholder:text-slate-500 hover:border-blue-300/35 focus-visible:border-blue-300 focus-visible:ring-blue-400/35"
              {...register("email")}
            />
          </div>
          {errors.email && <p className="mt-2 text-sm text-red-300">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-200">
            Password
          </label>
          <div className="group relative">
            <Lock className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-500 transition-colors duration-300 group-focus-within:text-blue-200" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Minimum 8 characters"
              aria-invalid={Boolean(errors.password)}
              className="h-14 rounded-full border-white/10 bg-[#071827]/60 pl-11 pr-12 text-white shadow-inner shadow-black/20 placeholder:text-slate-500 hover:border-blue-300/35 focus-visible:border-blue-300 focus-visible:ring-blue-400/35"
              {...register("password")}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-2 text-sm text-red-300">{errors.password.message}</p>
          )}
        </div>

        <div className="flex items-center justify-between gap-4 text-sm">
          <label className="flex cursor-pointer items-center gap-2 text-slate-300">
            <input
              type="checkbox"
              className="size-4 rounded border-white/20 bg-white/10 accent-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              {...register("remember")}
            />
            Remember me
          </label>
          <Link
            href={ROUTES.forgotPassword}
            className="font-medium text-blue-200 underline-offset-4 hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            Forgot Password
          </Link>
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting || loginSucceeded}
          className="h-14 w-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-base font-semibold text-white shadow-[0_18px_45px_rgba(37,99,235,0.35)] hover:scale-[1.02] hover:shadow-[0_22px_60px_rgba(37,99,235,0.48)] focus-visible:ring-blue-300"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Signing In...
            </>
          ) : loginSucceeded ? (
            <>
              <CheckCircle2 className="size-4" aria-hidden="true" />
              Access Granted
            </>
          ) : (
            "Access AI Dashboard"
          )}
        </Button>
      </motion.form>

      <p className="mt-7 text-center text-sm text-slate-400">
        New to the platform?{" "}
        <Link
          href={ROUTES.register}
          className="font-medium text-blue-200 underline-offset-4 hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        >
          Create Account
        </Link>
      </p>
    </motion.section>
  );
}
