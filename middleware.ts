import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "@/lib/utils/jwt"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  try {
    const user = verifyToken(token)
    
    if (user?.role !== "admin") {
      return NextResponse.redirect(new URL("/home", request.url))
    }
  } catch (err) {
    console.error("Token verification failed:", err)
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin"], // Protects /admin and all subpaths
}
