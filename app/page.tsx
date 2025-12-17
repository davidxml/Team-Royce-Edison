"use client";

import { motion } from "framer-motion";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import {
  BookOpen,
  Brain,
  Zap,
  Users,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-[#6c47ff] via-[#8b5cf6] to-[#a78bfa] text-white">
        <div className="absolute inset-0 bg-grid-white bg-size-[20px_20px]" />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6"
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">
                AI-Powered One-on-One Tutoring
              </span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Personalized Learning,
              <br />
              <span className="bg-linear-to-r from-yellow-200 to-yellow-400 bg-clip-text text-transparent">
                Powered by AI
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Experience the power of one-on-one tutoring with Edison. Our AI
              adapts to your learning style, providing continuous, contextually
              rich feedback that static content simply cannot deliver.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <SignedOut>
                <Link href="/sign-in">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-[#6c47ff] font-semibold px-8 py-4 rounded-full text-lg shadow-lg hover:shadow-xl transition-shadow"
                  >
                    Get Started Free
                  </motion.button>
                </Link>
                <Link href="/sign-in">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white/10 backdrop-blur-sm text-white font-semibold px-8 py-4 rounded-full text-lg border border-white/20 hover:bg-white/20 transition-colors"
                  >
                    Sign In
                  </motion.button>
                </Link>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-[#6c47ff] font-semibold px-8 py-4 rounded-full text-lg shadow-lg hover:shadow-xl transition-shadow flex items-center gap-2"
                  >
                    Go to Dashboard
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
              </SignedIn>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Edison Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Research shows one-on-one tutoring delivers superior results.
              Edison brings that power to every student.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "Adaptive Learning",
                description:
                  "Our AI continuously adapts to your learning pace and style, providing personalized instruction that evolves with you.",
              },
              {
                icon: Zap,
                title: "Instant Feedback",
                description:
                  "Get immediate, contextually rich feedback on your work. No more waiting for pre-recorded content to catch up.",
              },
              {
                icon: BookOpen,
                title: "Nigerian Curriculum",
                description:
                  "Aligned with Nigerian educational standards, ensuring relevance to your academic journey.",
              },
              {
                icon: Users,
                title: "One-on-One Focus",
                description:
                  "Experience the proven benefits of personalized tutoring, backed by decades of educational research.",
              },
              {
                icon: Sparkles,
                title: "Low Bandwidth",
                description:
                  "Optimized for Nigerian internet conditions, delivering quality education even on slower connections.",
              },
              {
                icon: BookOpen,
                title: "Teacher Tools",
                description:
                  "Comprehensive tools for educators to track progress and enhance classroom instruction.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="w-12 h-12 bg-[#6c47ff] rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-linear-to-r from-[#6c47ff] to-[#8b5cf6] text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to Transform Your Learning?
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of students experiencing the power of personalized
              AI tutoring.
            </p>
            <SignedOut>
              <Link href="/sign-in">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-[#6c47ff] font-semibold px-8 py-4 rounded-full text-lg shadow-lg hover:shadow-xl transition-shadow"
                >
                  Start Learning Today
                </motion.button>
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-[#6c47ff] font-semibold px-8 py-4 rounded-full text-lg shadow-lg hover:shadow-xl transition-shadow"
                >
                  Continue Learning
                </motion.button>
              </Link>
            </SignedIn>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
