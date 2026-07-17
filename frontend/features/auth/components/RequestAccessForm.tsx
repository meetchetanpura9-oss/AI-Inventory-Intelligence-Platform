"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, useReducedMotion } from "framer-motion";
import { Loader2, User, Building2, Mail, Phone, Users, Landmark, FileText, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Logo } from "@/components/common/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants/routes";
import { authService } from "@/services/auth";

const requestAccessSchema = z.object({
  fullName: z.string().min(1, "Full Name is required").max(50, "Name is too long"),
  companyName: z.string().min(1, "Company Name is required").max(100, "Company name is too long"),
  workEmail: z.string().min(1, "Work Email is required").email("Enter a valid email address"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits").max(15, "Invalid phone number"),
  companySize: z.string().min(1, "Company Size is required"),
  industry: z.string().min(1, "Industry is required"),
  message: z.string().max(500, "Message cannot exceed 500 characters").optional(),
});

type RequestAccessValues = z.infer<typeof requestAccessSchema>;

export function RequestAccessForm() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [submitSucceeded, setSubmitSucceeded] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RequestAccessValues>({
    resolver: zodResolver(requestAccessSchema),
    defaultValues: { fullName: "", companyName: "", workEmail: "", phoneNumber: "", companySize: "", industry: "", message: "" },
  });

  async function onSubmit(values: RequestAccessValues) {
    setSubmitSucceeded(false);
    try {
      await authService.requestAccess({
        name: values.fullName,
        company: values.companyName,
        email: values.workEmail,
        phone: values.phoneNumber,
        message: values.message || "",
      });

      setSubmitSucceeded(true);
      toast.success("Request Submitted Successfully", {
        description: "Our enterprise sales team will reach out to you shortly.",
      });

      await new Promise((resolve) => setTimeout(resolve, 800));
      router.push(ROUTES.login);
    } catch {
      // The Axios error interceptor will toast, but fallback is added for safety
      toast.error("Failed to submit request", {
        description: "Please check your inputs and try again.",
      });
    }
  }

  return (
    <motion.section
      initial={reduceMotion ? false : { opacity: 0, transform: "translate3d(0,28px,0) scale(0.98)" }}
      animate={
        reduceMotion
          ? undefined
          : submitSucceeded
            ? { opacity: 0.42, transform: "translate3d(0,-14px,0) scale(1.035)" }
            : { opacity: 1, transform: "translate3d(0,0,0) scale(1)" }
      }
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="w-full max-w-[36rem] rounded-[2rem] border border-white/10 bg-white/[0.05] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-8"
      aria-labelledby="request-title"
    >
      <div className="mb-6">
        <Logo />
      </div>

      <div className="mb-6">
        <p className="mb-2.5 inline-flex rounded-full border border-blue-300/15 bg-blue-400/10 px-3 py-1 text-xs font-medium text-blue-100">
          Request Platform Trial
        </p>
        <h2 id="request-title" className="text-3xl font-semibold tracking-tight text-white">
          Enterprise Access
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Submit your business details and get a customized demo for your supply chain requirements.
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
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="mb-1.5 block text-xs font-medium text-slate-200">
              Full Name
            </label>
            <div className="group relative">
              <User className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-blue-200" />
              <Input
                id="fullName"
                placeholder="Meet Chetanpura"
                className="h-11 rounded-full border-white/10 bg-[#071827]/60 pl-11 pr-4 text-white shadow-inner shadow-black/20 placeholder:text-slate-500 focus-visible:border-blue-300"
                {...register("fullName")}
              />
            </div>
            {errors.fullName && <p className="mt-1 text-xs text-red-300">{errors.fullName.message}</p>}
          </div>

          {/* Company Name */}
          <div>
            <label htmlFor="companyName" className="mb-1.5 block text-xs font-medium text-slate-200">
              Company Name
            </label>
            <div className="group relative">
              <Building2 className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-blue-200" />
              <Input
                id="companyName"
                placeholder="Enterprise Inc."
                className="h-11 rounded-full border-white/10 bg-[#071827]/60 pl-11 pr-4 text-white shadow-inner shadow-black/20 placeholder:text-slate-500 focus-visible:border-blue-300"
                {...register("companyName")}
              />
            </div>
            {errors.companyName && <p className="mt-1 text-xs text-red-300">{errors.companyName.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Work Email */}
          <div>
            <label htmlFor="workEmail" className="mb-1.5 block text-xs font-medium text-slate-200">
              Work Email
            </label>
            <div className="group relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-blue-200" />
              <Input
                id="workEmail"
                type="email"
                placeholder="meet@enterprise.com"
                className="h-11 rounded-full border-white/10 bg-[#071827]/60 pl-11 pr-4 text-white shadow-inner shadow-black/20 placeholder:text-slate-500 focus-visible:border-blue-300"
                {...register("workEmail")}
              />
            </div>
            {errors.workEmail && <p className="mt-1 text-xs text-red-300">{errors.workEmail.message}</p>}
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phoneNumber" className="mb-1.5 block text-xs font-medium text-slate-200">
              Phone Number
            </label>
            <div className="group relative">
              <Phone className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-blue-200" />
              <Input
                id="phoneNumber"
                placeholder="+91 99999 99999"
                className="h-11 rounded-full border-white/10 bg-[#071827]/60 pl-11 pr-4 text-white shadow-inner shadow-black/20 placeholder:text-slate-500 focus-visible:border-blue-300"
                {...register("phoneNumber")}
              />
            </div>
            {errors.phoneNumber && <p className="mt-1 text-xs text-red-300">{errors.phoneNumber.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Company Size */}
          <div>
            <label htmlFor="companySize" className="mb-1.5 block text-xs font-medium text-slate-200">
              Company Size
            </label>
            <div className="group relative">
              <Users className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-blue-200" />
              <select
                id="companySize"
                className="h-11 w-full rounded-full border border-white/10 bg-[#071827] pl-11 pr-4 text-sm text-white shadow-inner shadow-black/20 focus:border-blue-300 focus:outline-none"
                {...register("companySize")}
              >
                <option value="" disabled>Select size...</option>
                <option value="1-10">1-10 Employees</option>
                <option value="11-50">11-50 Employees</option>
                <option value="51-200">51-200 Employees</option>
                <option value="201-1000">201-1000 Employees</option>
                <option value="1000+">1000+ Employees</option>
              </select>
            </div>
            {errors.companySize && <p className="mt-1 text-xs text-red-300">{errors.companySize.message}</p>}
          </div>

          {/* Industry */}
          <div>
            <label htmlFor="industry" className="mb-1.5 block text-xs font-medium text-slate-200">
              Industry
            </label>
            <div className="group relative">
              <Landmark className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-blue-200" />
              <select
                id="industry"
                className="h-11 w-full rounded-full border border-white/10 bg-[#071827] pl-11 pr-4 text-sm text-white shadow-inner shadow-black/20 focus:border-blue-300 focus:outline-none"
                {...register("industry")}
              >
                <option value="" disabled>Select industry...</option>
                <option value="Retail">Retail & E-commerce</option>
                <option value="Logistics">Logistics & Supply Chain</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Other">Other</option>
              </select>
            </div>
            {errors.industry && <p className="mt-1 text-xs text-red-300">{errors.industry.message}</p>}
          </div>
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="mb-1.5 block text-xs font-medium text-slate-200">
            Tell us about your requirements (Optional)
          </label>
          <div className="group relative">
            <FileText className="pointer-events-none absolute left-4 top-3 size-4 text-slate-500 transition-colors group-focus-within:text-blue-200" />
            <textarea
              id="message"
              placeholder="E.g., We manage 3 warehouses and want to sync stockouts projections."
              className="h-20 w-full rounded-2xl border border-white/10 bg-[#071827]/60 pl-11 pr-4 pt-2.5 text-xs text-white shadow-inner shadow-black/20 placeholder:text-slate-500 focus:border-blue-300 focus:outline-none"
              {...register("message")}
            />
          </div>
          {errors.message && <p className="mt-1 text-xs text-red-300">{errors.message.message}</p>}
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting || submitSucceeded}
          className="h-12 w-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(37,99,235,0.35)] hover:scale-[1.02] hover:shadow-[0_22px_60px_rgba(37,99,235,0.48)] focus-visible:ring-blue-300 mt-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Submitting Request...
            </>
          ) : submitSucceeded ? (
            <>
              <CheckCircle2 className="size-4" aria-hidden="true" />
              Request Submitted
            </>
          ) : (
            "Submit Enterprise Request"
          )}
        </Button>
      </motion.form>

      <p className="mt-5 text-center text-xs text-slate-400">
        Already have access?{" "}
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
