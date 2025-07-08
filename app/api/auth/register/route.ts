import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { supabaseDb, checkSupabaseDatabaseHealth } from "@/lib/services/supabase-database"
import { emailService } from "@/lib/services/email"
import { generateVerificationToken } from "@/lib/utils/jwt"
import type { RegisterRequest, AuthResponse } from "@/lib/types/auth"

export async function POST(request: NextRequest) {
  try {
    // Parse request body with error handling
    let body: RegisterRequest
    try {
      body = await request.json()
    } catch (parseError) {
      console.error("JSON parse error:", parseError)
      return NextResponse.json<AuthResponse>({ success: false, message: "Invalid request format" }, { status: 400 })
    }

    const { email, password, name, contactNumber } = body

    // Validation
    if (!email || !password || !name) {
      return NextResponse.json<AuthResponse>(
        { success: false, message: "Email, password, and name are required" },
        { status: 400 },
      )
    }

    if (typeof email !== "string" || typeof password !== "string" || typeof name !== "string") {
      return NextResponse.json<AuthResponse>(
        { success: false, message: "Invalid data types provided" },
        { status: 400 },
      )
    }

    if (password.length < 6) {
      return NextResponse.json<AuthResponse>(
        { success: false, message: "Password must be at least 6 characters long" },
        { status: 400 },
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json<AuthResponse>(
        { success: false, message: "Please provide a valid email address" },
        { status: 400 },
      )
    }

    // Check database health
    try {
      const isDbHealthy = await checkSupabaseDatabaseHealth()
      if (!isDbHealthy) {
        console.error("Supabase database health check failed")
        return NextResponse.json<AuthResponse>(
          { success: false, message: "Service temporarily unavailable. Please try again later." },
          { status: 503 },
        )
      }
    } catch (healthError) {
      console.error("Supabase database health check error:", healthError)
      return NextResponse.json<AuthResponse>(
        { success: false, message: "Service temporarily unavailable. Please try again later." },
        { status: 503 },
      )
    }

    // Check if user already exists
    let existingUser
    try {
      existingUser = await supabaseDb.getUserByEmail(email)
    } catch (dbError) {
      console.error("Database query error:", dbError)
      return NextResponse.json<AuthResponse>(
        { success: false, message: "Database error. Please try again later." },
        { status: 500 },
      )
    }

    if (existingUser) {
      return NextResponse.json<AuthResponse>(
        { success: false, message: "User with this email already exists" },
        { status: 409 },
      )
    }

    // Hash password
    let hashedPassword: string
    try {
      hashedPassword = await bcrypt.hash(password, 12)
    } catch (hashError) {
      console.error("Password hashing error:", hashError)
      return NextResponse.json<AuthResponse>(
        { success: false, message: "Password processing error. Please try again." },
        { status: 500 },
      )
    }

    // Create user
    let user
    try {
      user = await supabaseDb.createUser({
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        name: name.trim(),
        contactNumber: contactNumber?.trim(),
        role: "user",
        isEmailVerified: false,
      })
    } catch (createError) {
      console.error("User creation error:", createError)
      return NextResponse.json<AuthResponse>(
        { success: false, message: "Failed to create user account. Please try again." },
        { status: 500 },
      )
    }

    // Generate verification token
    let verificationToken: string
    try {
      verificationToken = generateVerificationToken()
      const expiresAt = new Date()
      expiresAt.setHours(expiresAt.getHours() + 24) // 24 hours expiry

      await supabaseDb.createVerificationToken({
        userId: user.id,
        token: verificationToken,
        type: "email_verification",
        expiresAt,
        isUsed: false,
      })
    } catch (tokenError) {
      console.error("Verification token creation error:", tokenError)
      // Continue without failing - user can request new verification later
    }

    // Send verification email
    try {
      if (verificationToken) {
        const emailSent = await emailService.sendVerificationEmail(user.email, user.name, verificationToken)
        if (!emailSent) {
          console.error("Failed to send verification email to:", user.email)
        }
      }
    } catch (emailError) {
      console.error("Email service error:", emailError)
      // Continue - email failure shouldn't fail registration
    }

    // Return success response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json<AuthResponse>(
      {
        success: true,
        message: "Registration successful! Please check your email to verify your account.",
        user: userWithoutPassword,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Unexpected registration error:", error)

    // Ensure we always return valid JSON
    return NextResponse.json<AuthResponse>(
      {
        success: false,
        message: "An unexpected error occurred. Please try again later.",
      },
      { status: 500 },
    )
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json<AuthResponse>({ success: false, message: "Method not allowed" }, { status: 405 })
}

export async function PUT() {
  return NextResponse.json<AuthResponse>({ success: false, message: "Method not allowed" }, { status: 405 })
}

export async function DELETE() {
  return NextResponse.json<AuthResponse>({ success: false, message: "Method not allowed" }, { status: 405 })
}
