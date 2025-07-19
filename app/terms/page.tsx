// app/terms-of-service/page.tsx
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function TermsOfService() {
  return (
<>
        <Navbar />
    <main className="bg-white text-black px-4 py-8 max-w-xl mx-auto text-sm sm:text-base">
      <h1 className="text-2xl font-bold mb-4 text-red-600">Terms of Service</h1>

      <p className="mb-4">
        Welcome to <strong>Trinity Courses</strong>. By accessing or using our platform, you agree to be bound by the following terms and conditions.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2 text-black">1. Use of the Platform</h2>
      <p className="mb-4">
        You must be at least 13 years old to use our services. You agree not to misuse the platform or access it using unauthorized means.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2 text-black">2. User Responsibilities</h2>
      <ul className="list-disc list-inside mb-4">
        <li>You are responsible for maintaining the confidentiality of your account.</li>
        <li>You agree to use content only for personal and non-commercial purposes.</li>
      </ul>

      <h2 className="text-lg font-semibold mt-6 mb-2 text-black">3. Content Ownership</h2>
      <p className="mb-4">
        All materials provided are the intellectual property of Trinity Courses or its partners. Reproduction without permission is prohibited.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2 text-black">4. Termination</h2>
      <p className="mb-4">
        We may suspend or terminate access to the platform if these terms are violated.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2 text-black">5. Changes</h2>
      <p className="mb-4">
        We reserve the right to modify these terms at any time. Continued use after changes means you accept the new terms.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2 text-black">6. Contact</h2>
      <p>
        For any questions regarding these terms, email us at <a href="mailto:support@trinitycourses.com" className="text-red-600 underline">support@trinitycourses.com</a>.
      </p>
    </main>
      <Footer/>
      </>
  );
}
