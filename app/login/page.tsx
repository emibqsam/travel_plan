"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
// MOCK AUTH: 복구 시 아래 import / state 주석 해제
// import { useState } from "react";
// import { createClient } from "@/app/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const redirectTo = params.get("redirectTo") || "/dashboard";

  // MOCK AUTH: 원래 Supabase 로그인 로직 — 복구 시 주석 해제
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [error, setError] = useState<string | null>(null);
  // const [loading, setLoading] = useState(false);
  //
  // async function handleSubmit(e: React.FormEvent) {
  //   e.preventDefault();
  //   setLoading(true);
  //   setError(null);
  //   const supabase = createClient();
  //   const { error } = await supabase.auth.signInWithPassword({ email, password });
  //   setLoading(false);
  //   if (error) {
  //     setError(error.message);
  //     return;
  //   }
  //   router.push(redirectTo);
  //   router.refresh();
  // }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push(redirectTo);
    router.refresh();
  }

  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16">
      <main className="w-full max-w-md rounded-3xl border border-white/40 bg-white/60 p-8 shadow-[0_8px_32px_rgba(31,38,135,0.12)] backdrop-blur-xl">
        <h1 className="text-2xl font-semibold text-slate-900">로그인 (Mock)</h1>
        <p className="mt-2 text-sm text-slate-600">
          개발용 mock 로그인입니다. 진행 시 바로 dashboard 이동.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <button
            type="submit"
            className="h-11 rounded-full bg-slate-900 text-sm font-medium text-white transition-colors hover:bg-slate-800"
          >
            Mock 로그인
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">
          계정이 없으신가요?{" "}
          <Link href="/signup" className="font-medium text-slate-900 underline">
            회원가입
          </Link>
        </p>
      </main>
    </div>
  );
}
