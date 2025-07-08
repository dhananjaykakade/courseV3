import { type NextRequest, NextResponse } from "next/server"
import { supabaseDb } from "@/lib/services/supabase-database"
import { authenticateUser, requireRole } from "@/lib/middleware/auth"

// GET - Get course by ID (public)
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("GET /api/courses/[id] - Course ID:", params.id)

    const course = await supabaseDb.getCourseById(params.id)

    if (!course) {
      console.log("Course not found")
      return NextResponse.json({ success: false, message: "Course not found" }, { status: 404 })
    }

    console.log("Course found:", course.title)
    return NextResponse.json({
      success: true,
      course,
    })
  } catch (error) {
    console.error("Error fetching course:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch course" }, { status: 500 })
  }
}

// PUT - Update course (admin only)
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("PUT /api/courses/[id] - Course ID:", params.id)

    const { user, error } = await authenticateUser(request)
    console.log("Authentication result:", { user: user?.email, error })

    if (error || !user) {
      console.log("Authentication failed:", error)
      return NextResponse.json({ success: false, message: error || "Authentication required" }, { status: 401 })
    }

    if (!requireRole(["admin"])(user)) {
      console.log("User is not admin:", user.role)
      return NextResponse.json({ success: false, message: "Admin access required" }, { status: 403 })
    }

    const courseData = await request.json()
    console.log("Updating course with data:", courseData.title)

    const course = await supabaseDb.updateCourse(params.id, courseData)

    if (!course) {
      console.log("Failed to update course")
      return NextResponse.json({ success: false, message: "Failed to update course" }, { status: 500 })
    }

    console.log("Course updated successfully")
    return NextResponse.json({
      success: true,
      message: "Course updated successfully",
      course,
    })
  } catch (error) {
    console.error("Error updating course:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

// DELETE - Delete course (admin only)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("DELETE /api/courses/[id] - Course ID:", params.id)

    const { user, error } = await authenticateUser(request)
    console.log("Authentication result:", { user: user?.email, error })

    if (error || !user) {
      console.log("Authentication failed:", error)
      return NextResponse.json({ success: false, message: error || "Authentication required" }, { status: 401 })
    }

    if (!requireRole(["admin"])(user)) {
      console.log("User is not admin:", user.role)
      return NextResponse.json({ success: false, message: "Admin access required" }, { status: 403 })
    }

    const success = await supabaseDb.deleteCourse(params.id)
    console.log("Delete result:", success)

    if (!success) {
      return NextResponse.json({ success: false, message: "Failed to delete course" }, { status: 500 })
    }

    console.log("Course deleted successfully")
    return NextResponse.json({
      success: true,
      message: "Course deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting course:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
