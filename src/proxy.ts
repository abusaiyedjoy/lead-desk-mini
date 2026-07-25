import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/session";

// Routes that require authentication
const PROTECTED_PATHS = ["/admin"];
// Routes that should redirect logged-in users away (e.g., login page)
const AUTH_PATHS = ["/admin/login"];

const COOKIE_NAME = "leaddesk_session";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PATHS.some(
    (path) => pathname.startsWith(path) && !AUTH_PATHS.includes(pathname)
  );
  const isAuthPath = AUTH_PATHS.includes(pathname);

  const token = request.cookies.get(COOKIE_NAME)?.value;
  const session = await decrypt(token);
  const isAuthenticated = !!session;

  // Redirect unauthenticated users trying to access protected routes
  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from the login page
  if (isAuthPath && isAuthenticated) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Match /admin and all sub-paths, including /admin/login
  matcher: ["/admin/:path*"],
};
