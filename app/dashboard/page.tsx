import Link from "next/link";
import { redirect } from "next/navigation";
// MOCK AUTH: 복구 시 주석 해제
// import { createClient } from "@/app/lib/supabase/server";
import { getAuthUser } from "@/app/lib/auth";
import type { Trip } from "@/app/lib/types/trip";
import { AppNav } from "@/app/components/AppNav";
import { LogoutButton } from "./logout-button";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getAuthUser();
  if (!user) redirect("/login");

  // MOCK AUTH: Supabase 미설정 시 trips 쿼리가 hang. 복구 시 아래 mock list 제거하고 주석 해제.
  const list: Trip[] = [];

  // const supabase = await createClient();
  // const { data: trips } = await supabase
  //   .from("trips")
  //   .select("*")
  //   .order("start_date", { ascending: false });
  //
  // const list = (trips ?? []) as Trip[];

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12">
      <AppNav />
      <header className="mt-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">내 여행</h1>
          <p className="mt-1 text-sm text-slate-600">{user.email}</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/trips/new"
            className="inline-flex h-10 items-center justify-center rounded-full bg-slate-900 px-5 text-sm font-medium text-white hover:bg-slate-800"
          >
            새 여행
          </Link>
          <LogoutButton />
        </div>
      </header>

      <section className="mt-8">
        {list.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white/40 p-12 text-center">
            <p className="text-slate-600">아직 여행이 없습니다.</p>
            <Link
              href="/trips/new"
              className="mt-4 inline-flex h-10 items-center justify-center rounded-full bg-slate-900 px-5 text-sm font-medium text-white hover:bg-slate-800"
            >
              첫 여행 만들기
            </Link>
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {list.map((trip) => (
              <li key={trip.id}>
                <Link
                  href={`/trips/${trip.id}`}
                  className="block rounded-2xl border border-white/40 bg-white/60 p-5 shadow-sm backdrop-blur transition-shadow hover:shadow-md"
                >
                  <h2 className="text-lg font-semibold text-slate-900">
                    {trip.title}
                  </h2>
                  {trip.destination && (
                    <p className="mt-1 text-sm text-slate-600">
                      {trip.destination}
                    </p>
                  )}
                  <p className="mt-3 text-xs text-slate-500">
                    {trip.start_date} ~ {trip.end_date}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
