"use client";

import Link from "next/link";
import { Brain } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#4854F6] text-indigo-100 py-16">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
        <div className="col-span-2 lg:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-[#4854F6] font-bold">
              E
            </div>
            <span className="text-2xl font-extrabold text-white">Edison</span>
          </div>
          <p className="font-semibold opacity-80 max-w-xs">
            Democratizing access to high-quality education for every Nigerian
            student.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="font-extrabold text-white text-lg">About us</h4>
          <a
            href="#"
            className="font-semibold hover:text-white transition-colors"
          >
            Courses
          </a>
          <a
            href="#"
            className="font-semibold hover:text-white transition-colors"
          >
            Mission
          </a>
          <a
            href="#"
            className="font-semibold hover:text-white transition-colors"
          >
            Team
          </a>
          <a
            href="#"
            className="font-semibold hover:text-white transition-colors"
          >
            Contact
          </a>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="font-extrabold text-white text-lg">Product</h4>
          <a
            href="#"
            className="font-semibold hover:text-white transition-colors"
          >
            Edison for Schools
          </a>
          <a
            href="#"
            className="font-semibold hover:text-white transition-colors"
          >
            JAMB Prep
          </a>
          <a
            href="#"
            className="font-semibold hover:text-white transition-colors"
          >
            WAEC Past Questions
          </a>
          <a
            href="#"
            className="font-semibold hover:text-white transition-colors"
          >
            Super Edison
          </a>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="font-extrabold text-white text-lg">Support</h4>
          <a
            href="#"
            className="font-semibold hover:text-white transition-colors"
          >
            Help Center
          </a>
          <a
            href="#"
            className="font-semibold hover:text-white transition-colors"
          >
            Terms
          </a>
          <a
            href="#"
            className="font-semibold hover:text-white transition-colors"
          >
            Privacy
          </a>
          <a
            href="#"
            className="font-semibold hover:text-white transition-colors"
          >
            Community Guidelines
          </a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-12 pt-8 border-t border-indigo-400/50 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-bold opacity-70">© 2025 Edison Ltd.</p>
        <div className="flex gap-4">
          {/* Social placeholders */}
          <div className="w-8 h-8 bg-black/10 rounded-full hover:bg-black/20 cursor-pointer"></div>
          <div className="w-8 h-8 bg-black/10 rounded-full hover:bg-black/20 cursor-pointer"></div>
          <div className="w-8 h-8 bg-black/10 rounded-full hover:bg-black/20 cursor-pointer"></div>
        </div>
      </div>
    </footer>
  );
}
