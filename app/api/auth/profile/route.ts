import { type NextRequest, NextResponse } from "next/server"
import { authenticateUser } from "@/lib/middleware/auth"
import type { AuthResponse } from "@/lib/types/auth"

export async function GET(request: NextRequest) {
  try {
    const { user, error } = await authenticateUser(request)

    if (error || !user) {
      return NextResponse.json<AuthResponse>(
        { success: false, message: error || "Authentication failed" },
        { status: 401 },
      )
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json<AuthResponse>({
      success: true,
      message: "Profile retrieved successfully",
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error("Profile retrieval error:", error)
    return NextResponse.json<AuthResponse>({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
