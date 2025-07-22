"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function ShippingPolicy() {
  return (
    <>
      <Navbar />
      <main className="bg-white text-black px-4 py-8 max-w-3xl mx-auto text-sm sm:text-base leading-7">
        <h1 className="text-3xl font-bold mb-6 text-red-600">Shipping & Delivery Policy</h1>

        <p className="text-gray-500 text-xs mb-6">Last updated: July 20, 2025</p>
        <p className="mb-4">
          At <strong>Trinity Courses</strong>, all our products are delivered digitally. Once your payment is confirmed, you'll receive access to your purchased courses via email or directly on your account dashboard.
        </p>
        
        <h2 className="text-lg font-semibold mt-8 mb-2">1. Delivery Timeline</h2>
        <p className="mb-4">
          Most course enrollments are processed and granted access instantly upon successful payment. In rare cases, it may take up to 24 hours due to payment gateway processing delays.
        </p>

        <h2 className="text-lg font-semibold mt-8 mb-2">2. Delivery Method</h2>
        <ul className="list-disc list-inside mb-4">
          <li>Courses are accessible through your Trinity Courses account dashboard.</li>
          <li>A confirmation email with access instructions will be sent to your registered email address.</li>
          <li>No physical product will be shipped to you.</li>
        </ul>

        <h2 className="text-lg font-semibold mt-8 mb-2">3. Issues with Delivery</h2>
        <p className="mb-4">
          If you do not receive course access within 24 hours after a successful payment, please contact us immediately at{" "}
          <a href="mailto:trinityconsultancyofficial@gmail.com" className="text-red-600 underline">
            trinityconsultancyofficial@gmail.com
          </a>. Include your payment reference ID for faster resolution.
        </p>

        <h2 className="text-lg font-semibold mt-8 mb-2">4. Razorpay Shipping Policy</h2>
        <p className="mb-4">
          For additional information, you can also refer to our Razorpay-hosted shipping policy:
        </p>
        <p className="mb-6">
          🔗{" "}
          <a
            href="https://merchant.razorpay.com/policy/Qqwg6bvTfuIyWr/shipping"
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-600 underline"
          >
            View Razorpay Shipping Policy
          </a>
        </p>

        <h2 className="text-lg font-semibold mt-8 mb-2">5. Contact Us</h2>
        <p>
          If you have any questions or concerns regarding delivery, please reach out to our team at{" "}
          <a href="mailto:trinityconsultancyofficial@gmail.com" className="text-red-600 underline">
            trinityconsultancyofficial@gmail.com
          </a>.
        </p>
      </main>
      <Footer />
    </>
  )
}
