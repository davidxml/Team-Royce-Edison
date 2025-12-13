"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { Brain } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 bg-linear-to-br from-[#6c47ff] to-[#8b5cf6] rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Edison</span>
            </motion.div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <SignedIn>
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
              >
                Dashboard
              </Link>
              <Link
                href="/lessons"
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
              >
                Lessons
              </Link>
              <Link
                href="/profile"
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
              >
                Profile
              </Link>
            </SignedIn>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer"
                >
                  Sign Up
                </motion.button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  );
}
