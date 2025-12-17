"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { SignedIn, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Nunito } from "next/font/google";
import {
  QuestItem,
  Target
} from "@/components/ui/dashboard-subcomponents";
import Image from "next/image";
import {
  Book,
  MessageCircle,
  Layers,
  PenTool,
  Trophy,
  User,
  MoreHorizontal,
  Flame,
  Zap,
  Heart,
  Star,
  Lock,
  Check,
  Mic,
  ChevronRight,
  Dumbbell,
} from "lucide-react";
import Sidebar from "@/components/LeftSidebar";

// Initialize Font
const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});
export default function Dashboard() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("learn");


  // Mock Data for the Nigerian Curriculum Path (e.g., JSS 1 Math)
  const units = [
      {
          id: 1,
          title: "Unit 1: Number Bases",
          description: "Learn about binary and base 10 systems.",
          color: "bg-[#4854F6]", // Edison Blue
          lessons: [
              { id: 1, status: "completed", stars: 3, icon: <Star size={20} /> },
              { id: 2, status: "completed", stars: 2, icon: <Book size={20} /> },
              { id: 3, status: "current", stars: 0, icon: <Star size={24} /> }, // Larger current icon
              { id: 4, status: "locked", stars: 0, icon: <Book size={20} /> },
              { id: 5, status: "locked", stars: 0, icon: <Book size={20} /> },
              { id: 6, status: "locked", stars: 0, icon: <Book size={20} /> },
              { id: 7, status: "locked", stars: 0, icon: <Trophy size={22} /> }, // Unit test
            ],
        },
      {
          id: 2,
          title: "Unit 2: Algebraic Simplification",
          description: "Grouping terms and basic equations.",
          color: "bg-emerald-500",
          lessons: [
              { id: 8, status: "locked", stars: 0, icon: <Book size={20} /> },
              { id: 9, status: "locked", stars: 0, icon: <Book size={20} /> },
              { id: 10, status: "locked", stars: 0, icon: <Book size={20} /> },
              { id: 11, status: "locked", stars: 0, icon: <Book size={20} /> },
              { id: 12, status: "locked", stars: 0, icon: <Trophy size={22} /> },
            ],
        },
      {
          id: 3,
          title: "Unit 3: Geometry & Shapes",
          description: "Angles, lines, and 2D properties.",
          color: "bg-orange-500",
          lessons: [
              { id: 13, status: "locked", stars: 0, icon: <Book size={20} /> },
              { id: 14, status: "locked", stars: 0, icon: <Book size={20} /> },
              { id: 15, status: "locked", stars: 0, icon: <Trophy size={22} /> },
            ],
        },
    ];


  return (
      <SignedIn>
          <div
    className={`min-h-screen bg-white text-gray-700 flex ${nunito.className}`}
              >
              {/* CSS for custom interactions */}
              <style jsx global>{`
                  /* Custom Scrollbar */
                  ::-webkit-scrollbar {
                      width: 8px;
                    }
                  ::-webkit-scrollbar-track {
                      background: transparent;
                    }
                  ::-webkit-scrollbar-thumb {
                      background: #e5e7eb;
                      border-radius: 10px;
                    }
                  ::-webkit-scrollbar-thumb:hover {
                      background: #d1d5db;
                    }
                  /* Button Press Effect */
                  .btn-press {
                      transition: all 0.1s;
                      border-bottom-width: 4px;
                    }
                  .btn-press:active {
                      transform: translateY(2px);
                      border-bottom-width: 0px;
                      margin-bottom: 4px;
                    }
                `}</style>
             
              {/* --- MAIN CONTENT (The Path) --- */}
              <main className="flex-1 md:ml-20 lg:ml-64 mr-0 lg:mr-96 px-4 max-w-2xl mx-auto w-full pb-24">
                  {/* Mobile Header (Visible only on small screens) */}
                  <div className="md:hidden flex items-center justify-between py-4 border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur z-50">
                    <span className="text-xl font-black text-[#4854F6]">Edison</span>
                      <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1 text-orange-500 font-bold">
                              <Flame size={20} fill="currentColor" /> 12
                            </div>
                          <div className="flex items-center gap-1 text-blue-500 font-bold">
                              <Zap size={20} fill="currentColor" /> 450
                            </div>
                          <UserButton afterSignOutUrl="/" />
                        </div>
                    </div>
                  {/* FIXED COURSE HEADER */}
                  <motion.div
        initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm pt-6 pb-4 border-b border-gray-100 mb-6"
                      >
                      <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 hover:bg-gray-100 p-2 -ml-2 rounded-xl cursor-pointer transition-colors group">
                              <div className="w-10 h-8 rounded-lg border-2 border-gray-300 group-hover:border-gray-400 flex items-center justify-center bg-white">
                                  <img
                src="https://flagcdn.com/w40/ng.png"
                                      alt="Nigeria"
                                      className="w-6 h-4 object-cover rounded-sm opacity-80"
                                      />
                                </div>
                              <div>
                                  <h2 className="font-extrabold text-gray-400 text-xs uppercase tracking-wider">
                                      Current Course
                                    </h2>
                                  <h1 className="font-black text-gray-700 text-lg md:text-xl">
                                      JSS 1 Mathematics
                                    </h1>
                                </div>
                              <ChevronRight className="text-gray-400 group-hover:rotate-90 transition-transform" />
                            </div>
                        </div>
                    </motion.div>
                  {/* Learning Path Units */}
                  <div className="space-y-4">
                      {units.map((unit) => (
            <div key={unit.id} className="relative pb-10">
                              {/* STICKY UNIT BANNER */}
                              <div
              className={`sticky top-28 z-20 ${unit.color} text-white rounded-2xl p-4 mb-12 flex justify-between items-center shadow-lg mx-2`}
                                  >
                                  <div>
                                      <h3 className="font-bold text-lg opacity-90">
                                          {unit.title}
                                        </h3>
                                      <p className="text-sm font-medium opacity-75">
                                          {unit.description}
                                        </p>
                                    </div>
                                  <Link
                href={`/unit/${unit.id}`}
                                      className="bg-white/20 hover:bg-white/30 p-2 rounded-xl transition-colors"
                                      >
                                      <Book size={24} />
                                    </Link>
                                </div>
                              {/* The Winding Path of Nodes */}
                              <div className="flex flex-col items-center gap-6 relative">
                                  {unit.lessons.map((lesson, index) => {
                  // Snake Path Logic
                                      const offsetClass =
                                      index % 4 === 1
                                          ? "-translate-x-12"
                                              : index % 4 === 2
                                              ? "-translate-x-12"
                                              : index % 4 === 3
                                              ? "translate-x-12"
                                              : index % 4 === 0 && index !== 0
                                              ? "translate-x-12"
                                              : "";
                      
                      
                                              return (
                                          <motion.div
                                          initial={{ opacity: 0, scale: 0.8 }}
                                              whileInView={{ opacity: 1, scale: 1 }}
                                              viewport={{ once: true }}
                                              key={lesson.id}
                                              className={`transform ${offsetClass} relative group`}
                                              >
                                              {/* Floating Tooltip for Current Lesson */}
                                              {lesson.status === "current" && (
                        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white text-gray-700 font-bold py-1 px-3 rounded-xl border-2 border-gray-200 shadow-sm whitespace-nowrap z-10 animate-bounce">
                                                      START
                                                      <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-b-2 border-r-2 border-gray-200 transform rotate-45"></div>
                                                    </div>
                        )}
                                              {/* Lesson Button */}
                                              <Link href={`/lesson/${lesson.id}`}>
                                                <button
                        disabled={lesson.status === "locked"}
                                                      className={`
                                                          w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center relative
                                                              transition-all duration-200 btn-press
                                                              ${
                                                                  lesson.status === "completed"
                                                                  ? "bg-[#FFC800] border-[#E5B400] text-white shadow-[0_4px_0_#E5B400]"
                                                                      : lesson.status === "current"
                                                                      ? "bg-[#4854F6] border-[#353EB5] text-white shadow-[0_4px_0_#353EB5]"
                                                                      : "bg-gray-200 border-gray-300 text-gray-400 shadow-[0_4px_0_#D1D5DB] cursor-not-allowed"
                                                                    }
                                                              `}
                                                      >
                                                      {lesson.status === "completed" && (
                            <div className="absolute -top-1 -right-1 bg-white rounded-full p-1 shadow-sm">
                                                              <Check
                              size={12}
                                                                  className="text-[#FFC800] stroke-[4]"
                                                                  />
                                                            </div>
                            )}
                                                      {lesson.status === "locked" ? (
                            <Lock size={24} opacity={0.5} />
                                                        ) : (
                                                          lesson.icon
                                                        )}
                                                      {lesson.status === "current" && (
                            <svg className="absolute -top-2 -left-2 w-20 h-20 md:w-24 md:h-24 pointer-events-none opacity-40">
                                                              <circle
                              cx="50%"
                                                                  cy="50%"
                                                                  r="45%"
                                                                  fill="none"
                                                                  stroke="currentColor"
                                                                  strokeWidth="6"
                                                                  strokeDasharray="10 10"
                                                                  />
                                                            </svg>
                            )}
                                                    </button>
                                                </Link>
                                            </motion.div>
                    );
                                    })}
                                </div>
                            </div>
            ))}
                    </div>
                </main>
              Mobiley
             
            </div>
        </SignedIn>
  );
}
