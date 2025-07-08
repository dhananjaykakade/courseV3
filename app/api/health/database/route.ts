import { NextResponse } from "next/server"
import { checkSupabaseDatabaseHealth, supabaseDb } from "@/lib/services/supabase-database"

export async function GET() {
  try {
    const isHealthy = await checkSupabaseDatabaseHealth()
    const stats = await supabaseDb.getStats()

    if (isHealthy) {
      return NextResponse.json({
        success: true,
        message: "Supabase database is healthy",
        stats,
        timestamp: new Date().toISOString(),
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Supabase database health check failed",
          stats,
          timestamp: new Date().toISOString(),
        },
        { status: 503 },
      )
    }
  } catch (error) {
    console.error("Health check error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Health check failed",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
