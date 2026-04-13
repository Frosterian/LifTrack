import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const PUBLIC_PATHS = ["/", "/login", "/register", "/auth/callback"];
const AUTH_PATHS = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);
  const { pathname } = request.nextUrl;

  const isProtected =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/workouts") ||
    pathname.startsWith("/programs") ||
    pathname.startsWith("/exercises") ||
    pathname.startsWith("/progress") ||
    pathname.startsWith("/timer") ||
    pathname.startsWith("/ai") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/admin");

  if (!user && isProtected) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (user && AUTH_PATHS.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|sounds|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp3)$).*)"],
};
