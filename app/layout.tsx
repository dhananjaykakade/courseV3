import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/context/auth-context"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Trinity Courses - Mobile Course Platform",
  description: "Learn on the go with our comprehensive mobile course platform",
    icons: {
    icon: "/favicon.png", // or /favicon.svg, /favicon.png
  },
}



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* ✅ Google AdSense Script */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9047638897398182"
          crossOrigin="anonymous"
          
          />
          </head>
      <body className={inter.className}>
        {process.env.NODE_ENV === "production" && (
          <Script
            id="disable-devtools"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `(() => {
                const forbidden = ["F12", "I", "J", "C", "U"];
                const block = (e) => { e.preventDefault(); e.stopPropagation(); };
                window.addEventListener("contextmenu", block);
                window.addEventListener("keydown", (e) => {
                  if (e.key === "F12" || (e.ctrlKey && e.shiftKey && forbidden.includes(e.key)) || (e.ctrlKey && e.key === "U")) {
                    block(e);
                  }
                });
              })();`,
            }}
          />
        )}
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
