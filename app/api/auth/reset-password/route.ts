import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { supabaseDb } from "@/lib/services/supabase-database"
import type { ConfirmResetRequest, AuthResponse } from "@/lib/types/auth"

export async function POST(request: NextRequest) {
  try {
    const body: ConfirmResetRequest = await request.json()
    const { token, newPassword } = body

    if (!token || !newPassword) {
      return NextResponse.json<AuthResponse>(
        { success: false, message: "Token and new password are required" },
        { status: 400 },
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json<AuthResponse>(
        { success: false, message: "Password must be at least 6 characters long" },
        { status: 400 },
      )
    }

    // Find reset token
    const resetToken = await supabaseDb.getVerificationToken(token)

    if (!resetToken) {
      return NextResponse.json<AuthResponse>(
        { success: false, message: "Invalid or expired reset token" },
        { status: 400 },
      )
    }

    // Check if token is expired
    if (resetToken.expiresAt < new Date()) {
      return NextResponse.json<AuthResponse>({ success: false, message: "Reset token has expired" }, { status: 400 })
    }

    // Check if token is for password reset
    if (resetToken.type !== "password_reset") {
      return NextResponse.json<AuthResponse>({ success: false, message: "Invalid token type" }, { status: 400 })
    }

    // Get user
    const user = await supabaseDb.getUserById(resetToken.userId)
    if (!user) {
      return NextResponse.json<AuthResponse>({ success: false, message: "User not found" }, { status: 404 })
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12)

    // Update user password
    const updatedUser = await supabaseDb.updateUser(user.id, { password: hashedPassword })

    // Mark token as used
    await supabaseDb.markTokenAsUsed(resetToken.id)

    if (!updatedUser) {
      return NextResponse.json<AuthResponse>({ success: false, message: "Failed to reset password" }, { status: 500 })
    }

    return NextResponse.json<AuthResponse>({
      success: true,
      message: "Password reset successfully! You can now log in with your new password.",
    })
  } catch (error) {
    console.error("Password reset error:", error)
    return NextResponse.json<AuthResponse>({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
