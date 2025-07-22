"use client";

import Link from "next/link";
import Image from "next/image";
import { SquareArrowOutUpRight } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-gray-200 text-black py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <Link
              href={"/"}
              className="text-xl font-bold text-gray-900 hover:text-red-500 transition-colors"
            >
              <div className="flex items-center mb-4">
                <img
                  src="/favicon.png"
                  alt="Trinity Courses Logo"
                  className="w-8 h-8 mr-2"
                />
                <h3 className="text-2xl font-bold">Trinity Courses</h3>
              </div>
            </Link>
            <p className="text-black-400 mb-4">
              Empowering learners worldwide with high-quality, accessible
              education. Master new skills and advance your career with our
              expert-led courses.
            </p>
            <div className="flex items-center space-x-2">
              <Image
                src="/razorpay-logo.png"
                alt="Razorpay Secure"
                width={100}
                height={30}
                className="object-contain"
              />
              <span className="text-xs text-black-400">
                100% Secure Payments powered by Razorpay
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-black-400">
              <li>
                <Link
                  href="/home"
                  className="hover:text-red-500 transition-colors"
                >
                  Courses
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-red-500 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-red-500 transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-black-400">
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-red-500 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-red-500 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/refund"
                  className="hover:text-red-500 transition-colors"
                >
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-black-400 text-sm">
          {/* refer to main website Trinity Consultancy  add icon for redirect*/}
          <p className="mb-2">
            Built with <span className="text-red-500">❤️</span> by{" "}
            {
              <Link
                href="https://trinityconsultancy.tech"
                className="text-red-500 hover:underline"
              >
                Trinity Consultancy
                <SquareArrowOutUpRight className="inline w-4 h-4 ml-1" />
              </Link>
            }
          </p>

          <p>
            &copy; {new Date().getFullYear()} Trinity Courses. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
