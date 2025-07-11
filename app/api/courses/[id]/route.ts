import { type NextRequest, NextResponse } from "next/server"
import { supabaseDb } from "@/lib/services/supabase-database"
import { authenticateUser, requireRole } from "@/lib/middleware/auth"

// GET - Get course by ID (public)
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {

    const course = await supabaseDb.getCourseById(params.id)

    if (!course) {
      return NextResponse.json({ success: false, message: "Course not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      course,
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to fetch course" }, { status: 500 })
  }
}

// PUT - Update course (admin only)
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {

    const { user, error } = await authenticateUser(request)

    if (error || !user) {
      return NextResponse.json({ success: false, message: error || "Authentication required" }, { status: 401 })
    }

    if (!requireRole(["admin"])(user)) {
      return NextResponse.json({ success: false, message: "Admin access required" }, { status: 403 })
    }

    const courseData = await request.json()
    const course = await supabaseDb.updateCourse(params.id, courseData)

    if (!course) {
      return NextResponse.json({ success: false, message: "Failed to update course" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Course updated successfully",
      course,
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

// DELETE - Delete course (admin only)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {

    const { user, error } = await authenticateUser(request)

    if (error || !user) {
      return NextResponse.json({ success: false, message: error || "Authentication required" }, { status: 401 })
    }

    if (!requireRole(["admin"])(user)) {
      return NextResponse.json({ success: false, message: "Admin access required" }, { status: 403 })
    }

    const success = await supabaseDb.deleteCourse(params.id)

    if (!success) {
      return NextResponse.json({ success: false, message: "Failed to delete course" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Course deleted successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
