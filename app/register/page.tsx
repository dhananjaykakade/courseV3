"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BookOpen, Eye, EyeOff, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactNumber: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Client-side validation
    if (!formData.name.trim()) {
      setError("Please enter your full name")
      setIsLoading(false)
      return
    }

    if (!formData.email.trim()) {
      setError("Please enter your email address")
      setIsLoading(false)
      return
    }

    if (!formData.password) {
      setError("Please enter a password")
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      setIsLoading(false)
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address")
      setIsLoading(false)
      return
    }

    try {
      console.log("Submitting registration:", {
        name: formData.name,
        email: formData.email,
        hasPassword: !!formData.password,
      })

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          contactNumber: formData.contactNumber.trim() || undefined,
          password: formData.password,
        }),
      })

      console.log("Response status:", response.status)
      console.log("Response headers:", Object.fromEntries(response.headers.entries()))

      // Check if response is JSON
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        console.error("Response is not JSON:", contentType)
        const textResponse = await response.text()
        console.error("Response text:", textResponse)
        throw new Error("Server returned invalid response format")
      }

      const data = await response.json()
      console.log("Response data:", data)

      if (data.success) {
        setSuccess(true)
        console.log("Registration successful")
      } else {
        setError(data.message || "Registration failed")
        console.error("Registration failed:", data.message)
      }
    } catch (error) {
      console.error("Registration error:", error)

      if (error instanceof TypeError && error.message.includes("fetch")) {
        setError("Network error. Please check your internet connection and try again.")
      } else if (error instanceof SyntaxError) {
        setError("Server response error. Please try again later.")
      } else if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("An unexpected error occurred. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    // Clear error when user starts typing
    if (error) {
      setError("")
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center text-2xl font-bold text-black">
              <BookOpen className="w-8 h-8 mr-2 text-red-500" />
              LearnHub
            </Link>
          </div>

          <Card className="border-2 border-green-200 bg-green-50">
            <CardContent className="text-center space-y-4 pt-6">
              <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
              <h2 className="text-2xl font-bold text-green-800">Registration Successful!</h2>
              <p className="text-green-700">
                We've sent a verification email to <strong>{formData.email}</strong>. Please check your inbox and click
                the verification link to activate your account.
              </p>
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <p className="text-sm text-gray-600">
                  <strong>Next steps:</strong>
                </p>
                <ol className="text-sm text-gray-600 list-decimal list-inside mt-2 space-y-1">
                  <li>Check your email inbox (and spam folder)</li>
                  <li>Click the verification link</li>
                  <li>Return here to log in</li>
                </ol>
              </div>
              <Link href="/login">
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3">Go to Login</Button>
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
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-2xl font-bold text-black">
            <BookOpen className="w-8 h-8 mr-2 text-red-500" />
            LearnHub
          </Link>
        </div>

        <Card className="border-2 border-gray-200">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-black">Create Account</CardTitle>
            <CardDescription className="text-gray-600">Join thousands of learners today</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-black font-medium">
                  Full Name *
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="border-2 border-gray-200 focus:border-red-500 focus:ring-red-500"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-black font-medium">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="border-2 border-gray-200 focus:border-red-500 focus:ring-red-500"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactNumber" className="text-black font-medium">
                  Contact Number <span className="text-gray-500">(Optional)</span>
                </Label>
                <Input
                  id="contactNumber"
                  name="contactNumber"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className="border-2 border-gray-200 focus:border-red-500 focus:ring-red-500"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-black font-medium">
                  Password *
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password (min. 6 characters)"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="border-2 border-gray-200 focus:border-red-500 focus:ring-red-500 pr-10"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500">Password must be at least 6 characters long</p>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded border border-red-200">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link href="/login" className="text-red-600 hover:text-red-700 font-medium">
                  Sign in here
                </Link>
              </p>
            </div>

            <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
              <p className="text-xs text-gray-600 text-center">
                <strong>Note:</strong> All new accounts are created as regular users. Contact an administrator if you
                need elevated permissions.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
