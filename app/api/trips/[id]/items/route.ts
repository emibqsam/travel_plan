import { NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/server";
import { requireAuth } from "@/app/lib/auth";
import type { ApiResponse } from "@/app/lib/constants";
import type { TripItem } from "@/app/lib/types/trip";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const auth = await requireAuth();
  if (auth.response) return auth.response;
  const { id } = await ctx.params;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trip_items")
    .select("*")
    .eq("trip_id", id)
    .order("day_number", { ascending: true })
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    const body: ApiResponse = { success: false, error: error.message };
    return NextResponse.json(body, { status: 500 });
  }
  const body: ApiResponse<TripItem[]> = { success: true, data: data as TripItem[] };
  return NextResponse.json(body);
}

export async function POST(
  request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const auth = await requireAuth();
  if (auth.response) return auth.response;
  const { id } = await ctx.params;

  const payload = await request.json().catch(() => null);
  const day_number = Number(payload?.day_number);
  const place = typeof payload?.place === "string" ? payload.place.trim() : "";
  const start_time =
    typeof payload?.start_time === "string" && payload.start_time
      ? payload.start_time
      : null;
  const memo = typeof payload?.memo === "string" ? payload.memo.trim() || null : null;

  if (!Number.isInteger(day_number) || day_number < 1 || !place) {
    const body: ApiResponse = {
      success: false,
      error: "day_number(>=1), place 필수",
    };
    return NextResponse.json(body, { status: 400 });
  }

  const supabase = await createClient();
  const { data: maxRow } = await supabase
    .from("trip_items")
    .select("sort_order")
    .eq("trip_id", id)
    .eq("day_number", day_number)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextSort = (maxRow?.sort_order ?? -1) + 1;

  const { data, error } = await supabase
    .from("trip_items")
    .insert({
      trip_id: id,
      day_number,
      place,
      start_time,
      memo,
      sort_order: nextSort,
    })
    .select()
    .single();

  if (error) {
    const body: ApiResponse = { success: false, error: error.message };
    return NextResponse.json(body, { status: 500 });
  }
  const body: ApiResponse<TripItem> = { success: true, data: data as TripItem };
  return NextResponse.json(body, { status: 201 });
}
