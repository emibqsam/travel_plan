"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/app/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();
  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }
  return (
    <button
      onClick={handleLogout}
      className="inline-flex h-10 items-center justify-center rounded-full border border-slate-200 bg-white/70 px-4 text-sm font-medium text-slate-700 hover:bg-white"
    >
      로그아웃
    </button>
  );
}
