import type { User, VerificationToken } from "@/lib/types/auth"
import bcrypt from "bcryptjs"

// Simulated database - In production, use a real database
class DatabaseService {
  private users: Map<string, User> = new Map()
  private verificationTokens: Map<string, VerificationToken> = new Map()
  private isInitialized = false
  private initializationPromise: Promise<void> | null = null

  constructor() {
    // Don't initialize in constructor to avoid blocking
  }

  private async initialize(): Promise<void> {
    if (this.isInitialized) {
      return
    }

    if (this.initializationPromise) {
      return this.initializationPromise
    }

    this.initializationPromise = this.performInitialization()
    return this.initializationPromise
  }

  private async performInitialization(): Promise<void> {
    try {
      await this.initializeAdminUser()
      this.isInitialized = true
      console.log("✅ Database service initialized successfully")
    } catch (error) {
      console.error("❌ Database initialization failed:", error)
      this.isInitialized = false
      this.initializationPromise = null
      throw new Error("Database initialization failed")
    }
  }

  private async initializeAdminUser(): Promise<void> {
    try {
      const adminId = "admin-1"
      const hashedPassword = await bcrypt.hash("admin123", 12)

      const adminUser: User = {
        id: adminId,
        email: "admin@learnhub.com",
        password: hashedPassword,
        name: "System Administrator",
        role: "admin",
        isEmailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        contactNumber: "+91 9999999999",
      }

      this.users.set(adminId, adminUser)
      console.log("👤 Admin user initialized:", adminUser.email)
    } catch (error) {
      console.error("Failed to initialize admin user:", error)
      throw error
    }
  }

  // Ensure database is initialized before operations
  private async ensureInitialized(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize()
    }
  }

  // User operations
  async createUser(userData: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
    try {
      await this.ensureInitialized()

      // Validate required fields
      if (!userData.email || !userData.password || !userData.name) {
        throw new Error("Missing required user data")
      }

      const id = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      const user: User = {
        ...userData,
        id,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      this.users.set(id, user)
      console.log("✅ User created successfully:", user.email)
      return user
    } catch (error) {
      console.error("❌ Error creating user:", error)
      throw new Error(`Failed to create user: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      await this.ensureInitialized()

      if (!id || typeof id !== "string") {
        return null
      }

      const user = this.users.get(id) || null
      return user
    } catch (error) {
      console.error("❌ Error getting user by ID:", error)
      return null
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      await this.ensureInitialized()

      if (!email || typeof email !== "string") {
        return null
      }

      const normalizedEmail = email.toLowerCase().trim()

      for (const user of this.users.values()) {
        if (user.email.toLowerCase() === normalizedEmail) {
          return user
        }
      }
      return null
    } catch (error) {
      console.error("❌ Error getting user by email:", error)
      return null
    }
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    try {
      await this.ensureInitialized()

      if (!id || typeof id !== "string") {
        return null
      }

      const user = this.users.get(id)
      if (!user) {
        console.warn("⚠️ User not found for update:", id)
        return null
      }

      const updatedUser = {
        ...user,
        ...updates,
        updatedAt: new Date(),
      }

      this.users.set(id, updatedUser)
      console.log("✅ User updated successfully:", updatedUser.email)
      return updatedUser
    } catch (error) {
      console.error("❌ Error updating user:", error)
      return null
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      await this.ensureInitialized()

      if (!id || typeof id !== "string") {
        return false
      }

      const result = this.users.delete(id)
      if (result) {
        console.log("✅ User deleted successfully:", id)
      }
      return result
    } catch (error) {
      console.error("❌ Error deleting user:", error)
      return false
    }
  }

  // Verification token operations
  async createVerificationToken(tokenData: Omit<VerificationToken, "id" | "createdAt">): Promise<VerificationToken> {
    try {
      await this.ensureInitialized()

      if (!tokenData.userId || !tokenData.token || !tokenData.type) {
        throw new Error("Missing required token data")
      }

      const id = `token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      const token: VerificationToken = {
        ...tokenData,
        id,
        createdAt: new Date(),
      }

      this.verificationTokens.set(id, token)
      console.log("✅ Verification token created:", token.type, "for user:", token.userId)
      return token
    } catch (error) {
      console.error("❌ Error creating verification token:", error)
      throw new Error(
        `Failed to create verification token: ${error instanceof Error ? error.message : "Unknown error"}`,
      )
    }
  }

  async getVerificationToken(token: string): Promise<VerificationToken | null> {
    try {
      await this.ensureInitialized()

      if (!token || typeof token !== "string") {
        return null
      }

      for (const verificationToken of this.verificationTokens.values()) {
        if (verificationToken.token === token && !verificationToken.isUsed) {
          return verificationToken
        }
      }
      return null
    } catch (error) {
      console.error("❌ Error getting verification token:", error)
      return null
    }
  }

  async markTokenAsUsed(tokenId: string): Promise<boolean> {
    try {
      await this.ensureInitialized()

      if (!tokenId || typeof tokenId !== "string") {
        return false
      }

      const token = this.verificationTokens.get(tokenId)
      if (!token) {
        console.warn("⚠️ Token not found for marking as used:", tokenId)
        return false
      }

      token.isUsed = true
      this.verificationTokens.set(tokenId, token)
      console.log("✅ Token marked as used:", tokenId)
      return true
    } catch (error) {
      console.error("❌ Error marking token as used:", error)
      return false
    }
  }

  async cleanupExpiredTokens(): Promise<void> {
    try {
      await this.ensureInitialized()

      const now = new Date()
      let cleanedCount = 0

      for (const [id, token] of this.verificationTokens.entries()) {
        if (token.expiresAt < now) {
          this.verificationTokens.delete(id)
          cleanedCount++
        }
      }

      if (cleanedCount > 0) {
        console.log(`🧹 Cleaned up ${cleanedCount} expired tokens`)
      }
    } catch (error) {
      console.error("❌ Error cleaning up expired tokens:", error)
    }
  }

  // Get all users (admin only)
  async getAllUsers(): Promise<User[]> {
    try {
      await this.ensureInitialized()
      return Array.from(this.users.values())
    } catch (error) {
      console.error("❌ Error getting all users:", error)
      return []
    }
  }

  // Health check method
  async healthCheck(): Promise<boolean> {
    try {
      await this.ensureInitialized()
      const hasUsers = this.users.size > 0
      const hasAdminUser = Array.from(this.users.values()).some((user) => user.role === "admin")

      const isHealthy = this.isInitialized && hasUsers && hasAdminUser

      if (isHealthy) {
        console.log("✅ Database health check passed")
      } else {
        console.warn("⚠️ Database health check failed", {
          initialized: this.isInitialized,
          userCount: this.users.size,
          hasAdmin: hasAdminUser,
        })
      }

      return isHealthy
    } catch (error) {
      console.error("❌ Database health check failed:", error)
      return false
    }
  }

  // Get database stats
  async getStats(): Promise<{ users: number; tokens: number; admins: number }> {
    try {
      await this.ensureInitialized()

      const users = this.users.size
      const tokens = this.verificationTokens.size
      const admins = Array.from(this.users.values()).filter((user) => user.role === "admin").length

      return { users, tokens, admins }
    } catch (error) {
      console.error("❌ Error getting database stats:", error)
      return { users: 0, tokens: 0, admins: 0 }
    }
  }
}

// Create singleton instance
export const db = new DatabaseService()

// Export health check function
export const checkDatabaseHealth = async (): Promise<boolean> => {
  try {
    return await db.healthCheck()
  } catch (error) {
    console.error("Health check wrapper error:", error)
    return false
  }
}
