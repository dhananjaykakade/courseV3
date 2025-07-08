import { type NextRequest, NextResponse } from "next/server"
import { supabaseDb } from "@/lib/services/supabase-database"
import { authenticateUser } from "@/lib/middleware/auth"

// GET - Get course with user progress
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("GET /api/courses/[id]/progress - Course ID:", params.id)

    const { user, error } = await authenticateUser(request)
    console.log("Authentication result:", { user: user?.email, error })

    if (error || !user) {
      console.log("Authentication failed:", error)
      return NextResponse.json({ success: false, message: error || "Authentication required" }, { status: 401 })
    }

    console.log("Fetching course with progress for user:", user.email)
    const course = await supabaseDb.getCourseWithProgress(params.id, user.id)

    if (!course) {
      console.log("Course not found or user not enrolled")
      return NextResponse.json({ success: false, message: "Course not found or not enrolled" }, { status: 404 })
    }

    console.log("Course found, returning data")
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
    console.log("POST /api/courses/[id]/progress - Course ID:", params.id)

    const { user, error } = await authenticateUser(request)
    console.log("Authentication result:", { user: user?.email, error })

    if (error || !user) {
      console.log("Authentication failed:", error)
      return NextResponse.json({ success: false, message: error || "Authentication required" }, { status: 401 })
    }

    const { milestoneId } = await request.json()
    console.log("Milestone ID:", milestoneId)

    if (!milestoneId) {
      return NextResponse.json({ success: false, message: "Milestone ID is required" }, { status: 400 })
    }

    // Check if user is enrolled in the course
    const isEnrolled = await supabaseDb.isUserEnrolled(user.id, params.id)
    console.log("User enrolled:", isEnrolled)

    if (!isEnrolled) {
      return NextResponse.json({ success: false, message: "Not enrolled in this course" }, { status: 403 })
    }

    const success = await supabaseDb.markMilestoneComplete(user.id, params.id, milestoneId)
    console.log("Milestone marked complete:", success)

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
