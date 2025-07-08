import type { NextRequest } from "next/server"
import { verifyToken } from "@/lib/utils/jwt"
import { supabaseDb } from "@/lib/services/supabase-database"
import type { User } from "@/lib/types/auth"

export interface AuthenticatedRequest extends NextRequest {
  user?: User
}

export async function authenticateUser(request: NextRequest): Promise<{ user: User | null; error: string | null }> {
  try {
    const authHeader = request.headers.get("authorization")

    console.log("Auth header:", authHeader ? "Present" : "Missing")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("No valid authorization header")
      return { user: null, error: "No valid authorization header" }
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix
    console.log("Token extracted, length:", token.length)

    const payload = verifyToken(token)
    console.log("Token payload:", payload ? "Valid" : "Invalid")

    if (!payload) {
      console.log("Invalid or expired token")
      return { user: null, error: "Invalid or expired token" }
    }

    const user = await supabaseDb.getUserById(payload.userId)
    console.log("User found:", user ? user.email : "Not found")

    if (!user) {
      console.log("User not found in database")
      return { user: null, error: "User not found" }
    }

    if (!user.isEmailVerified) {
      console.log("User email not verified")
      return { user: null, error: "Email not verified" }
    }

    console.log("Authentication successful for user:", user.email)
    return { user, error: null }
  } catch (error) {
    console.error("Authentication error:", error)
    return { user: null, error: "Authentication failed" }
  }
}

export function requireRole(allowedRoles: ("admin" | "user")[]): (user: User) => boolean {
  return (user: User): boolean => {
    return allowedRoles.includes(user.role)
  }
}

// Helper function to check if user is admin
export function isAdmin(user: User): boolean {
  return user.role === "admin"
}

// Helper function to check if user is regular user
export function isUser(user: User): boolean {
  return user.role === "user"
}
