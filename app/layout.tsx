import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/context/auth-context"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Trinity Courses - Learn No-Code & AI Skills with Experts",
  description:
    "Join Trinity Courses to master no-code tools like V0, n8n, and automation workflows. Learn AI influencer techniques to grow your brand and career. 100% online, expert-led.",
  keywords: [
    "Trinity Courses",
    "no-code learning",
    "V0 tutorials",
    "n8n automation",
    "AI influencer",
    "automation courses",
    "LMS",
    "learn automation",
    "online education",
    "Trinity Consultancy"
  ],
  metadataBase: new URL("https://courses.trinityconsultancy.tech"),
  authors: [{ name: "Trinity Consultancy", url: "https://trinityconsultancy.tech" }],
  creator: "Trinity Consultancy",
  publisher: "Trinity Courses",
  alternates: {
    canonical: "https://courses.trinityconsultancy.tech",
  },
  openGraph: {
    title: "Trinity Courses - Your Hub for No-Code and AI Learning",
    description:
      "Explore hands-on tutorials in n8n, V0, AI automation, and personal branding. Advance your career through expert-designed, industry-relevant courses.",
    url: "https://courses.trinityconsultancy.tech",
    siteName: "Trinity Courses",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Trinity Courses - No-Code & AI Learning",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Trinity Courses",
    description:
      "Master no-code platforms, automations, and AI growth strategies with expert-curated courses.",
    images: ["/opengraph-image.png"],
    site: "@trinitycourses", // Optional: if you have Twitter/X handle
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};



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
