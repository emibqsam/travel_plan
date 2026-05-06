import { redirect } from "next/navigation";
import { getAuthUser } from "@/app/lib/auth";
import { AppNav } from "@/app/components/AppNav";
import { MapPlanner } from "./MapPlanner";

export const dynamic = "force-dynamic";

export default async function MapPage() {
  const user = await getAuthUser();
  if (!user) redirect("/login");

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12">
      <AppNav />
      <header className="mt-8">
        <h1 className="text-3xl font-semibold text-slate-900">지도 루트</h1>
        <p className="mt-2 text-sm text-slate-600">
          지도를 클릭해 경유지를 추가하고 여행 동선을 만들어보세요.
        </p>
      </header>
      <section className="mt-8">
        <MapPlanner />
      </section>
    </div>
  );
}
