"use client";

import { useRouter } from "next/navigation";
// MOCK AUTH: 복구 시 주석 해제
// import { createClient } from "@/app/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();

  // MOCK AUTH: 원래 Supabase signOut — 복구 시 주석 해제하고 아래 mock handler 제거
  // async function handleLogout() {
  //   const supabase = createClient();
  //   await supabase.auth.signOut();
  //   router.push("/login");
  //   router.refresh();
  // }

  function handleLogout() {
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
