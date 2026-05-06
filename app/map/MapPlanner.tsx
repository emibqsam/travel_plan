"use client";

import dynamic from "next/dynamic";

export const MapPlanner = dynamic(() => import("./MapPlannerClient"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[480px] items-center justify-center rounded-3xl border border-white/40 bg-white/40 text-sm text-slate-500">
      지도 로딩 중...
    </div>
  ),
});
