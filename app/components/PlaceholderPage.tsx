import { AppNav } from "./AppNav";

interface Props {
  title: string;
  description: string;
}

export function PlaceholderPage({ title, description }: Props) {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12">
      <AppNav />
      <header className="mt-8">
        <h1 className="text-3xl font-semibold text-slate-900">{title}</h1>
        <p className="mt-2 text-sm text-slate-600">{description}</p>
      </header>
      <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white/40 p-12 text-center">
        <p className="text-slate-600">준비 중인 기능입니다.</p>
      </div>
    </div>
  );
}
