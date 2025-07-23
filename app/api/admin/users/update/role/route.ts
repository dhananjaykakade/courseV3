import { type NextRequest, NextResponse } from "next/server"
import { authenticateUser, requireRole } from "@/lib/middleware/auth"
import { supabaseDb } from "@/lib/services/supabase-database"
import type { AuthResponse } from "@/lib/types/auth"

// POST - Update user role
export async function POST(request: NextRequest) {
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
const updateData = await request.json()
    const { userId, newRole } = updateData
    // Update user role
    const updatedUser = await supabaseDb.updateUserRole(userId, newRole)
    if (!updatedUser) {
        return NextResponse.error()
    }
    return NextResponse.json({ success: true, user: updatedUser }, { status: 200 })
}