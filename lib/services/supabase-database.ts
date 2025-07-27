import { createServerClient, createAdminClient } from "@/lib/supabase/client"
import type { User, VerificationToken } from "@/lib/types/auth"
import { Currency } from "lucide-react"



class SupabaseDatabaseService {

  private supabase = createServerClient()
  private adminClient = createAdminClient()

  // User operations
  async createUser(userData: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
    try {
      const { data, error } = await this.adminClient
        .from("users")
        .insert({
          email: userData.email,
          password: userData.password,
          name: userData.name,
          role: userData.role || "user",
          is_email_verified: userData.isEmailVerified || false,
          contact_number: userData.contactNumber,
        })
        .select()
        .single()

      if (error) {
        console.error("Supabase create user error:", error)
        throw new Error(`Failed to create user: ${error.message}`)
      }

      return this.mapUserFromDb(data)
    } catch (error) {
      console.error("Error creating user:", error)
      throw error
    }
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      const { data, error } = await this.adminClient.from("users").select("*").eq("id", id).single()

      if (error) {
        if (error.code === "PGRST116") {
          return null // User not found
        }
        console.error("Supabase get user by ID error:", error)
        return null
      }

      return this.mapUserFromDb(data)
    } catch (error) {
      console.error("Error getting user by ID:", error)
      return null
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const { data, error } = await this.adminClient.from("users").select("*").eq("email", email.toLowerCase()).single()

      if (error) {
        if (error.code === "PGRST116") {
          return null // User not found
        }
        console.error("Supabase get user by email error:", error)
        return null
      }

      return this.mapUserFromDb(data)
    } catch (error) {
      console.error("Error getting user by email:", error)
      return null
    }
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    try {
      const updateData: any = {}

      if (updates.email) updateData.email = updates.email
      if (updates.password) updateData.password = updates.password
      if (updates.name) updateData.name = updates.name
      if (updates.role) updateData.role = updates.role
      if (updates.isEmailVerified !== undefined) updateData.is_email_verified = updates.isEmailVerified
      if (updates.lastLogin) updateData.last_login = updates.lastLogin.toISOString()
      if (updates.profileImage) updateData.profile_image = updates.profileImage
      if (updates.contactNumber) updateData.contact_number = updates.contactNumber

      const { data, error } = await this.adminClient.from("users").update(updateData).eq("id", id).select().single()

      if (error) {
        console.error("Supabase update user error:", error)
        return null
      }

      return this.mapUserFromDb(data)
    } catch (error) {
      console.error("Error updating user:", error)
      return null
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      const { error } = await this.adminClient.from("users").delete().eq("id", id)

      if (error) {
        console.error("Supabase delete user error:", error)
        return false
      }

      return true
    } catch (error) {
      console.error("Error deleting user:", error)
      return false
    }
  }

  // Verification token operations
  async createVerificationToken(tokenData: Omit<VerificationToken, "id" | "createdAt">): Promise<VerificationToken> {
    try {
      const { data, error } = await this.adminClient
        .from("verification_tokens")
        .insert({
          user_id: tokenData.userId,
          token: tokenData.token,
          type: tokenData.type,
          expires_at: tokenData.expiresAt.toISOString(),
          is_used: tokenData.isUsed || false,
        })
        .select()
        .single()

      if (error) {
        console.error("Supabase create verification token error:", error)
        throw new Error(`Failed to create verification token: ${error.message}`)
      }

      return this.mapTokenFromDb(data)
    } catch (error) {
      console.error("Error creating verification token:", error)
      throw error
    }
  }

  async getVerificationToken(token: string): Promise<VerificationToken | null> {
    try {
      const { data, error } = await this.adminClient
        .from("verification_tokens")
        .select("*")
        .eq("token", token.trim())
        .eq("is_used", false)
        .single()

      if (error) {
        if (error.code === "PGRST116") {
          return null // Token not found
        }
        console.error("Supabase get verification token error:", error)
        return null
      }

      return this.mapTokenFromDb(data)
    } catch (error) {
      console.error("Error getting verification token:", error)
      return null
    }
  }

  async markTokenAsUsed(tokenId: string): Promise<boolean> {
    try {
      const { error } = await this.adminClient.from("verification_tokens").update({ is_used: true }).eq("id", tokenId)

      if (error) {
        console.error("Supabase mark token as used error:", error)
        return false
      }

      return true
    } catch (error) {
      console.error("Error marking token as used:", error)
      return false
    }
  }

  async cleanupExpiredTokens(): Promise<void> {
    try {
      const { error } = await this.adminClient
        .from("verification_tokens")
        .delete()
        .lt("expires_at", new Date().toISOString())

      if (error) {
        console.error("Supabase cleanup expired tokens error:", error)
      }
    } catch (error) {
      console.error("Error cleaning up expired tokens:", error)
    }
  }


  // Course operations
  async getAllCourses(): Promise<any[]> {
    try {
      const { data, error } = await this.adminClient
        .from("courses")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Supabase get all courses error:", error)
        return []
      }

      return data.map(this.mapCourseFromDb)
    } catch (error) {
      console.error("Error getting all courses:", error)
      return []
    }
  }

  async getCourseById(id: string): Promise<any | null> {
    try {
      const { data, error } = await this.adminClient
        .from("courses")
        .select(`
          *,
          milestones (
            *,
            milestone_content (*)
          )
        `)
        .eq("id", id)
        .single()

      if (error) {
        if (error.code === "PGRST116") {
          return null
        }
        console.error("Supabase get course by ID error:", error)
        return null
      }

      return this.mapCourseWithMilestonesFromDb(data)
    } catch (error) {
      console.error("Error getting course by ID:", error)
      return null
    }
  }

  async getCourseWithProgress(courseId: string, userId: string): Promise<any | null> {
    try {
      // Get course with milestones
      const course = await this.getCourseById(courseId)
      if (!course) return null

      // Get user's enrollment
      const { data: enrollment } = await this.adminClient
        .from("user_enrollments")
        .select("*")
        .eq("user_id", userId)
        .eq("course_id", courseId)
        .single()

      // Get user's milestone progress
      const { data: milestoneProgress } = await this.adminClient
        .from("user_milestone_progress")
        .select("milestone_id")
        .eq("user_id", userId)
        .eq("course_id", courseId)

      const completedMilestoneIds = new Set(milestoneProgress?.map((p) => p.milestone_id) || [])

      // Mark milestones as completed based on user progress
      course.milestones = course.milestones.map((milestone: any) => ({
        ...milestone,
        isCompleted: completedMilestoneIds.has(milestone.id),
      }))

      // Add enrollment info
      course.isPurchased = !!enrollment
      course.enrolledAt = enrollment?.enrolled_at
      course.progress = enrollment?.progress || 0

      return course
    } catch (error) {
      console.error("Error getting course with progress:", error)
      return null
    }
  }

  async createCourse(courseData: any): Promise<any | null> {
    try {

      const { data, error } = await this.adminClient
        .from("courses")
        .insert({
          title: courseData.title,
          description: courseData.description,
          is_free: !courseData.isPaid,
          price: courseData.price || 0,
          duration: courseData.duration || "TBD",
          image_url: courseData.imageUrl,
        })
        .select()
        .single()

      if (error) {
        return null
      }

      const course = this.mapCourseFromDb(data)

      // Create milestones if provided
      if (courseData.milestones && courseData.milestones.length > 0) {
        await this.createMilestones(course.id, courseData.milestones)
      }

      return course
    } catch (error) {
      console.error("Error creating course:", error)
      return null
    }
  }

  async createMilestones(courseId: string, milestones: any[]): Promise<void> {
    try {

      for (let i = 0; i < milestones.length; i++) {
        const milestone = milestones[i]

        // Create milestone
        const { data: milestoneData, error: milestoneError } = await this.adminClient
          .from("milestones")
          .insert({
            course_id: courseId,
            title: milestone.title,
            order_index: i,
          })
          .select()
          .single()

        if (milestoneError) {
          console.error("Error creating milestone:", milestoneError)
          continue
        }


        // Create milestone content
        const contentItems = []
        let contentIndex = 0

        // Add text blocks
        if (milestone.textBlocks) {
          milestone.textBlocks.forEach((text: string) => {
            if (text.trim()) {
              contentItems.push({
                milestone_id: milestoneData.id,
                type: "text",
                title: `Text Block ${contentIndex + 1}`,
                content: text,
                order_index: contentIndex++,
              })
            }
          })
        }

        // Add PDF URLs
        if (milestone.pdfUrls) {
          milestone.pdfUrls.forEach((url: string, index: number) => {
            if (url.trim()) {
              contentItems.push({
                milestone_id: milestoneData.id,
                type: "pdf",
                title: `PDF Document ${index + 1}`,
                content: url,
                order_index: contentIndex++,
              })
            }
          })
        }

        // Add video URL
        if (milestone.videoUrl && milestone.videoUrl.trim()) {
          contentItems.push({
            milestone_id: milestoneData.id,
            type: "video",
            title: `Video Lesson`,
            content: milestone.videoUrl,
            order_index: contentIndex++,
          })
        }

        // Insert all content items
        if (contentItems.length > 0) {
          const { error: contentError } = await this.adminClient.from("milestone_content").insert(contentItems)

          if (contentError) {
            console.error("Error creating milestone content:", contentError)
          } else {
          }
        }
      }
    } catch (error) {
      console.error("Error creating milestones:", error)
    }
  }

  async updateCourse(id: string, courseData: any): Promise<any | null> {
    try {

      const updateData: any = {}

      if (courseData.title) updateData.title = courseData.title
      if (courseData.description) updateData.description = courseData.description
      if (courseData.isPaid !== undefined) updateData.is_free = !courseData.isPaid
      if (courseData.price !== undefined) updateData.price = courseData.price
      if (courseData.duration) updateData.duration = courseData.duration
      if (courseData.imageUrl) updateData.image_url = courseData.imageUrl

      const { data, error } = await this.adminClient.from("courses").update(updateData).eq("id", id).select().single()

      if (error) {
        return null
      }


      // Handle milestones update
      if (courseData.milestones && courseData.milestones.length > 0) {

        // Delete existing milestones and their content
        await this.deleteMilestones(id)

        // Create new milestones
        await this.createMilestones(id, courseData.milestones)
      }

      return this.mapCourseFromDb(data)
    } catch (error) {
      console.error("Error updating course:", error)
      return null
    }
  }

  async deleteMilestones(courseId: string): Promise<void> {
    try {

      // First delete milestone content
      const { data: milestones } = await this.adminClient.from("milestones").select("id").eq("course_id", courseId)

      if (milestones && milestones.length > 0) {
        const milestoneIds = milestones.map((m) => m.id)

        // Delete milestone content
        const { error: contentError } = await this.adminClient
          .from("milestone_content")
          .delete()
          .in("milestone_id", milestoneIds)

        if (contentError) {
          console.error("Error deleting milestone content:", contentError)
        }

        // Delete milestones
        const { error: milestoneError } = await this.adminClient.from("milestones").delete().eq("course_id", courseId)

        if (milestoneError) {
          console.error("Error deleting milestones:", milestoneError)
        } else {
        }
      }
    } catch (error) {
      console.error("Error deleting milestones:", error)
    }
  }

  async deleteCourse(id: string): Promise<boolean> {
    try {
      // First delete milestones and their content
      await this.deleteMilestones(id)

      const { error } = await this.adminClient.from("courses").delete().eq("id", id)

      if (error) {
        console.error("Supabase delete course error:", error)
        return false
      }

      return true
    } catch (error) {
      console.error("Error deleting course:", error)
      return false
    }
  }

  // Enrollment operations
  async enrollUser(userId: string, courseId: string): Promise<boolean> {
    // Old simple enrollment without payment tracking
    try {

      const { data, error } = await this.adminClient
        .from("user_enrollments")
        .insert({
          user_id: userId,
          course_id: courseId,
        })
        .select()
        .single();

      if (error) {
        console.error("Error enrolling user:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error enrolling user:", error);
      return false;
    }
  }

  /**
   * Enroll a paid user in a course while recording payment information.
   * Falls back gracefully if the `payment_*` columns are not present.
   * @param userId
   * @param courseId
   * @param paymentInfo  Object containing payment_id, order_id, payment_verified, [optional] amount & currency
   */
  async enrollUserInCourse(
    userId: string,
    courseId: string,
    paymentInfo: {
      payment_id: string;
      order_id: string;
      payment_verified: boolean;
      amount: number;
      currency: string;
    }
  ): Promise<{ success: boolean; message?: string }> {
    try {

      const insertData: Record<string, any> = {
        user_id: userId,
        course_id: courseId,
        enrolled_at: new Date().toISOString(),
        progress: 0,
        currency:'INR'
      };

      // Include payment columns if they exist in schema; Supabase will ignore unknown ones
      insertData.payment_id = paymentInfo.payment_id;
      insertData.order_id = paymentInfo.order_id;
      insertData.payment_verified = paymentInfo.payment_verified;
       insertData.amount = paymentInfo.amount;

      const { data, error } = await this.adminClient
        .from("user_enrollments")
        .insert(insertData)
        .select()
        .single();

      if (error) {
        // Ignore duplicate enrolment error (unique constraint) if any
        if (error.code === "23505") {
          return { success: false, message: "Already enrolled" };
        }
        console.error("Error enrolling paid user:", error);
        return { success: false, message: error.message };
      }

      return { success: true };
    } catch (error: any) {
      console.error("Unexpected error enrolling paid user:", error);
      return { success: false, message: error.message || "Unknown error" };
    }
  }


  async isUserEnrolled(userId: string, courseId: string): Promise<boolean> {
    try {
      const { data, error } = await this.adminClient
        .from("user_enrollments")
        .select("id")
        .eq("user_id", userId)
        .eq("course_id", courseId)
        .single()

      return !error && !!data
    } catch (error) {
      console.error("Error checking enrollment:", error)
      return false
    }
  }

  async getUserEnrollments(userId: string): Promise<any[]> {
    try {
      const { data, error } = await this.adminClient
        .from("user_enrollments")
        .select(`
          *,
          courses (
            *,
            milestones (id)
          )
        `)
        .eq("user_id", userId)
        .order("enrolled_at", { ascending: false })

      if (error) {
        console.error("Error getting user enrollments:", error)
        return []
      }

      return data.map((enrollment) => {
        const course = this.mapCourseFromDb(enrollment.courses)
        return {
          ...course,
          enrolledAt: enrollment.enrolled_at,
          progress: enrollment.progress,
          completedAt: enrollment.completed_at,
          totalMilestones: enrollment.courses.milestones?.length || 0,
        }
      })
    } catch (error) {
      console.error("Error getting user enrollments:", error)
      return []
    }
  }

  async markMilestoneComplete(userId: string, courseId: string, milestoneId: string): Promise<boolean> {
    try {
      // Upsert milestone progress (avoids duplicate key error and reduces latency)
      const { error: progressError } = await this.adminClient
        .from("user_milestone_progress")
        .upsert(
          {
            user_id: userId,
            course_id: courseId,
            milestone_id: milestoneId,
          },
          {
            onConflict: "user_id,course_id,milestone_id",
            ignoreDuplicates: true,
          }
        )

      if (progressError) {
        console.error("Error marking milestone complete:", progressError)
        return false
      }

      // Re-calculate overall course progress
      await this.updateCourseProgress(userId, courseId)

      return true
    } catch (error) {
      console.error("Error marking milestone complete:", error)
      return false
    }
  }

  async updateCourseProgress(userId: string, courseId: string): Promise<void> {
    try {
      // Fetch milestone counts in parallel to minimise latency
      const [totalResult, completedResult] = await Promise.all([
        this.adminClient
          .from("milestones")
          .select("*", { count: "exact", head: true })
          .eq("course_id", courseId),
        this.adminClient
          .from("user_milestone_progress")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId)
          .eq("course_id", courseId),
      ])

      const totalMilestones = totalResult.count ?? 0
      const completedCount = completedResult.count ?? 0
      const progress = totalMilestones > 0 ? (completedCount / totalMilestones) * 100 : 0

      // Update enrollment progress
      const updateData: any = { progress }
      if (progress === 100) {
        updateData.completed_at = new Date().toISOString()
      }

      await this.adminClient
        .from("user_enrollments")
        .update(updateData)
        .eq("user_id", userId)
        .eq("course_id", courseId)
    } catch (error) {
      console.error("Error updating course progress:", error)
    }
  }
  async getAllUsers(): Promise<User[]> {
    try {
      const { data, error } = await this.adminClient.from("users").select("*").order("created_at", { ascending: false })

      if (error) {
        console.error("Supabase get all users error:", error)
        return []
      }

      return data.map(this.mapUserFromDb)
    } catch (error) {
      console.error("Error getting all users:", error)
      return []
    }
  }

  // Health check method
  async healthCheck(): Promise<boolean> {
    try {
      const { data, error } = await this.adminClient.from("users").select("count").limit(1)

      return !error
    } catch (error) {
      console.error("Database health check failed:", error)
      return false
    }
  }
  

  // create a function to update the users role
  async updateUserRole(userId: string, newRole: string): Promise<User | null> {
    try {
      const { data, error } = await this.adminClient
        .from("users")
        .update({ role: newRole })
        .eq("id", userId)
        .select()

        if (error) {
        console.error("Supabase update user role error:", error)
        return null
      }
      return this.mapUserFromDb(data)
    } catch (error) {
      console.error("Error updating user role:", error)
      return null
    }
  }


  // create a function to get all the paid courses
  async getAllPaidCourses(): Promise<{id: string ,title:string,price:number,created_at: Date}[]> {
    try {
      const { data, error } = await this.adminClient
        .from("courses")
        .select("*")
        .gt("price", 0)

      if (error) {
        console.error("Supabase get all paid courses error:", error)
        return []
      }

      return data.map(this.mapCourseFromDb)
    } catch (error) {
      console.error("Error getting all paid courses:", error)
      return []
    }
  }

  // create a function to give access to paid courses for specific user

  async giveAccessToPaidCourse(userEmail: string, courseId: string, amount: number): Promise<boolean> {
    try {
      // Get user ID by email
      const { data: user, error: userError } = await this.adminClient
        .from("users")
        .select("id")
        .eq("email", userEmail.toLowerCase())
        .single()
      if (userError || !user) {
        console.error("Supabase get user by email error:", userError)
        return false
      }
      const userId = user.id

      // check if already enrolled to course 
      const { data: existingEnrollment, error: enrollmentError } = await this.adminClient
        .from("user_enrollments")
        .select("id")
        .eq("user_id", userId)
        .eq("course_id", courseId)
        .single()

      if (enrollmentError || existingEnrollment) {
        console.error(`error checking enrollment: ${enrollmentError || existingEnrollment}`)
        return false
      }

      const { data, error } = await this.adminClient
        .from("user_enrollments")
        .insert({
          user_id: userId,
          course_id: courseId,
          enrolled_at: new Date().toISOString(),
          progress: 0,
          payment_verified: true, // Assuming access is granted without payment verification
          amount: amount || 0, // Optional amount, can be 0 if not applicable
          currency: "rupees", // Default currency, can be changed as needed
          payment_id:'autoaccessbyadmin',
          order_id: 'autoaccessbyadmin',

        })
        .select()
        .single()

      if (error) {
        console.error("Supabase give access to paid course error:", error)
        return false
      }

      return true
    } catch (error) {
      console.error("Error giving access to paid course:", error)
      return false
    }
  }

  // Get database stats
  async getStats(): Promise<{ users: number; courses: number; tokens: number }> {
    try {
      const [usersResult, coursesResult, tokensResult] = await Promise.all([
        this.adminClient.from("users").select("count"),
        this.adminClient.from("courses").select("count"),
        this.adminClient.from("verification_tokens").select("count"),
      ])

      return {
        users: usersResult.data?.[0]?.count || 0,
        courses: coursesResult.data?.[0]?.count || 0,
        tokens: tokensResult.data?.[0]?.count || 0,
      }
    } catch (error) {
      console.error("Error getting database stats:", error)
      return { users: 0, courses: 0, tokens: 0 }
    }
  }

  // Helper methods to map database objects to application objects
  private mapUserFromDb(dbUser: any): User {
    return {
      id: dbUser.id,
      email: dbUser.email,
      password: dbUser.password,
      name: dbUser.name,
      role: dbUser.role,
      isEmailVerified: dbUser.is_email_verified,
      createdAt: new Date(dbUser.created_at),
      updatedAt: new Date(dbUser.updated_at),
      lastLogin: dbUser.last_login ? new Date(dbUser.last_login) : undefined,
      profileImage: dbUser.profile_image,
      contactNumber: dbUser.contact_number,
    }
  }

  private mapTokenFromDb(dbToken: any): VerificationToken {
    return {
      id: dbToken.id,
      userId: dbToken.user_id,
      token: dbToken.token,
      type: dbToken.type,
      expiresAt: new Date(dbToken.expires_at),
      createdAt: new Date(dbToken.created_at),
      isUsed: dbToken.is_used,
    }
  }

  private mapCourseFromDb(dbCourse: any): any {
    return {
      id: dbCourse.id,
      title: dbCourse.title,
      description: dbCourse.description,
      isFree: dbCourse.is_free,
      price: dbCourse.price,
      duration: dbCourse.duration,
      image: dbCourse.image_url,
    }
  }

  private mapCourseWithMilestonesFromDb(dbCourse: any): any {
    const course = this.mapCourseFromDb(dbCourse)

    course.milestones =
      dbCourse.milestones
        ?.sort((a: any, b: any) => a.order_index - b.order_index)
        .map((milestone: any) => ({
          id: milestone.id,
          title: milestone.title,
          isCompleted: false, // This will be set by getCourseWithProgress
          content:
            milestone.milestone_content
              ?.sort((a: any, b: any) => a.order_index - b.order_index)
              .map((content: any) => ({
                type: content.type,
                data:
                  content.type === "text"
                    ? content.content
                    : {
                        title: content.title,
                        url: content.content,
                      },
              })) || [],
        })) || []

    return course
  }
}

// Create singleton instance
export const supabaseDb = new SupabaseDatabaseService()

// Export health check function
export const checkSupabaseDatabaseHealth = async (): Promise<boolean> => {
  try {
    return await supabaseDb.healthCheck()
  } catch (error) {
    console.error("Supabase health check wrapper error:", error)
    return false
  }
}
