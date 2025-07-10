import { type NextRequest, NextResponse } from "next/server"
import { supabaseDb } from "@/lib/services/supabase-database"
import { authenticateUser, requireRole } from "@/lib/middleware/auth"

// GET - Get all courses (public) – include the current user's enrollment status if authenticated
export async function GET(request: NextRequest) {
  try {
    // Fetch all courses (generic)
    const courses = await supabaseDb.getAllCourses()

    // Attempt to authenticate user – this helper never throws, it just returns error if not logged in
    const { user } = await authenticateUser(request)

    if (user) {
      // Get list of courses the user is enrolled in
      const enrollments = await supabaseDb.getUserEnrollments(user.id)
      const enrolledIds = new Set(enrollments.map((e: any) => e.id || e.courseId || e.course_id))

      // Attach isPurchased flag
      for (const course of courses) {
        course.isPurchased = enrolledIds.has(course.id)
      }
    }

    return NextResponse.json({
      success: true,
      courses,
    })
  } catch (error) {
    console.error("Error fetching courses:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch courses" }, { status: 500 })
  }
}

// POST - Create new course (admin only)
export async function POST(request: NextRequest) {
  try {
    const { user, error } = await authenticateUser(request)

    if (error || !user) {
      return NextResponse.json({ success: false, message: error || "Authentication required" }, { status: 401 })
    }

    if (!requireRole(["admin"])(user)) {
      return NextResponse.json({ success: false, message: "Admin access required" }, { status: 403 })
    }

    const courseData = await request.json()

    // Validate required fields
    if (!courseData.title || !courseData.description) {
      return NextResponse.json({ success: false, message: "Title and description are required" }, { status: 400 })
    }

    const course = await supabaseDb.createCourse({
      ...courseData,
      instructor: courseData.instructor || user.name,
    })

    if (!course) {
      return NextResponse.json({ success: false, message: "Failed to create course" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Course created successfully",
      course,
    })
  } catch (error) {
    console.error("Error creating course:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
