"use client"

import { Navbar } from "@/components/navbar"
import Image from "next/image"
import { Footer } from "@/components/footer"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 sm:px-10 py-16 bg-gradient-to-br from-red-50 via-white to-red-100">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 max-w-3xl leading-tight">
          About <span className="text-red-600">Trinity Courses</span>
        </h1>
        <p className="mt-6 max-w-2xl text-gray-600 text-base sm:text-lg">
          Trinity Courses is on a mission to democratise high-quality education by bringing practical, expert-led
          learning to everyone, everywhere. Whether you are just starting your journey or looking to sharpen existing
          skills, we are here to support you every step of the way.
        </p>
      </section>

      {/* Values Section */}
      <section className="py-14 px-6 sm:px-10 bg-white">
        <div className="max-w-5xl mx-auto grid gap-10 md:grid-cols-3">
          {[
            {
              title: "Accessible",
              desc: "Learn on any device, anytime."
            },
            {
              title: "Practical",
              desc: "Hands-on projects that mimic real-world scenarios."
            },
            {
              title: "Community",
              desc: "Engage with peers and mentors for continuous growth."
            }
          ].map((item) => (
            <div
              key={item.title}
              className="text-center bg-gray-50 hover:bg-red-50 transition rounded-xl p-6 shadow-sm"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>


      {/* Footer */}
<Footer/>
    </div>
  )
}
