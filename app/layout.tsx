import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/context/auth-context"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LearnHub - Mobile Course Platform",
  description: "Learn on the go with our comprehensive mobile course platform",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head />
      <body className={inter.className}>
        {/* ✅ Google AdSense Script */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9047638897398182"
          crossOrigin="anonymous"
          strategy="afterInteractive" // ensures it loads only on client
        />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
