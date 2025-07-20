"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, CheckCircle } from "lucide-react"
import { Footer } from "@/components/footer"

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
        throw new Error("Failed")
      }
    } catch (err) {
      setStatus("error")
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <section className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow md:p-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">Contact Us</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Your Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <Input
              type="email"
              placeholder="Email Address"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <Textarea
              rows={4}
              placeholder="How can we help you?"
              name="message"
              value={form.message}
              onChange={handleChange}
              required
            />
            <Button className="w-full" disabled={status === "loading"}>
              {status === "loading" ? "Sending..." : "Send Message"}
            </Button>

            {status === "success" && (
              <p className="flex items-center gap-1 text-green-600 text-sm justify-center">
                <CheckCircle className="w-4 h-4" /> Message sent successfully
              </p>
            )}
            {status === "error" && (
              <p className="flex items-center gap-1 text-red-600 text-sm justify-center">
                <AlertCircle className="w-4 h-4" /> Something went wrong. Please try again.
              </p>
            )}
          </form>
        </div>
      </section>

<Footer/>
    </div>
  )
}
