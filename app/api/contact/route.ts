import { type NextRequest, NextResponse } from "next/server"
import { emailService } from "@/lib/services/email"

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json()

    if (!name || !email || !message) {
      return NextResponse.json({ success: false, message: "All fields are required" }, { status: 400 })
    }

    const html = `
      <h1>📩 New Contact Message</h1>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `

    const sent = await emailService.sendEmail({
      to: process.env.CONTACT_RECEIVER || "info@example.com",
      subject: "Trinity Courses – Contact Form Submission",
      html,
    })

    if (!sent) throw new Error("Email failed")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json({ success: false, message: "Internal error" }, { status: 500 })
  }
}
