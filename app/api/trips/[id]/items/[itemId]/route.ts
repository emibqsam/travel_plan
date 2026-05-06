import { NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/server";
import { requireAuth } from "@/app/lib/auth";
import type { ApiResponse } from "@/app/lib/constants";
import type { TripItem } from "@/app/lib/types/trip";

export async function PATCH(
  request: Request,
  ctx: { params: Promise<{ id: string; itemId: string }> },
) {
  const auth = await requireAuth();
  if (auth.response) return auth.response;
  const { id, itemId } = await ctx.params;

  const payload = await request.json().catch(() => null);
  const update: Record<string, unknown> = {};
  if (typeof payload?.place === "string") update.place = payload.place.trim();
  if (typeof payload?.memo === "string" || payload?.memo === null)
    update.memo = payload.memo;
  if (typeof payload?.start_time === "string" || payload?.start_time === null)
    update.start_time = payload.start_time;
  if (Number.isInteger(payload?.day_number) && payload.day_number >= 1)
    update.day_number = payload.day_number;
  if (Number.isInteger(payload?.sort_order))
    update.sort_order = payload.sort_order;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trip_items")
    .update(update)
    .eq("id", itemId)
    .eq("trip_id", id)
    .select()
    .single();

  if (error) {
    const body: ApiResponse = { success: false, error: error.message };
    return NextResponse.json(body, { status: 500 });
  }
  const body: ApiResponse<TripItem> = { success: true, data: data as TripItem };
  return NextResponse.json(body);
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string; itemId: string }> },
) {
  const auth = await requireAuth();
  if (auth.response) return auth.response;
  const { id, itemId } = await ctx.params;

  const supabase = await createClient();
  const { error } = await supabase
    .from("trip_items")
    .delete()
    .eq("id", itemId)
    .eq("trip_id", id);

  if (error) {
    const body: ApiResponse = { success: false, error: error.message };
    return NextResponse.json(body, { status: 500 });
  }
  const body: ApiResponse = { success: true };
  return NextResponse.json(body);
}
