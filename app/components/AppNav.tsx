"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { APP_NAV } from "@/app/lib/nav";

export function AppNav() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-wrap gap-2">
      {APP_NAV.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className={
              "inline-flex h-9 items-center justify-center rounded-full border px-4 text-sm transition-colors " +
              (active
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-200 bg-white/70 text-slate-700 hover:bg-white")
            }
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
