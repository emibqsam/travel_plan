"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ApiResponse } from "@/app/lib/constants";
import type { AiPlanResult } from "@/app/api/ai-plan/route";
import type { Trip } from "@/app/lib/types/trip";

export default function AiPlanPage() {
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [partySize, setPartySize] = useState(2);
  const [style, setStyle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AiPlanResult | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/ai-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination,
          start_date: startDate,
          end_date: endDate,
          party_size: partySize,
          style,
        }),
      });
      const json = (await res.json()) as ApiResponse<AiPlanResult>;
      if (!json.success || !json.data) {
        setError(json.error || "AI 호출 실패");
        return;
      }
      setResult(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "요청 실패");
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveAsTrip() {
    if (!result) return;
    setSaving(true);
    setError(null);
    try {
      const tripRes = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: result.title,
          destination,
          start_date: startDate,
          end_date: endDate,
        }),
      });
      const tripJson = (await tripRes.json()) as ApiResponse<Trip>;
      if (!tripJson.success || !tripJson.data) {
        throw new Error(tripJson.error || "trip 생성 실패");
      }
      const tripId = tripJson.data.id;

      for (const day of result.days) {
        for (const item of day.items) {
          const itemRes = await fetch(`/api/trips/${tripId}/items`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              day_number: day.day_number,
              place: item.place,
              start_time: item.start_time,
              memo: item.memo,
            }),
          });
          const itemJson = (await itemRes.json()) as ApiResponse;
          if (!itemJson.success) {
            throw new Error(itemJson.error || "item 저장 실패");
          }
        }
      }
      router.push(`/trips/${tripId}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "저장 실패");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">
          AI 추천 여행 계획
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          목적지와 기간을 입력하면 AI가 일자별 일정을 자동 생성합니다.
        </p>
      </header>

      <form
        onSubmit={handleGenerate}
        className="grid gap-4 rounded-2xl border border-white/40 bg-white/60 p-6 shadow-[0_8px_32px_rgba(31,38,135,0.08)] backdrop-blur-xl sm:grid-cols-2"
      >
        <label className="flex flex-col gap-1 text-sm sm:col-span-2">
          <span className="text-slate-700">목적지</span>
          <input
            required
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="예: 도쿄, 제주도, 발리"
            className="h-10 rounded-xl border border-slate-200 bg-white/80 px-3 text-sm outline-none focus:border-slate-400"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-slate-700">시작일</span>
          <input
            required
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="h-10 rounded-xl border border-slate-200 bg-white/80 px-3 text-sm outline-none focus:border-slate-400"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-slate-700">종료일</span>
          <input
            required
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="h-10 rounded-xl border border-slate-200 bg-white/80 px-3 text-sm outline-none focus:border-slate-400"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-slate-700">인원</span>
          <input
            type="number"
            min={1}
            max={20}
            value={partySize}
            onChange={(e) => setPartySize(Number(e.target.value))}
            className="h-10 rounded-xl border border-slate-200 bg-white/80 px-3 text-sm outline-none focus:border-slate-400"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-slate-700">스타일·관심사 (선택)</span>
          <input
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            placeholder="예: 미식, 자연, 박물관, 휴양"
            className="h-10 rounded-xl border border-slate-200 bg-white/80 px-3 text-sm outline-none focus:border-slate-400"
          />
        </label>
        <div className="sm:col-span-2 flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="h-11 rounded-full bg-slate-900 px-6 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:opacity-60"
          >
            {loading ? "생성 중..." : "AI로 계획 생성"}
          </button>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
      </form>

      {result && (
        <section className="mt-10">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                {result.title}
              </h2>
              <p className="mt-1 text-sm text-slate-600">{result.summary}</p>
            </div>
            <button
              onClick={handleSaveAsTrip}
              disabled={saving}
              className="h-10 rounded-full bg-emerald-600 px-5 text-sm font-medium text-white transition-colors hover:bg-emerald-500 disabled:opacity-60"
            >
              {saving ? "저장 중..." : "이 일정으로 trip 저장"}
            </button>
          </div>

          <div className="grid gap-4">
            {result.days.map((day) => (
              <article
                key={day.day_number}
                className="rounded-2xl border border-white/40 bg-white/60 p-5 shadow-[0_4px_20px_rgba(31,38,135,0.06)] backdrop-blur-xl"
              >
                <h3 className="mb-3 text-base font-semibold text-slate-900">
                  Day {day.day_number}
                </h3>
                <ul className="flex flex-col gap-3">
                  {day.items.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex gap-4 border-l-2 border-slate-200 pl-4"
                    >
                      <span className="w-14 shrink-0 text-sm font-medium text-slate-500">
                        {item.start_time}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {item.place}
                        </p>
                        <p className="mt-0.5 text-sm text-slate-600">
                          {item.memo}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
