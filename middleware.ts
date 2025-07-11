import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Server-side redirect before page render to avoid login flash
export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value
  const { pathname } = req.nextUrl

  // If user already authenticated, redirect away from auth pages
  if (token && ["/login", "/register", "/verify-email", "/reset-password"].includes(pathname)) {
    return NextResponse.redirect(new URL("/home", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/login", "/register", "/verify-email", "/reset-password"],
}
