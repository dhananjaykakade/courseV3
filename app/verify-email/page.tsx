"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { BookOpen, CheckCircle, AlertCircle, Loader2, Mail, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/context/auth-context"

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")
  const [isRetrying, setIsRetrying] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token")
  const { user, loading } = useAuth()

  // Redirect logged-in users
  useEffect(() => {
    if (!loading && user) {
      router.push("/")
    }
  }, [user, loading, router])

  const verifyEmail = useCallback(async (verificationToken: string) => {
    try {
      setIsRetrying(true)
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: verificationToken.trim() }),
      })

      const data = await response.json()

      if (data.success) {
        setStatus("success")
        setMessage(data.message || "Your email has been successfully verified!")
      } else {
        setStatus("error")
        setMessage(data.message || "Email verification failed. Please try again.")
      }
    } catch (error) {
      console.error("Email verification error:", error)
      setStatus("error")
      setMessage("An error occurred while verifying your email. Please check your connection and try again.")
    } finally {
      setIsRetrying(false)
    }
  }, [])

  useEffect(() => {
    if (!token) {
      setStatus("error")
      setMessage("Invalid or missing verification token. Please check your email link.")
    } else {
      verifyEmail(token)
    }
  }, [token, verifyEmail])

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    )
  }

  // Don't render if user is logged in (will be redirected)
  if (user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-3xl font-bold text-gray-900 hover:text-red-600 transition-colors">
        <img src="/favicon.png" alt="Trinity Courses Logo" className="w-8 h-8 mr-2" />         
            Trinity Courses
          </Link>
        </div>

        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto mb-4 p-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full w-fit">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Email Verification</CardTitle>
            <p className="text-gray-600 mt-2">We're verifying your email address to secure your account</p>
          </CardHeader>
          
          <CardContent className="text-center space-y-6 px-8 pb-8">
            {status === "loading" && (
              <div className="py-8">
                <div className="relative">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </div>
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-red-500/20 rounded-full animate-ping"></div>
                </div>
                <p className="text-gray-700 font-medium">Verifying your email address...</p>
                <p className="text-sm text-gray-500 mt-2">This should only take a few seconds</p>
              </div>
            )}

            {status === "success" && (
              <div className="py-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Verification Successful!</h3>
                <p className="text-green-600 font-medium mb-6">{message}</p>
                
                <div className="space-y-3 gap-2">
                  <Link href="/login">
                    <Button className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 group">
                      Continue to Login
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button variant="outline" className="w-full border-2 border-gray-200 hover:border-red-500 hover:text-red-600 transition-colors">
                      Go to Home
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {status === "error" && (
              <div className="py-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
                  <AlertCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Verification Failed</h3>
                <p className="text-red-600 font-medium mb-6">{message}</p>
                
                <div className="space-y-3">
                  <Button
                    onClick={() => token && verifyEmail(token)}
                    className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                    disabled={isRetrying}
                  >
                    {isRetrying ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Retrying...
                      </>
                    ) : (
                      "Retry Verification"
                    )}
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Link href="/register">
                      <Button
                        variant="outline"
                        className="w-full border-2 border-gray-200 hover:border-red-500 hover:text-red-600 transition-colors"
                      >
                        Register Again
                      </Button>
                    </Link>
                    <Link href="/login">
                      <Button
                        variant="outline"
                        className="w-full border-2 border-gray-200 hover:border-green-500 hover:text-green-600 transition-colors"
                      >
                        Try Login
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Help Section */}
            <div className="pt-6 border-t border-gray-100">
              <p className="text-sm text-gray-500 mb-2">Having trouble?</p>
              <div className="flex flex-col sm:flex-row gap-2 text-sm">
                <Link href="/contact" className="text-red-600 hover:text-red-700 font-medium">
                  Contact Support
                </Link>
                <span className="hidden sm:block text-gray-400">•</span>
                <Link href="/resend-verification" className="text-red-600 hover:text-red-700 font-medium">
                  Resend Email
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            This link will expire in 24 hours for security reasons.
          </p>
        </div>
      </div>
    </div>
  )
}