import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { supabaseDb } from "@/lib/services/supabase-database"
import { generateToken } from "@/lib/utils/jwt"
import type { LoginRequest, AuthResponse } from "@/lib/types/auth"

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json()
    const { email, password } = body

    // Validation
    if (!email || !password) {
      return NextResponse.json<AuthResponse>(
        { success: false, message: "Email and password are required" },
        { status: 400 },
      )
    }

    // Find user
    const user = await supabaseDb.getUserByEmail(email)
    if (!user) {
      return NextResponse.json<AuthResponse>({ success: false, message: "Invalid email or password" }, { status: 401 })
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json<AuthResponse>({ success: false, message: "Invalid email or password" }, { status: 401 })
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return NextResponse.json<AuthResponse>(
        { success: false, message: "Please verify your email before logging in" },
        { status: 403 },
      )
    }

    // Update last login
    await supabaseDb.updateUser(user.id, { lastLogin: new Date() })

    // Generate JWT token
    const token = generateToken(user)

    // Return user without password
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json<AuthResponse>({
      success: true,
      message: "Login successful",
      user: userWithoutPassword,
      token,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json<AuthResponse>({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
