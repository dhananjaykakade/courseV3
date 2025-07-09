import { type NextRequest, NextResponse } from "next/server"
import { supabaseDb } from "@/lib/services/supabase-database"
import type { VerifyEmailRequest, AuthResponse } from "@/lib/types/auth"

export async function POST(request: NextRequest) {
  try {
    const body: VerifyEmailRequest = await request.json()
    console.log("Body:", body)

    const { token } = body
    console.log("Token received:", token)


    if (!token) {
      return NextResponse.json<AuthResponse>(
        { success: false, message: "Verification token is required" },
        { status: 400 },
      )
    }

    // Find verification token
    const verificationToken = await supabaseDb.getVerificationToken(token)
    console.log("Fetched verificationToken:", verificationToken)

    if (!verificationToken) {
      return NextResponse.json<AuthResponse>(
        { success: false, message: "Invalid or expired verification token" },
        { status: 400 },
      )
    }

    // Check if token is expired
if (new Date(verificationToken.expiresAt) < new Date()) {
  return NextResponse.json<AuthResponse>(
    { success: false, message: "Verification token has expired" },
    { status: 400 },
  )
}


    // Check if token is for email verification
    if (verificationToken.type !== "email_verification") {
      return NextResponse.json<AuthResponse>({ success: false, message: "Invalid token type" }, { status: 400 })
    }

    // Get user and verify email
    const user = await supabaseDb.getUserById(verificationToken.userId)
    if (!user) {
      return NextResponse.json<AuthResponse>({ success: false, message: "User not found" }, { status: 404 })
    }

    if (user.isEmailVerified) {
      return NextResponse.json<AuthResponse>({ success: false, message: "Email is already verified" }, { status: 400 })
    }

    // Update user email verification status
    const updatedUser = await supabaseDb.updateUser(user.id, { isEmailVerified: true })

    // Mark token as used
    await supabaseDb.markTokenAsUsed(verificationToken.id)

    if (!updatedUser) {
      return NextResponse.json<AuthResponse>({ success: false, message: "Failed to verify email" }, { status: 500 })
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = updatedUser

    return NextResponse.json<AuthResponse>({
      success: true,
      message: "Email verified successfully! You can now log in.",
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error("Email verification error:", error)
    return NextResponse.json<AuthResponse>({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
