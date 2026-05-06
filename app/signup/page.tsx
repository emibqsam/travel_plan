"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/app/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfo(null);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    if (data.session) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setInfo("확인 메일을 발송했습니다. 메일을 확인하고 로그인해주세요.");
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16">
      <main className="w-full max-w-md rounded-3xl border border-white/40 bg-white/60 p-8 shadow-[0_8px_32px_rgba(31,38,135,0.12)] backdrop-blur-xl">
        <h1 className="text-2xl font-semibold text-slate-900">회원가입</h1>
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <input
            type="email"
            required
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 rounded-xl border border-slate-200 bg-white/80 px-4 text-sm text-slate-900 outline-none focus:border-slate-400"
          />
          <input
            type="password"
            required
            minLength={6}
            placeholder="비밀번호 (6자 이상)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 rounded-xl border border-slate-200 bg-white/80 px-4 text-sm text-slate-900 outline-none focus:border-slate-400"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          {info && <p className="text-sm text-emerald-700">{info}</p>}
          <button
            type="submit"
            disabled={loading}
            className="h-11 rounded-full bg-slate-900 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:opacity-60"
          >
            {loading ? "가입 중..." : "회원가입"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">
          이미 계정이 있으신가요?{" "}
          <Link href="/login" className="font-medium text-slate-900 underline">
            로그인
          </Link>
        </p>
      </main>
    </div>
  );
}
