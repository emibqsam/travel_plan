import { NextResponse } from "next/server";
import type { ApiResponse, AuthUser } from "@/app/lib/constants";
// MOCK AUTH: 복구 시 아래 import 주석 해제
// import { createClient } from "@/app/lib/supabase/server";

export const MOCK_USER: AuthUser = {
  id: "00000000-0000-0000-0000-000000000001",
  email: "mock@travelplan.local",
  role: "user",
};

export async function getAuthUser(): Promise<AuthUser | null> {
  // MOCK AUTH: 항상 MOCK_USER 반환. 복구 시 아래 블록 주석 해제하고 이 return 제거.
  return MOCK_USER;

  // const supabase = await createClient();
  // const {
  //   data: { user },
  // } = await supabase.auth.getUser();
  // if (!user || !user.email) return null;
  // return {
  //   id: user.id,
  //   email: user.email,
  //   role: (user.app_metadata?.role as string | undefined) ?? undefined,
  // };
}

export async function requireAuth(): Promise<
  { user: AuthUser; response?: never } | { user?: never; response: NextResponse }
> {
  const user = await getAuthUser();
  if (!user) {
    const body: ApiResponse = { success: false, error: "Unauthorized" };
    return { response: NextResponse.json(body, { status: 401 }) };
  }
  return { user };
}
