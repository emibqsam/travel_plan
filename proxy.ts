import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/app/lib/supabase/middleware";
import { AUTH_ROUTES, PROTECTED_ROUTES } from "@/app/lib/constants";

const ALLOWED_ORIGINS = (process.env.CORS_ORIGIN || "http://localhost:3000")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const THROTTLE_TTL = parseInt(process.env.THROTTLE_TTL || "60000", 10);
const THROTTLE_LIMIT = parseInt(process.env.THROTTLE_LIMIT || "100", 10);

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

function rateLimit(key: string): { ok: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    const resetAt = now + THROTTLE_TTL;
    buckets.set(key, { count: 1, resetAt });
    return { ok: true, remaining: THROTTLE_LIMIT - 1, resetAt };
  }
  bucket.count += 1;
  const ok = bucket.count <= THROTTLE_LIMIT;
  return { ok, remaining: Math.max(0, THROTTLE_LIMIT - bucket.count), resetAt: bucket.resetAt };
}

function clientKey(request: NextRequest): string {
  const xff = request.headers.get("x-forwarded-for");
  const ip = xff?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "anon";
  return ip;
}

function applyCors(request: NextRequest, response: NextResponse): NextResponse {
  const origin = request.headers.get("origin");
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Vary", "Origin");
    response.headers.set("Access-Control-Allow-Credentials", "true");
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization",
    );
  }
  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isApi = pathname.startsWith("/api");

  // CORS preflight
  if (isApi && request.method === "OPTIONS") {
    return applyCors(request, new NextResponse(null, { status: 204 }));
  }

  // Rate limit (API only)
  if (isApi) {
    const { ok, remaining, resetAt } = rateLimit(clientKey(request));
    if (!ok) {
      const res = new NextResponse("Too Many Requests", {
        status: 429,
        headers: {
          "Retry-After": Math.ceil((resetAt - Date.now()) / 1000).toString(),
          "X-RateLimit-Limit": THROTTLE_LIMIT.toString(),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": Math.ceil(resetAt / 1000).toString(),
        },
      });
      return applyCors(request, res);
    }
    const res = NextResponse.next({ request });
    res.headers.set("X-RateLimit-Limit", THROTTLE_LIMIT.toString());
    res.headers.set("X-RateLimit-Remaining", remaining.toString());
    res.headers.set("X-RateLimit-Reset", Math.ceil(resetAt / 1000).toString());
    return applyCors(request, res);
  }

  // Supabase session refresh + auth gating (non-API routes)
  const { user, supabaseResponse } = await updateSession(request);

  const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = AUTH_ROUTES.LOGIN;
    url.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(url);
  }

  const isAuthRoute = Object.values(AUTH_ROUTES).some((route) =>
    pathname.startsWith(route),
  );
  if (isAuthRoute && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
