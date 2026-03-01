"use client";

import { useEffect, useState } from "react";

export function MobileCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-light px-4 py-3 md:hidden transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <a
        href="#"
        className="block w-full bg-red text-white text-center py-3.5 rounded-2xl font-medium text-sm"
        aria-label="Purchase Learn Radicals PDF for $10"
      >
        Get Learn Radicals &mdash; $10
      </a>
    </div>
  );
}
