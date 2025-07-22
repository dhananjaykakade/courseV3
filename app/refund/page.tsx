"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function RefundPolicy() {
  return (
    <>
      <Navbar />
      <main className="bg-white text-black px-4 py-8 max-w-3xl mx-auto text-sm sm:text-base leading-7">
        <h1 className="text-3xl font-bold mb-6 text-red-600">Refund Policy</h1>

        <p className="mb-4">
          At <strong>Trinity Courses</strong>, we are committed to providing high-quality educational content. However, all payments made on our platform are subject to our refund policy as governed by Razorpay.
        </p>

        <h2 className="text-lg font-semibold mt-8 mb-2">Eligibility for Refunds</h2>
        <p className="mb-4">
          Refunds are provided only under specific conditions as defined in our payment partner's terms. Refund requests must be submitted within the eligible timeframe and will be reviewed on a case-by-case basis.
        </p>

        <h2 className="text-lg font-semibold mt-8 mb-2">Processing Time</h2>
        <p className="mb-4">
          Approved refunds are processed within 7–10 business days. Refunds will be credited back to the original payment method.
        </p>

        <h2 className="text-lg font-semibold mt-8 mb-2">Third-Party Payment Partner</h2>
        <p className="mb-4">
          We use <strong>Razorpay</strong> as our trusted payment processor. Please refer to their official refund policy below for additional details:
        </p>

        <p className="mb-6">
          🔗{" "}
          <a
            href="https://merchant.razorpay.com/policy/Qqwg6bvTfuIyWr/refund"
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-600 underline"
          >
            Razorpay Refund Policy
          </a>
        </p>

        <h2 className="text-lg font-semibold mt-8 mb-2">Need Help?</h2>
        <p>
          If you have any questions about your payment or eligibility for a refund, contact us at{" "}
          <a href="mailto:trinityconsultancyofficial@gmail.com" className="text-red-600 underline">
            trinityconsultancyofficial@gmail.com
          </a>.
        </p>
      </main>
      <Footer />
    </>
  )
}
