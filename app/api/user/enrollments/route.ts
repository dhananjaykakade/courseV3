import { type NextRequest, NextResponse } from "next/server"
import { supabaseDb } from "@/lib/services/supabase-database"
import { authenticateUser } from "@/lib/middleware/auth"

// GET - Get user's enrolled courses
export async function GET(request: NextRequest) {
  try {
    const { user, error } = await authenticateUser(request)

    if (error || !user) {
      return NextResponse.json({ success: false, message: error || "Authentication required" }, { status: 401 })
    }

    const enrollments = await supabaseDb.getUserEnrollments(user.id)

    return NextResponse.json({
      success: true,
      enrollments,
    })
  } catch (error) {
    console.error("Error fetching user enrollments:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
