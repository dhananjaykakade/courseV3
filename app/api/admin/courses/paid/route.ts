import { type NextRequest, NextResponse } from "next/server"
import { supabaseDb } from "@/lib/services/supabase-database"


// GET - Fetch all paid courses
export async function GET(request: NextRequest) {
    try {
        const courses = await supabaseDb.getAllPaidCourses()
        return NextResponse.json(courses)
    } catch (error) {
        console.error("Error fetching paid courses:", error)
        return NextResponse.error()
    }
}