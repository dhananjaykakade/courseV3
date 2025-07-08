export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          password: string
          name: string
          role: "admin" | "user"
          is_email_verified: boolean
          created_at: string
          updated_at: string
          last_login: string | null
          profile_image: string | null
          contact_number: string | null
        }
        Insert: {
          id?: string
          email: string
          password: string
          name: string
          role?: "admin" | "user"
          is_email_verified?: boolean
          created_at?: string
          updated_at?: string
          last_login?: string | null
          profile_image?: string | null
          contact_number?: string | null
        }
        Update: {
          id?: string
          email?: string
          password?: string
          name?: string
          role?: "admin" | "user"
          is_email_verified?: boolean
          created_at?: string
          updated_at?: string
          last_login?: string | null
          profile_image?: string | null
          contact_number?: string | null
        }
      }
      verification_tokens: {
        Row: {
          id: string
          user_id: string
          token: string
          type: "email_verification" | "password_reset"
          expires_at: string
          created_at: string
          is_used: boolean
        }
        Insert: {
          id?: string
          user_id: string
          token: string
          type: "email_verification" | "password_reset"
          expires_at: string
          created_at?: string
          is_used?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          token?: string
          type?: "email_verification" | "password_reset"
          expires_at?: string
          created_at?: string
          is_used?: boolean
        }
      }
      courses: {
        Row: {
          id: string
          title: string
          description: string
          is_free: boolean
          price: number
          rating: number
          students: number
          instructor: string
          duration: string
          image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          is_free?: boolean
          price?: number
          rating?: number
          students?: number
          instructor: string
          duration: string
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          is_free?: boolean
          price?: number
          rating?: number
          students?: number
          instructor?: string
          duration?: string
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      milestones: {
        Row: {
          id: string
          course_id: string
          title: string
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          course_id: string
          title: string
          order_index: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          title?: string
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      milestone_content: {
        Row: {
          id: string
          milestone_id: string
          type: "text" | "video" | "pdf"
          title: string | null
          content: string
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          milestone_id: string
          type: "text" | "video" | "pdf"
          title?: string | null
          content: string
          order_index: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          milestone_id?: string
          type?: "text" | "video" | "pdf"
          title?: string | null
          content?: string
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      user_progress: {
        Row: {
          id: string
          user_id: string
          course_id: string
          milestone_id: string
          is_completed: boolean
          progress_percentage: number
          last_accessed: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          milestone_id: string
          is_completed?: boolean
          progress_percentage?: number
          last_accessed?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string
          milestone_id?: string
          is_completed?: boolean
          progress_percentage?: number
          last_accessed?: string
          created_at?: string
          updated_at?: string
        }
      }
      enrollments: {
        Row: {
          id: string
          user_id: string
          course_id: string
          enrolled_at: string
          completed_at: string | null
          progress_percentage: number
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          enrolled_at?: string
          completed_at?: string | null
          progress_percentage?: number
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string
          enrolled_at?: string
          completed_at?: string | null
          progress_percentage?: number
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: "admin" | "user"
      token_type: "email_verification" | "password_reset"
      content_type: "text" | "video" | "pdf"
    }
  }
}
