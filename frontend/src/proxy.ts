import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/supabase/middleware";
import { isRouteAuthorized, UserRole } from "@/lib/rbac/permissions";

const PUBLIC_PATHS = [
  "/",
  "/student/login",
  "/hr/login",
  "/pto/login",
  "/faculty/login",
  "/principal/login",
  "/csr-manager/login",
  "/management/login",
  "/admin/login",
  "/student/register",
  "/student/registration",
  "/student/forgot-password",
  "/student/reset-password",
  "/student/logout",
  "/auth/login",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/access-denied",
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Allow public static assets and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/api") ||
    pathname.includes("favicon.ico") ||
    pathname.includes(".svg") ||
    pathname.includes(".png") ||
    pathname.includes(".jpg") ||
    pathname.includes(".jpeg")
  ) {
    return NextResponse.next();
  }

  // 2. Allow explicitly public paths
  if (
    PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith("/auth/") || pathname.startsWith("/student/register"))
  ) {
    return NextResponse.next();
  }

  // 3. Inspect Supabase session / active user role
  const { response, userRole } = await updateSession(request);

  // Active role resolution from Supabase JWT or secure active role cookie
  const roleCookie = request.cookies.get("gqt_active_role")?.value as UserRole | undefined;
  let activeRole: UserRole | undefined;
  if (pathname.startsWith("/student")) {
    activeRole = (roleCookie === "student" ? "student" : userRole) || roleCookie;
  } else {
    activeRole = userRole || roleCookie;
  }

  // If unauthenticated, redirect to respective authority portal login
  if (!activeRole) {
    if (pathname.startsWith("/student")) {
      return NextResponse.redirect(new URL("/student/login", request.url));
    }
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    if (pathname.startsWith("/hr")) {
      return NextResponse.redirect(new URL("/hr/login", request.url));
    }
    if (pathname.startsWith("/tpo")) {
      return NextResponse.redirect(new URL("/tpo/login", request.url));
    }
    if (pathname.startsWith("/faculty")) {
      return NextResponse.redirect(new URL("/faculty/login", request.url));
    }
    if (pathname.startsWith("/principal")) {
      return NextResponse.redirect(new URL("/principal/login", request.url));
    }
    if (pathname.startsWith("/management")) {
      return NextResponse.redirect(new URL("/management/login", request.url));
    }
    if (pathname.startsWith("/csr-manager")) {
      return NextResponse.redirect(new URL("/csr-manager/login", request.url));
    }
    // Default staff portal unauthenticated redirect
    return NextResponse.redirect(new URL("/csr-manager/login", request.url));
  }

  // Pure role-isolation: Students cannot access staff portal routes
  if (
    activeRole === "student" &&
    (pathname.startsWith("/portal") ||
      pathname.startsWith("/hr") ||
      pathname.startsWith("/csr-manager") ||
      pathname.startsWith("/admin"))
  ) {
    return NextResponse.redirect(new URL("/student/dashboard", request.url));
  }

  // Non-students cannot access /student/* — send to /student/login
  if (
    activeRole !== "student" &&
    activeRole !== "super_admin" &&
    pathname.startsWith("/student")
  ) {
    return NextResponse.redirect(new URL("/student/login", request.url));
  }

  // 4. Check route authorization
  const isAuthorized = isRouteAuthorized(activeRole, pathname);

  if (!isAuthorized) {
    if (pathname.startsWith("/student")) {
      return NextResponse.redirect(new URL("/student/login", request.url));
    }
    const accessDeniedUrl = new URL("/access-denied", request.url);
    accessDeniedUrl.searchParams.set("from", pathname);
    accessDeniedUrl.searchParams.set("role", activeRole);
    return NextResponse.redirect(accessDeniedUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/student/:path*",
    "/hr/:path*",
    "/csr-manager/:path*",
    "/admin/:path*",
    "/pto/:path*",
    "/faculty/:path*",
    "/principal/:path*",
    "/management/:path*",
    "/portal/:path*",
    "/access-denied",
  ],
};
