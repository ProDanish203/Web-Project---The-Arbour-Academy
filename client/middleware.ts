import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const publicPaths = ["/login", "/", "/admission"];

  const privatePaths = [
    "/dashboard/admin",
    "/dashboard/admin/admissions",
    "/dashboard/admin/teachers",
    "/dashboard/teacher",
    "/dashboard/teacher/attendance",
    "/dashboard/parent",
    "/dashboard/parent/children",
  ];
  const isPrivatePath = privatePaths.includes(path);

  const token = request.cookies.get("token")?.value;

  if (isPrivatePath && !token) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  if (path === "/login" && token) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/",
    "/admission",
    "/dashboard/admin",
    "/dashboard/admin/admissions",
    "/dashboard/admin/teachers",
    "/dashboard/teacher",
    "/dashboard/teacher/attendance",
    "/dashboard/parent",
    "/dashboard/parent/children",
  ],
};
