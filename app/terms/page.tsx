"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function TermsOfService() {
  return (
    <>
      <Navbar />
      <main className="bg-white text-black px-4 py-8 max-w-3xl mx-auto text-sm sm:text-base leading-7">
        <h1 className="text-3xl font-bold mb-6 text-red-600">Terms of Service</h1>

        <p className="mb-4">
          Welcome to <strong>Trinity Courses</strong>. By accessing or using our platform, you agree to be bound by these Terms of Service, our{" "}
          <a href="/privacy-policy" className="text-red-600 underline">Privacy Policy</a>, and any other applicable policies.
        </p>

        <h2 className="text-lg font-semibold mt-8 mb-2">1. Eligibility</h2>
        <p className="mb-4">
          You must be at least 13 years of age to use our platform. By using Trinity Courses, you confirm that you meet this requirement and have the legal authority to accept these terms.
        </p>

        <h2 className="text-lg font-semibold mt-8 mb-2">2. Use of the Platform</h2>
        <ul className="list-disc list-inside mb-4">
          <li>You agree to use the platform only for lawful purposes.</li>
          <li>You will not misuse the platform, disrupt its functionality, or attempt unauthorized access.</li>
          <li>Sharing of login credentials or course content is strictly prohibited.</li>
        </ul>

        <h2 className="text-lg font-semibold mt-8 mb-2">3. Account and Security</h2>
        <ul className="list-disc list-inside mb-4">
          <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
          <li>Any activity under your account is your responsibility unless proven otherwise.</li>
        </ul>

        <h2 className="text-lg font-semibold mt-8 mb-2">4. Intellectual Property</h2>
        <p className="mb-4">
          All content on Trinity Courses — including videos, PDFs, text, logos, and visuals — is the property of Trinity Courses or our partners.
          You may not reuse, reproduce, or redistribute content without explicit written permission.
        </p>

        <h2 className="text-lg font-semibold mt-8 mb-2">5. Payments & Refunds</h2>
        <p className="mb-4">
          Payments made via our platform are securely processed by Razorpay. By making a purchase, you agree to Razorpay’s policies:
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
        </ul>

        <h2 className="text-lg font-semibold mt-8 mb-2">6. Termination</h2>
        <p className="mb-4">
          We reserve the right to suspend or terminate your access to the platform if you violate these terms, misuse our services, or engage in behavior deemed harmful to the community.
        </p>

        <h2 className="text-lg font-semibold mt-8 mb-2">7. Modifications to Terms</h2>
        <p className="mb-4">
          Trinity Courses may update these terms at any time. Changes will be posted on this page. Your continued use of the platform signifies your acceptance of any updates.
        </p>

        <h2 className="text-lg font-semibold mt-8 mb-2">8. Limitation of Liability</h2>
        <p className="mb-4">
          We are not liable for any indirect, incidental, or consequential damages arising out of your use of the platform. Access to content and services is provided on an "as-is" basis.
        </p>

        <h2 className="text-lg font-semibold mt-8 mb-2">9. Contact Us</h2>
        <p>
          If you have any questions or concerns about these Terms, contact us at{" "}
          <a href="mailto:support@trinitycourses.com" className="text-red-600 underline">
            support@trinitycourses.com
          </a>{" "}
          or via our{" "}
          <a
            href="https://merchant.razorpay.com/policy/Qqwg6bvTfuIyWr/contact_us"
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-600 underline"
          >
            Razorpay contact page
          </a>.
        </p>
      </main>
      <Footer />
    </>
  )
}
