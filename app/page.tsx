export default function Home() {
  return (
    <div className="relative flex flex-1 items-center justify-center overflow-hidden px-6 py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -left-24 h-[420px] w-[420px] rounded-full bg-blue-400/40 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -right-24 h-[480px] w-[480px] rounded-full bg-orange-300/40 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 left-1/2 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-indigo-300/30 blur-3xl"
      />

      <main className="relative w-full max-w-3xl rounded-3xl border border-white/40 bg-white/50 p-10 shadow-[0_8px_32px_rgba(31,38,135,0.12)] backdrop-blur-xl sm:p-14">
        <div className="flex flex-col items-center gap-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/60 px-3 py-1 text-xs font-medium text-slate-600 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            여행을 더 쉽고 즐겁게
          </span>

          <h1
            style={{ fontFamily: "var(--font-outfit)" }}
            className="text-4xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-5xl"
          >
            당신의 완벽한 여행,<br />Travel Plan과 함께
          </h1>

          <p className="max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
            일정 짜기부터 동선 최적화, 예산 관리까지.<br />
            한 곳에서 여행의 모든 순간을 계획하세요.
          </p>

          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/60 bg-white/60 p-5 text-left backdrop-blur">
              <div className="mb-2 text-2xl">🗺️</div>
              <h3 className="mb-1 text-sm font-semibold text-slate-900">스마트 일정</h3>
              <p className="text-xs leading-relaxed text-slate-600">
                AI가 추천하는 최적 동선과 일정으로 시간 낭비 없이 여행하세요.
              </p>
            </div>
            <div className="rounded-2xl border border-white/60 bg-white/60 p-5 text-left backdrop-blur">
              <div className="mb-2 text-2xl">💰</div>
              <h3 className="mb-1 text-sm font-semibold text-slate-900">예산 관리</h3>
              <p className="text-xs leading-relaxed text-slate-600">
                항공, 숙소, 식비를 한눈에 보고 여행 경비를 효율적으로 관리합니다.
              </p>
            </div>
            <div className="rounded-2xl border border-white/60 bg-white/60 p-5 text-left backdrop-blur">
              <div className="mb-2 text-2xl">👥</div>
              <h3 className="mb-1 text-sm font-semibold text-slate-900">함께 계획</h3>
              <p className="text-xs leading-relaxed text-slate-600">
                동행자와 실시간으로 일정을 공유하고 의견을 나눠보세요.
              </p>
            </div>
          </div>

          <div className="mt-2 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
            <a
              href="/dashboard"
              className="inline-flex h-12 cursor-pointer items-center justify-center rounded-full bg-slate-900 px-6 text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 sm:w-44"
            >
              여행 계획 시작하기
            </a>
            <a
              href="/explore"
              className="inline-flex h-12 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white/70 px-6 text-sm font-medium text-slate-700 backdrop-blur transition-colors duration-200 hover:bg-white sm:w-44"
            >
              여행지 둘러보기
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
