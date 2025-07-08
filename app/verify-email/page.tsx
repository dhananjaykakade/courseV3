"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  useEffect(() => {
    if (!token) {
      setStatus("error")
      setMessage("Invalid verification link")
      return
    }

    verifyEmail(token)
  }, [token])

  const verifyEmail = async (verificationToken: string) => {
    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: verificationToken }),
      })

      const data = await response.json()

      if (data.success) {
        setStatus("success")
        setMessage(data.message)
      } else {
        setStatus("error")
        setMessage(data.message)
      }
    } catch (error) {
      setStatus("error")
      setMessage("An error occurred while verifying your email")
    }
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
            <CardTitle className="text-2xl font-bold text-black">Email Verification</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            {status === "loading" && (
              <>
                <Loader2 className="w-12 h-12 mx-auto text-red-500 animate-spin" />
                <p className="text-gray-600">Verifying your email address...</p>
              </>
            )}

            {status === "success" && (
              <>
                <CheckCircle className="w-12 h-12 mx-auto text-green-500" />
                <p className="text-green-600 font-medium">{message}</p>
                <Link href="/login">
                  <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3">
                    Continue to Login
                  </Button>
                </Link>
              </>
            )}

            {status === "error" && (
              <>
                <AlertCircle className="w-12 h-12 mx-auto text-red-500" />
                <p className="text-red-600 font-medium">{message}</p>
                <div className="space-y-2">
                  <Link href="/register">
                    <Button
                      variant="outline"
                      className="w-full border-2 border-gray-200 hover:border-red-500 bg-transparent"
                    >
                      Register Again
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3">Try Login</Button>
                  </Link>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
