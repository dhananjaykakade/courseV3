import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { supabaseDb } from "@/lib/services/supabase-database"
import { generateToken } from "@/lib/utils/jwt"
import type { LoginRequest, AuthResponse } from "@/lib/types/auth"
import { serialize } from "cookie"

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json()
    const { email, password } = body

    // Step 1: Validate Input
    if (!email || !password) {
      return errorResponse("Email and password are required", 400)
    }

    // Step 2: Find user by email
    const user = await supabaseDb.getUserByEmail(email)
    if (!user) {
      return errorResponse("Invalid email or password", 401)
    }

    // Step 3: Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return errorResponse("Invalid email or password", 401)
    }

    // Step 4: Check if email is verified
    if (!user.isEmailVerified) {
      return errorResponse("Please verify your email before logging in", 403)
    }

    // Step 5: Update last login
    await supabaseDb.updateUser(user.id, { lastLogin: new Date() })

    // Step 6: Generate JWT token
    const token = generateToken(user)

    // Step 7: Strip password before sending response
    const { password: _, ...userWithoutPassword } = user

    // Step 8 (Optional): Set JWT as HttpOnly cookie
    const response = NextResponse.json<AuthResponse>({
      success: true,
      message: "Login successful",
      user: userWithoutPassword,
      token,
    })

    response.headers.set(
      "Set-Cookie",
      serialize("token", token, {
        httpOnly: true,
        secure: process.env.NEXT_PUBLIC_ENVIRONMENT === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      }),
    )

    return response
  } catch (error) {
    console.error("Login error:", error)
    return errorResponse("Internal server error", 500)
  }
}

function errorResponse(message: string, status: number) {
  return NextResponse.json<AuthResponse>(
    {
      success: false,
      message,
    },
    { status },
  )
}
