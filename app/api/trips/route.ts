import { NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/server";
import { requireAuth } from "@/app/lib/auth";
import type { ApiResponse } from "@/app/lib/constants";
import type { Trip } from "@/app/lib/types/trip";

export async function GET() {
  const auth = await requireAuth();
  if (auth.response) return auth.response;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trips")
    .select("*")
    .order("start_date", { ascending: false });

  if (error) {
    const body: ApiResponse = { success: false, error: error.message };
    return NextResponse.json(body, { status: 500 });
  }
  const body: ApiResponse<Trip[]> = { success: true, data: data as Trip[] };
  return NextResponse.json(body);
}

export async function POST(request: Request) {
  const auth = await requireAuth();
  if (auth.response) return auth.response;

  const payload = await request.json().catch(() => null);
  const title = typeof payload?.title === "string" ? payload.title.trim() : "";
  const destination =
    typeof payload?.destination === "string" ? payload.destination.trim() : null;
  const start_date = payload?.start_date;
  const end_date = payload?.end_date;

  if (!title || !start_date || !end_date) {
    const body: ApiResponse = {
      success: false,
      error: "title, start_date, end_date 필수",
    };
    return NextResponse.json(body, { status: 400 });
  }
  if (new Date(end_date) < new Date(start_date)) {
    const body: ApiResponse = {
      success: false,
      error: "종료일은 시작일 이후여야 합니다",
    };
    return NextResponse.json(body, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trips")
    .insert({
      user_id: auth.user.id,
      title,
      destination: destination || null,
      start_date,
      end_date,
    })
    .select()
    .single();

  if (error) {
    const body: ApiResponse = { success: false, error: error.message };
    return NextResponse.json(body, { status: 500 });
  }
  const body: ApiResponse<Trip> = { success: true, data: data as Trip };
  return NextResponse.json(body, { status: 201 });
}
