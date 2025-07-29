import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/context/auth-context";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

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
    "Trinity Consultancy",
    "AI courses",
    "no-code platforms",
    "personal branding",
    "career growth",
    "online courses",
    "hands-on tutorials",
    "expert-led courses",
    "industry-relevant skills",
    "learn AI",
  ],
  metadataBase: new URL("https://courses.trinityconsultancy.tech"),
  authors: [
    { name: "Trinity Consultancy", url: "https://trinityconsultancy.tech" },
  ],
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
        url: "/favicon.png",
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
    images: ["/favicon.png"],
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
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Meta Tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="theme-color" content="#FF0000" />

        {/* Favicon and PWA */}
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9047638897398182"
          crossOrigin="anonymous"
        />

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-0W7HZG9MF0"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-0W7HZG9MF0');
          `}
        </Script>

        <Script
          id="ld-json-org"
          type="application/ld+json"
          strategy="afterInteractive"
        >
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Trinity Courses",
            url: "https://courses.trinityconsultancy.tech",
            logo: "https://courses.trinityconsultancy.tech/favicon.png",
            sameAs: [
              "https://trinityconsultancy.tech",
              "https://www.linkedin.com/company/trinityconsultancy",
            ],
          })}
        </Script>
          <meta name="google-site-verification" content="pPOQchfHX0n1_yrfu00cyB49cQShRSaPtd1e1rQ7z6Y" />
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
      <Script id="infolinks-config" strategy="beforeInteractive">
        {`
          var infolinks_pid = 3438583;
          var infolinks_wsid = 0;
        `}
      </Script>

      {/* Load Infolinks external script */}
      <Script
        src="http://resources.infolinks.com/js/infolinks_main.js"
        strategy="beforeInteractive"
      />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
