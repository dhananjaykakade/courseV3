"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BookOpen, CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<"form" | "success" | "error">("form")
  const [message, setMessage] = useState("")

  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  useEffect(() => {
    if (!token) {
      setStatus("error")
      setMessage("Invalid reset link")
    }
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!token) {
      setMessage("Invalid reset token")
      return
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters long")
      return
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match")
      return
    }

    setIsLoading(true)
    setMessage("")

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, newPassword: password }),
      })

      const data = await response.json()

      if (data.success) {
        setStatus("success")
        setMessage(data.message)
      } else {
        setMessage(data.message)
      }
    } catch (error) {
      setMessage("An error occurred while resetting your password")
    } finally {
      setIsLoading(false)
    }
  }

  if (status === "error") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center text-2xl font-bold text-black">
              <BookOpen className="w-8 h-8 mr-2 text-red-500" />
              Trinity Courses
            </Link>
          </div>

          <Card className="border-2 border-gray-200">
            <CardContent className="text-center space-y-4 pt-6">
              <AlertCircle className="w-12 h-12 mx-auto text-red-500" />
              <p className="text-red-600 font-medium">{message}</p>
              <Link href="/login">
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3">Back to Login</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (status === "success") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center text-2xl font-bold text-black">
              <BookOpen className="w-8 h-8 mr-2 text-red-500" />
              Trinity Courses
            </Link>
          </div>

          <Card className="border-2 border-gray-200">
            <CardContent className="text-center space-y-4 pt-6">
              <CheckCircle className="w-12 h-12 mx-auto text-green-500" />
              <p className="text-green-600 font-medium">{message}</p>
              <Link href="/login">
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3">
                  Continue to Login
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-2xl font-bold text-black">
            <BookOpen className="w-8 h-8 mr-2 text-red-500" />
            Trinity Courses
          </Link>
        </div>

        <Card className="border-2 border-gray-200">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-black">Reset Password</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-black font-medium">
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border-2 border-gray-200 focus:border-red-500 focus:ring-red-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-black font-medium">
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="border-2 border-gray-200 focus:border-red-500 focus:ring-red-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {message && <div className="text-red-600 text-sm text-center">{message}</div>}

              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3"
                disabled={isLoading}
              >
                {isLoading ? "Resetting Password..." : "Reset Password"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/login" className="text-red-600 hover:text-red-700 font-medium">
                Back to Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
