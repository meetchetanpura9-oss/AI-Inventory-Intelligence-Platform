"use client";

import Link from "next/link";
import { ShieldAlert } from "lucide-react";

import { ROUTES } from "@/constants/routes";

export function AccessDenied() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-8 text-center shadow-xl">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <ShieldAlert className="size-7" aria-hidden="true" />
        </div>
        <h1 className="mt-5 text-2xl font-semibold text-foreground">403 Access Denied</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Your current role does not have permission to view this page.
        </p>
        <Link
          href={ROUTES.dashboard}
          className="mt-6 inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/80"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default AccessDenied;
