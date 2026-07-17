"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { motion, useReducedMotion } from "framer-motion";
import {
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Logo } from "@/components/common/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants/routes";
import { authService } from "@/services/auth";

const phoneRegex = /^\+?[1-9]\d{9,14}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

const registerSchema = z
  .object({
    fullName: z.string().trim().min(1, "Full Name is required").max(150, "Name is too long"),
    email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
    phone: z
      .string()
      .trim()
      .min(1, "Phone is required")
      .regex(phoneRegex, "Use a valid phone number with 10 to 15 digits"),
    companyName: z.string().trim().max(150, "Company name is too long").optional(),
    organization: z.string().trim().max(150, "Organization is too long").optional(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        passwordRegex,
        "Use uppercase, lowercase, number, and special character"
      ),
    confirmPassword: z.string().min(1, "Confirm Password is required"),
    acceptTerms: z.boolean().refine((value) => value, {
      message: "You must accept the Terms & Conditions",
    }),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords must match",
  });

type RegisterValues = z.infer<typeof registerSchema>;

function getApiErrorMessage(error: unknown) {
  if (!axios.isAxiosError(error)) {
    return "Server error. Please try again shortly.";
  }

  const status = error.response?.status;
  const data = error.response?.data;
  const message =
    typeof data === "object" &&
    data !== null &&
    "message" in data &&
    typeof data.message === "string"
      ? data.message
      : "";

  if (status === 409 && message.toLowerCase().includes("email")) {
    return "Email already exists. Try logging in or use another email.";
  }

  if (status === 409 && message.toLowerCase().includes("phone")) {
    return "Phone already registered. Use another phone number.";
  }

  if (status === 422) {
    return "Some details are invalid. Please check your email, phone, and password.";
  }

  if (status && status >= 500) {
    return "Server error. Please try again shortly.";
  }

  return message || "Unable to create account. Please try again.";
}

