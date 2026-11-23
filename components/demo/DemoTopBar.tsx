"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { NicheSlug, nicheLabels } from "@/config";
import { cn } from "@/lib/utils";

export function DemoTopBar({ currentNiche }: { currentNiche: NicheSlug }) {
  const pathname = usePathname();
  const router = useRouter();
  // Better check: the path ends with '/dashboard'
  const isDashboard = pathname.endsWith("/dashboard");

  return (
    <div className="fixed inset-x-0 top-0 z-50 flex flex-col items-center justify-between bg-slate-900 px-4 py-2 text-sm text-slate-300 shadow-md sm:flex-row">
      <div className="mb-2 flex items-center gap-2 sm:mb-0">
        <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
        <span className="font-medium text-white">Interactive Demo Mode</span>
      </div>

      <div className="flex items-center gap-1 rounded-md bg-slate-800 p-1">
        <Link
          href={`/demo/${currentNiche}`}
          className={cn(
            "rounded px-3 py-1.5 font-medium transition-colors",
            !isDashboard ? "bg-slate-700 text-white" : "hover:text-white"
          )}
        >
          Client Experience
        </Link>
        <Link
          href={`/demo/${currentNiche}/dashboard`}
          className={cn(
            "rounded px-3 py-1.5 font-medium transition-colors",
            isDashboard ? "bg-slate-700 text-white" : "hover:text-white"
          )}
        >
          Operator Dashboard
        </Link>
      </div>

      <div className="mt-2 flex items-center gap-2 sm:mt-0">
        <span className="hidden text-slate-400 sm:inline">Switch Niche:</span>
        <select
          value={currentNiche}
          onChange={(e) => {
            const newSlug = e.target.value;
            // Use router.push for SPA transition
            router.push(`/demo/${newSlug}${isDashboard ? "/dashboard" : ""}`);
          }}
          className="cursor-pointer rounded border border-slate-700 bg-slate-800 px-2 py-1 text-white outline-none"
        >
          {Object.entries(nicheLabels).map(([slug, label]) => (
            <option key={slug} value={slug}>
              {label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}