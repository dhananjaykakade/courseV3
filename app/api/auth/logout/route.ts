import { NextResponse } from "next/server"
import { serialize } from "cookie"

export async function POST() {
  const res = NextResponse.json({ success: true, message: "Logged out" })
  res.headers.set(
    "Set-Cookie",
    serialize("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 0,
    }),
  )
  res.headers.append(
    "Set-Cookie",
    serialize("logged_in", "", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    }),
  )
  return res
}