export function RegisterForm() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerSucceeded, setRegisterSucceeded] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      companyName: "",
      organization: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  async function onSubmit(values: RegisterValues) {
    setRegisterSucceeded(false);

    try {
      await authService.register({
        full_name: values.fullName,
        email: values.email,
        phone: values.phone,
        password: values.password,
      });

      setRegisterSucceeded(true);
      toast.success("Account Created Successfully", {
        description: "You can now log in with your new credentials.",
      });

      await new Promise((resolve) => setTimeout(resolve, 800));
      router.push(ROUTES.login);
    } catch (error) {
      toast.error("Registration failed", {
        description: getApiErrorMessage(error),
      });
    }
  }

  return (
    <motion.section
      initial={reduceMotion ? false : { opacity: 0, transform: "translate3d(0,28px,0) scale(0.98)" }}
      animate={
        reduceMotion
          ? undefined
          : registerSucceeded
            ? { opacity: 0.42, transform: "translate3d(0,-14px,0) scale(1.035)" }
            : { opacity: 1, transform: "translate3d(0,0,0) scale(1)" }
      }
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="w-full max-w-[38rem] rounded-[2rem] border border-white/10 bg-white/[0.05] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-8"
      aria-labelledby="register-title"
    >
      <div className="mb-6">
        <Logo />
      </div>

      <div className="mb-6">
        <p className="mb-2.5 inline-flex rounded-full border border-blue-300/15 bg-blue-400/10 px-3 py-1 text-xs font-medium text-blue-100">
          Secure account setup
        </p>
        <h2 id="register-title" className="text-3xl font-semibold tracking-tight text-white">
          Create Account
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Start with a least-privilege account. Admins can assign operational roles after onboarding.
        </p>
      </div>

      <motion.form
        initial={reduceMotion ? false : { opacity: 0, transform: "translate3d(0,12px,0)" }}
        animate={reduceMotion ? undefined : { opacity: 1, transform: "translate3d(0,0,0)" }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="space-y-4"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="fullName" className="mb-1.5 block text-xs font-medium text-slate-200">
              Full Name
            </label>
            <div className="group relative">
              <User className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-blue-200" />
              <Input
                id="fullName"
                autoComplete="name"
                placeholder="Meet Chetanpura"
                aria-invalid={Boolean(errors.fullName)}
                className="h-11 rounded-full border-white/10 bg-[#071827]/60 pl-11 pr-4 text-white shadow-inner shadow-black/20 placeholder:text-slate-500 focus-visible:border-blue-300"
                {...register("fullName")}
              />
            </div>
            {errors.fullName && <p className="mt-1 text-xs text-red-300">{errors.fullName.message}</p>}
          </div>

          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-slate-200">
              Email
            </label>
            <div className="group relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-blue-200" />
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                aria-invalid={Boolean(errors.email)}
                className="h-11 rounded-full border-white/10 bg-[#071827]/60 pl-11 pr-4 text-white shadow-inner shadow-black/20 placeholder:text-slate-500 focus-visible:border-blue-300"
                {...register("email")}
              />
            </div>
            {errors.email && <p className="mt-1 text-xs text-red-300">{errors.email.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="phone" className="mb-1.5 block text-xs font-medium text-slate-200">
              Phone
            </label>
            <div className="group relative">
              <Phone className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-blue-200" />
              <Input
                id="phone"
                type="tel"
                autoComplete="tel"
                placeholder="+919999999999"
                aria-invalid={Boolean(errors.phone)}
                className="h-11 rounded-full border-white/10 bg-[#071827]/60 pl-11 pr-4 text-white shadow-inner shadow-black/20 placeholder:text-slate-500 focus-visible:border-blue-300"
                {...register("phone")}
              />
            </div>
            {errors.phone && <p className="mt-1 text-xs text-red-300">{errors.phone.message}</p>}
          </div>

          <div>
            <label htmlFor="companyName" className="mb-1.5 block text-xs font-medium text-slate-200">
              Company Name
            </label>
            <div className="group relative">
              <Building2 className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-blue-200" />
              <Input
                id="companyName"
                placeholder="Inventory Intelligence Co."
                aria-invalid={Boolean(errors.companyName)}
                className="h-11 rounded-full border-white/10 bg-[#071827]/60 pl-11 pr-4 text-white shadow-inner shadow-black/20 placeholder:text-slate-500 focus-visible:border-blue-300"
                {...register("companyName")}
              />
            </div>
            {errors.companyName && <p className="mt-1 text-xs text-red-300">{errors.companyName.message}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="organization" className="mb-1.5 block text-xs font-medium text-slate-200">
            Organization
          </label>
          <div className="group relative">
            <Building2 className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-blue-200" />
            <Input
              id="organization"
              placeholder="Operations, Warehouse, Retail"
              aria-invalid={Boolean(errors.organization)}
              className="h-11 rounded-full border-white/10 bg-[#071827]/60 pl-11 pr-4 text-white shadow-inner shadow-black/20 placeholder:text-slate-500 focus-visible:border-blue-300"
              {...register("organization")}
            />
          </div>
          {errors.organization && <p className="mt-1 text-xs text-red-300">{errors.organization.message}</p>}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-slate-200">
              Password
            </label>
            <div className="group relative">
              <Lock className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-blue-200" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Minimum 8 characters"
                aria-invalid={Boolean(errors.password)}
                className="h-11 rounded-full border-white/10 bg-[#071827]/60 pl-11 pr-12 text-white shadow-inner shadow-black/20 placeholder:text-slate-500 focus-visible:border-blue-300"
                {...register("password")}
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-300">{errors.password.message}</p>}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="mb-1.5 block text-xs font-medium text-slate-200">
              Confirm Password
            </label>
            <div className="group relative">
              <Lock className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-blue-200" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Repeat password"
                aria-invalid={Boolean(errors.confirmPassword)}
                className="h-11 rounded-full border-white/10 bg-[#071827]/60 pl-11 pr-12 text-white shadow-inner shadow-black/20 placeholder:text-slate-500 focus-visible:border-blue-300"
                {...register("confirmPassword")}
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                onClick={() => setShowConfirmPassword((value) => !value)}
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              >
                {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-300">{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="flex items-start gap-2 text-xs leading-5 text-slate-300">
            <input
              type="checkbox"
              className="mt-0.5 size-4 rounded border-white/20 bg-white/10 accent-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              {...register("acceptTerms")}
            />
            <span>
              I agree to the Terms & Conditions and understand that operational roles are assigned by an administrator.
            </span>
          </label>
          {errors.acceptTerms && <p className="mt-1 text-xs text-red-300">{errors.acceptTerms.message}</p>}
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting || registerSucceeded}
          className="mt-2 h-12 w-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(37,99,235,0.35)] hover:scale-[1.02] hover:shadow-[0_22px_60px_rgba(37,99,235,0.48)] focus-visible:ring-blue-300"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Creating Account...
            </>
          ) : registerSucceeded ? (
            <>
              <CheckCircle2 className="size-4" aria-hidden="true" />
              Account Created
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </motion.form>

      <p className="mt-5 text-center text-xs text-slate-400">
        Already have an account?{" "}
        <Link
          href={ROUTES.login}
          className="font-medium text-blue-200 underline-offset-4 hover:text-white hover:underline focus-visible:outline-none"
        >
          Back to Login
        </Link>
      </p>
    </motion.section>
  );
}

export default RegisterForm;
