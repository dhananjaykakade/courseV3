"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function PrivacyPolicy() {
  return (
    <>
      <Navbar />
      <main className="bg-white text-black px-4 py-8 max-w-3xl mx-auto text-sm sm:text-base leading-7">
        <h1 className="text-3xl font-bold mb-6 text-red-600">Privacy Policy</h1>

        <p className="mb-4">
          At <strong>Trinity Consultancy</strong>, we value your privacy and are committed to protecting your personal data. This Privacy Policy outlines how we collect, use, and safeguard your information when you use our website, services, or products.
        </p>

        <h2 className="text-lg font-semibold mt-8 mb-2">1. Information We Collect</h2>
        <ul className="list-disc list-inside mb-4">
          <li>Personal information: name, email address, phone number, billing details.</li>
          <li>Account and course activity: enrollment history, course progress, preferences.</li>
          <li>Technical data: IP address, browser type, device info, usage data.</li>
        </ul>

        <h2 className="text-lg font-semibold mt-8 mb-2">2. How We Use Your Information</h2>
        <p className="mb-4">We use the information we collect to:</p>
        <ul className="list-disc list-inside mb-4">
          <li>Provide access to our courses and services</li>
          <li>Send transactional emails, updates, and important notices</li>
          <li>Process payments securely via third-party providers</li>
          <li>Analyze user behavior to improve our platform</li>
        </ul>

        <h2 className="text-lg font-semibold mt-8 mb-2">3. Payments and Razorpay</h2>
        <p className="mb-4">
          We use <strong>Razorpay</strong> to securely process payments. Razorpay may collect personal and payment data in accordance with its own{" "}
          <a
            href="https://razorpay.com/privacy/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-600 underline"
          >
            Privacy Policy
          </a>. You can also review:
        </p>
        <ul className="list-disc list-inside mb-4 ml-4">
          <li>
            <a
              href="https://merchant.razorpay.com/policy/Qqwg6bvTfuIyWr/refund"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-600 underline"
            >
              Refund Policy
            </a>
          </li>
          <li>
            <a
              href="https://merchant.razorpay.com/policy/Qqwg6bvTfuIyWr/shipping"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-600 underline"
            >
              Shipping Policy
            </a>
          </li>
          <li>
            <a
              href="https://merchant.razorpay.com/policy/Qqwg6bvTfuIyWr/contact_us"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-600 underline"
            >
              Contact Us
            </a>
          </li>
        </ul>

        <h2 className="text-lg font-semibold mt-8 mb-2">4. Data Security</h2>
        <p className="mb-4">
          We implement industry-standard security measures to protect your personal data, including encrypted connections (SSL), access controls, and regular audits.
        </p>

        <h2 className="text-lg font-semibold mt-8 mb-2">5. Sharing Your Data</h2>
        <p className="mb-4">
          We do not sell or rent your personal data. Your information may be shared with trusted third-party providers we use for payment processing (e.g., Razorpay), analytics, and communication services — only to the extent necessary to deliver our services.
        </p>

        <h2 className="text-lg font-semibold mt-8 mb-2">6. Your Rights</h2>
        <ul className="list-disc list-inside mb-4">
          <li>Access or request a copy of your personal data</li>
          <li>Request corrections or updates to your information</li>
          <li>Request deletion of your account or data, subject to legal limitations</li>
        </ul>

        <h2 className="text-lg font-semibold mt-8 mb-2">7. Updates to This Policy</h2>
        <p className="mb-4">
          This policy may be updated from time to time. We will notify you of any significant changes through our website or email.
        </p>

        <h2 className="text-lg font-semibold mt-8 mb-2">8. Contact Us</h2>
        <p className="mb-4">
          If you have any questions or concerns regarding this Privacy Policy, contact us at{" "}
          <a href="mailto:trinityconsultancyofficial@gmail.com" className="text-red-600 underline">
            trinityconsultancyofficial@gmail.com
          </a>.
        </p>
      </main>
      <Footer />
    </>
  )
}
