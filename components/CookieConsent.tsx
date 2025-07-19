"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function CookieConsent() {
  const [accepted, setAccepted] = useState(true);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) setAccepted(false);
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "true");
    setAccepted(true);
  };

  return (
    <AnimatePresence>
      {!accepted && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed bottom-4 left-4 right-4 max-w-xl mx-auto z-50 p-4 rounded-xl border border-gray-200 bg-white dark:bg-zinc-900 dark:border-zinc-700 shadow-lg backdrop-blur-md"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-800 dark:text-gray-300">
              🍪 We use cookies to personalize your experience and analyze traffic. By using our site, you agree to our cookie policy.
            </p>
            <button
              onClick={acceptCookies}
              className="px-4 py-2 rounded-md text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition"
            >
              Accept
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
