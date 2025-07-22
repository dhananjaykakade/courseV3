"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertCircle } from "lucide-react"

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" })
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      if (res.ok) {
        setForm({ name: "", email: "", message: "" })
        setStatus("success")
      } else {
        throw new Error("Failed to send message.")
      }
    } catch (err) {
      setStatus("error")
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-bold text-red-600 mb-2">Get in Touch</h1>
            <p className="text-gray-600 max-w-xl mx-auto">
              Have questions, feedback, or partnership opportunities? Fill out the form or reach us using the contact details below.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Contact Info Section */}
            <div className="space-y-6 text-sm sm:text-base">
              <div>
                <h2 className="font-semibold text-gray-900">📧 Email</h2>
                <a href="mailto:trinityconsultancyofficial@gmail.com" className="text-red-600 underline">
                  trinityconsultancyofficial@gmail.com
                </a>
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">📍 Address</h2>
                <p className="text-gray-700">Nashik, Maharashtra, India</p>
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">📱 WhatsApp</h2>
                <p className="text-gray-700">+91 8530777263</p>
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">🌐 Social</h2>
                <ul className="space-y-1">
                  <li>
                    <a href="https://www.instagram.com/trinityconsultancy" target="_blank" className="text-red-600 underline">
                      Instagram
                    </a>
                  </li>
                  <li>
                    <a href="https://www.linkedin.com/company/trinityconsultancy" target="_blank" className="text-red-600 underline">
                      LinkedIn
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Contact Form Section */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  name="name"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
                <Input
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
                <Textarea
                  name="message"
                  placeholder="Your Message"
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  required
                />
                <Button type="submit" className="w-full" disabled={status === "loading"}>
                  {status === "loading" ? "Sending..." : "Send Message"}
                </Button>

                {/* Status Message */}
                {status === "success" && (
                  <p className="flex items-center justify-center gap-2 text-green-600 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    Message sent successfully!
                  </p>
                )}
                {status === "error" && (
                  <p className="flex items-center justify-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    Something went wrong. Please try again.
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
