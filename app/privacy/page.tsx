// app/privacy-policy/page.tsx (Next.js App Router)
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function PrivacyPolicy() {
  return (
    <>
    <Navbar />
    <main className="bg-white text-black px-4 py-8 max-w-xl mx-auto text-sm sm:text-base">
      <h1 className="text-2xl font-bold mb-4 text-red-600">Privacy Policy</h1>

      <p className="mb-4">
        At <strong>Trinity Courses</strong>, your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2 text-black">1. Information We Collect</h2>
      <ul className="list-disc list-inside mb-4">
        <li>Personal details like name, email address, and phone number.</li>
        <li>Course activity, preferences, and completion data.</li>
        <li>Usage data including IP address and browser type.</li>
      </ul>

      <h2 className="text-lg font-semibold mt-6 mb-2 text-black">2. How We Use Your Information</h2>
      <p className="mb-4">We use your information to:</p>
      <ul className="list-disc list-inside mb-4">
        <li>Provide and personalize course content</li>
        <li>Send important notifications</li>
        <li>Improve our platform and user experience</li>
      </ul>

      <h2 className="text-lg font-semibold mt-6 mb-2 text-black">3. Data Security</h2>
      <p className="mb-4">
        We take reasonable steps to protect your information from unauthorized access using encryption and secure servers.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2 text-black">4. Third-Party Sharing</h2>
      <p className="mb-4">
        We do not sell your personal data. We may share data with third-party services we use for analytics and communication.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2 text-black">5. Contact</h2>
      <p>
        If you have any questions about this policy, contact us at <a href="mailto:support@trinitycourses.com" className="text-red-600 underline">support@trinitycourses.com</a>.
      </p>
    </main>
     <Footer/>
     </>
  );
}
