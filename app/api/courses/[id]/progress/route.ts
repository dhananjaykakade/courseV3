import { type NextRequest, NextResponse } from "next/server"
import { supabaseDb } from "@/lib/services/supabase-database"
import { authenticateUser } from "@/lib/middleware/auth"

// GET - Get course with user progress
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { user, error } = await authenticateUser(request)

    if (error || !user) {
      return NextResponse.json({ success: false, message: error || "Authentication required" }, { status: 401 })
    }

    const course = await supabaseDb.getCourseWithProgress(params.id, user.id)

    if (!course) {
      return NextResponse.json({ success: false, message: "Course not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      course,
    })
  } catch (error) {
    console.error("Error fetching course with progress:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

// POST - Mark milestone as complete
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { user, error } = await authenticateUser(request)

    if (error || !user) {
      return NextResponse.json({ success: false, message: error || "Authentication required" }, { status: 401 })
    }

    const { milestoneId } = await request.json()

    if (!milestoneId) {
      return NextResponse.json({ success: false, message: "Milestone ID is required" }, { status: 400 })
    }

    const success = await supabaseDb.markMilestoneComplete(user.id, params.id, milestoneId)

    if (!success) {
      return NextResponse.json({ success: false, message: "Failed to mark milestone as complete" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Milestone marked as complete",
    })
  } catch (error) {
    console.error("Error marking milestone complete:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
