import { NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/server";
import { requireAuth } from "@/app/lib/auth";
import type { ApiResponse } from "@/app/lib/constants";
import type { Trip } from "@/app/lib/types/trip";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const auth = await requireAuth();
  if (auth.response) return auth.response;
  const { id } = await ctx.params;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trips")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    const body: ApiResponse = { success: false, error: error.message };
    return NextResponse.json(body, { status: 404 });
  }
  const body: ApiResponse<Trip> = { success: true, data: data as Trip };
  return NextResponse.json(body);
}

export async function PATCH(
  request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const auth = await requireAuth();
  if (auth.response) return auth.response;
  const { id } = await ctx.params;

  const payload = await request.json().catch(() => null);
  const update: Record<string, unknown> = {};
  if (typeof payload?.title === "string") update.title = payload.title.trim();
  if (typeof payload?.destination === "string" || payload?.destination === null)
    update.destination = payload.destination;
  if (typeof payload?.start_date === "string") update.start_date = payload.start_date;
  if (typeof payload?.end_date === "string") update.end_date = payload.end_date;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trips")
    .update(update)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    const body: ApiResponse = { success: false, error: error.message };
    return NextResponse.json(body, { status: 500 });
  }
  const body: ApiResponse<Trip> = { success: true, data: data as Trip };
  return NextResponse.json(body);
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const auth = await requireAuth();
  if (auth.response) return auth.response;
  const { id } = await ctx.params;

  const supabase = await createClient();
  const { error } = await supabase.from("trips").delete().eq("id", id);

  if (error) {
    const body: ApiResponse = { success: false, error: error.message };
    return NextResponse.json(body, { status: 500 });
  }
  const body: ApiResponse = { success: true };
  return NextResponse.json(body);
}
