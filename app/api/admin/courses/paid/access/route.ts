import { type NextRequest, NextResponse } from "next/server"
import { authenticateUser, requireRole } from "@/lib/middleware/auth"
import { supabaseDb } from "@/lib/services/supabase-database"
import type { AuthResponse } from "@/lib/types/auth"

// create a route to give access to paid courses for specific user by admin 


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

    const accessData = await request.json()
    const { userEmail, courseId,currency,amount,payment_id,order_id } = accessData

const paymentDetails = {
    currency,
    amount,
    payment_id,
    order_id,
    payment_verified: true 
}
    // get user by email
    const userToAccess = await supabaseDb.getUserByEmail(userEmail)
    if (!userToAccess) {
        return NextResponse.json<AuthResponse>(
            { success: false, message: "User not found" },
            { status: 404 },
        )
    }
    // check if already enrolled or not
    const alreadyEnrolled = await supabaseDb.isUserEnrolled(userToAccess.id, courseId)
    if (alreadyEnrolled) {
        return NextResponse.json<AuthResponse>(
            { success: false, message: "User is already enrolled in this course" },
            { status: 400 },
        )
    }
    // Grant access to the paid course
    const grantedAccess = await supabaseDb.enrollUserInCourse(userToAccess.id, courseId, paymentDetails)
    if (!grantedAccess) {
        return NextResponse.error()
    }

    return NextResponse.json({ success: true, message: "Access granted successfully" }, { status: 200 })
}