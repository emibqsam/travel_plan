import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/app/lib/supabase/server";
import { getAuthUser } from "@/app/lib/auth";
import type { Trip, TripItem } from "@/app/lib/types/trip";
import { TripEditor } from "./trip-editor";

export const dynamic = "force-dynamic";

export default async function TripDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getAuthUser();
  if (!user) redirect("/login");
  const { id } = await params;

  const supabase = await createClient();
  const { data: trip } = await supabase
    .from("trips")
    .select("*")
    .eq("id", id)
    .single();

  if (!trip) notFound();

  const { data: items } = await supabase
    .from("trip_items")
    .select("*")
    .eq("trip_id", id)
    .order("day_number", { ascending: true })
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12">
      <Link href="/dashboard" className="text-sm text-slate-600 hover:underline">
        ← 대시보드
      </Link>
      <TripEditor
        trip={trip as Trip}
        initialItems={(items ?? []) as TripItem[]}
      />
    </div>
  );
}
