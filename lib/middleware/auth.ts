import type { NextRequest } from "next/server"
import { verifyToken } from "@/lib/utils/jwt"
import { supabaseDb } from "@/lib/services/supabase-database"
import type { User } from "@/lib/types/auth"
import { cookies } from "next/headers"

export interface AuthenticatedRequest extends NextRequest {
  user?: User
}

export async function authenticateUser(request: NextRequest): Promise<{ user: User | null; error: string | null }> {
  try {
    const cookieToken = cookies().get("token")?.value
    const authHeader = request.headers.get("authorization")

    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.substring(7)
      : cookieToken

    if (!token) {
      return { user: null, error: "Unauthorized" }
    }

    const payload = verifyToken(token)
    if (!payload) return { user: null, error: "Invalid or expired token" }

    const user = await supabaseDb.getUserById(payload.userId)
    if (!user || !user.isEmailVerified) {
      return { user: null, error: "Invalid user or email not verified" }
    }

    return { user, error: null }
  } catch (err) {
    console.error("Auth error:", err)
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
