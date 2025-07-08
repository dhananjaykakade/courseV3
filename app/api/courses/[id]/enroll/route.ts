import { type NextRequest, NextResponse } from "next/server"
import { supabaseDb } from "@/lib/services/supabase-database"
import { authenticateUser } from "@/lib/middleware/auth"

// POST - Enroll user in course
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("POST /api/courses/[id]/enroll - Course ID:", params.id)

    const { user, error } = await authenticateUser(request)
    console.log("Authentication result:", { user: user?.email, error })

    if (error || !user) {
      console.log("Authentication failed:", error)
      return NextResponse.json({ success: false, message: error || "Authentication required" }, { status: 401 })
    }

    // Check if course exists
    const course = await supabaseDb.getCourseById(params.id)
    if (!course) {
      console.log("Course not found")
      return NextResponse.json({ success: false, message: "Course not found" }, { status: 404 })
    }

    // Check if user is already enrolled
    const isAlreadyEnrolled = await supabaseDb.isUserEnrolled(user.id, params.id)
    if (isAlreadyEnrolled) {
      console.log("User already enrolled")
      return NextResponse.json({ success: false, message: "Already enrolled in this course" }, { status: 400 })
    }

    // Enroll user in course
    const success = await supabaseDb.enrollUserInCourse(user.id, params.id)
    console.log("Enrollment result:", success)

    if (!success) {
      return NextResponse.json({ success: false, message: "Failed to enroll in course" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Successfully enrolled in course",
    })
  } catch (error) {
    console.error("Error enrolling in course:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
