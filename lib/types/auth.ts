export interface User {
  id: string
  email: string
  password: string
  name: string
  role: "admin" | "user"
  isEmailVerified: boolean
  createdAt: Date
  updatedAt: Date
  lastLogin?: Date
  profileImage?: string
  contactNumber?: string
}

export interface VerificationToken {
  id: string
  userId: string
  token: string
  type: "email_verification" | "password_reset"
  expiresAt: Date
  createdAt: Date
  isUsed: boolean
}

export interface AuthResponse {
  success: boolean
  message: string
  user?: Omit<User, "password">
  token?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
  contactNumber?: string
  role?: "user"
}

export interface ResetPasswordRequest {
  email: string
}

export interface ConfirmResetRequest {
  token: string
  newPassword: string
}

export interface VerifyEmailRequest {
  token: string
}
