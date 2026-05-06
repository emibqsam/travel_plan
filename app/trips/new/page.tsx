"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewTripPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/trips", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        destination,
        start_date: startDate,
        end_date: endDate,
      }),
    });
    const json = await res.json();
    setLoading(false);
    if (!res.ok || !json.success) {
      setError(json.error || "생성 실패");
      return;
    }
    router.push(`/trips/${json.data.id}`);
  }

  return (
    <div className="mx-auto w-full max-w-xl px-6 py-12">
      <Link href="/dashboard" className="text-sm text-slate-600 hover:underline">
        ← 대시보드
      </Link>
      <h1 className="mt-4 text-3xl font-semibold text-slate-900">새 여행</h1>
      <form
        onSubmit={handleSubmit}
        className="mt-8 flex flex-col gap-4 rounded-3xl border border-white/40 bg-white/60 p-6 backdrop-blur"
      >
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-slate-700">제목</span>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="예: 도쿄 3박 4일"
            className="h-11 rounded-xl border border-slate-200 bg-white/80 px-4 text-sm focus:border-slate-400 focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-slate-700">목적지</span>
          <input
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="예: 도쿄, 일본"
            className="h-11 rounded-xl border border-slate-200 bg-white/80 px-4 text-sm focus:border-slate-400 focus:outline-none"
          />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-slate-700">시작일</span>
            <input
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="h-11 rounded-xl border border-slate-200 bg-white/80 px-4 text-sm focus:border-slate-400 focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-slate-700">종료일</span>
            <input
              type="date"
              required
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="h-11 rounded-xl border border-slate-200 bg-white/80 px-4 text-sm focus:border-slate-400 focus:outline-none"
            />
          </label>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="h-11 rounded-full bg-slate-900 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {loading ? "생성 중..." : "여행 만들기"}
        </button>
      </form>
    </div>
  );
}
