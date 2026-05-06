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

      <main className="relative w-full max-w-xl rounded-3xl border border-white/40 bg-white/50 p-10 shadow-[0_8px_32px_rgba(31,38,135,0.12)] backdrop-blur-xl sm:p-14">
        <div className="flex flex-col items-center gap-6 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/60 px-3 py-1 text-xs font-medium text-slate-600 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            v0.1.0
          </span>

          <h1
            style={{ fontFamily: "var(--font-outfit)" }}
            className="text-4xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-5xl"
          >
            start kit에<br />오신걸 환영합니다
          </h1>

          <p className="max-w-md text-base leading-relaxed text-slate-600 sm:text-lg">
            Next.js · Supabase · Tailwind CSS 기반의<br />
            간결한 스타터 템플릿
          </p>

          <div className="mt-2 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
            <a
              href="/dashboard"
              className="inline-flex h-12 cursor-pointer items-center justify-center rounded-full bg-slate-900 px-6 text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 sm:w-40"
            >
              시작하기
            </a>
            <a
              href="https://nextjs.org/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white/70 px-6 text-sm font-medium text-slate-700 backdrop-blur transition-colors duration-200 hover:bg-white sm:w-40"
            >
              문서 보기
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
