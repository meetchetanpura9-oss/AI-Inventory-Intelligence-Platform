"use client";

import { toast } from "sonner";

const providers = [
  { name: "Google", mark: "G" },
  { name: "Microsoft", mark: "M" },
];

export function SocialLogin() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {providers.map((provider) => (
        <button
          key={provider.name}
          type="button"
          onClick={() => toast.info("Coming Soon")}
          className="flex h-12 items-center justify-center gap-3 rounded-full border border-white/10 bg-white/[0.045] px-4 text-sm font-medium text-slate-200 shadow-xl shadow-black/10 backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-blue-300/30 hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          aria-label={`Continue with ${provider.name}`}
        >
          <span className="flex size-6 items-center justify-center rounded-full bg-white text-xs font-bold text-slate-950">
            {provider.mark}
          </span>
          {provider.name}
        </button>
      ))}
    </div>
  );
}
