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

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return { user: null, error: "No valid authorization header" }
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix
    const payload = verifyToken(token)

    if (!payload) {
      return { user: null, error: "Invalid or expired token" }
    }

    const user = await supabaseDb.getUserById(payload.userId)

    if (!user) {
      return { user: null, error: "User not found" }
    }

    if (!user.isEmailVerified) {
      return { user: null, error: "Email not verified" }
    }

    return { user, error: null }
  } catch (error) {
    console.error("Authentication error:", error)
    return { user: null, error: "Authentication failed" }
  }
}

export function requireRole(allowedRoles: ("admin" | "user")[]): (user: User) => boolean {
  // debug 
  console.log("Checking user role against allowed roles:", allowedRoles)
  if (!Array.isArray(allowedRoles) || allowedRoles.length === 0) {
    throw new Error("Allowed roles must be a non-empty array")
  }

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
