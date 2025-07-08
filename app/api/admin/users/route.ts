import { type NextRequest, NextResponse } from "next/server"
import { authenticateUser, requireRole } from "@/lib/middleware/auth"
import { supabaseDb } from "@/lib/services/supabase-database"
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

    // Check if user has admin role
    if (!requireRole(["admin"])(user)) {
      return NextResponse.json<AuthResponse>(
        { success: false, message: "Access denied. Admin role required." },
        { status: 403 },
      )
    }

    // Get all users
    const users = await supabaseDb.getAllUsers()

    // Remove passwords from response
    const usersWithoutPasswords = users.map(({ password: _, ...user }) => user)

    return NextResponse.json({
      success: true,
      message: "Users retrieved successfully",
      users: usersWithoutPasswords,
    })
  } catch (error) {
    console.error("Users retrieval error:", error)
    return NextResponse.json<AuthResponse>({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
