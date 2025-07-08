import { type NextRequest, NextResponse } from "next/server"
import { supabaseDb } from "@/lib/services/supabase-database"
import { emailService } from "@/lib/services/email"
import { generateVerificationToken } from "@/lib/utils/jwt"
import type { ResetPasswordRequest, AuthResponse } from "@/lib/types/auth"

export async function POST(request: NextRequest) {
  try {
    const body: ResetPasswordRequest = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json<AuthResponse>({ success: false, message: "Email is required" }, { status: 400 })
    }

    // Find user
    const user = await supabaseDb.getUserByEmail(email)
    if (!user) {
      // Don't reveal if email exists or not for security
      return NextResponse.json<AuthResponse>({
        success: true,
        message: "If an account with this email exists, you will receive a password reset link.",
      })
    }

    // Generate reset token
    const resetToken = generateVerificationToken()
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 1) // 1 hour expiry

    await supabaseDb.createVerificationToken({
      userId: user.id,
      token: resetToken,
      type: "password_reset",
      expiresAt,
      isUsed: false,
    })

    // Send reset email
    const emailSent = await emailService.sendPasswordResetEmail(user.email, user.name, resetToken)

    if (!emailSent) {
      console.error("Failed to send password reset email")
    }

    return NextResponse.json<AuthResponse>({
      success: true,
      message: "If an account with this email exists, you will receive a password reset link.",
    })
  } catch (error) {
    console.error("Password reset request error:", error)
    return NextResponse.json<AuthResponse>({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
