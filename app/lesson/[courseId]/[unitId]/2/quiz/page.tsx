"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Zap, Check, AlertCircle } from "lucide-react";
import { DASHBOARD_ROUTES, LESSION_ROUTES } from "@/constants/routes";

export default function Quiz({
  params,
}: {
  params: { courseId: string; unitId: string; levelId: string };
}) {
  const router = useRouter();
  const { courseId, unitId, levelId } = params;

  // --- STATE MANAGEMENT ---
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");

  // Mock Data (In a real app, you'd fetch this based on levelId)
  const questionData = {
    question: "What is the binary representation of the decimal number 5?",
    options: [
      { id: 1, text: "110", image: null },
      { id: 2, text: "101", image: null },
      { id: 3, text: "111", image: null },
      { id: 4, text: "100", image: null },
    ],
    correctAnswerId: 2,
  };

  // --- HANDLERS ---
  const handleCheck = () => {
    if (!selectedOption) return;

    if (selectedOption === questionData.correctAnswerId) {
      setStatus("correct");
      // Play specific success sound here
    } else {
      setStatus("wrong");
      // Play error sound here
    }
  };

  const handleContinue = () => {
    // LOGIC: Check if this was the last level.
    // If yes -> Go to Unit Complete page.
    // If no -> Go to next level (levelId + 1).

    // For now, let's just go back to dashboard to show the loop works
    router.push(
      LESSION_ROUTES.LESSON(courseId, unitId, (parseInt(levelId) + 1).toString())
    );
  };

  return (
    <div className="flex flex-col h-screen max-w-5xl mx-auto">
      {/* --- HEADER (Progress & Lives) --- */}
      <header className="flex items-center gap-4 p-6 w-full">
        <Link href={DASHBOARD_ROUTES.DASHBOARD}>
          <X
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
            size={28}
          />
        </Link>

        {/* Progress Bar */}
        <div className="flex-1 bg-gray-200 h-4 rounded-full overflow-hidden relative">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "60%" }} // Dynamic based on actual progress
            className="bg-[#4854F6] h-full rounded-full transition-all duration-500"
          />
          {/* Highlight shine effect on bar */}
          <div className="absolute top-1 left-2 h-1 w-[55%] bg-white/20 rounded-full"></div>
        </div>

        {/* Lives Counter */}
        <div className="flex items-center gap-2 text-red-500 font-bold">
          <Heart fill="currentColor" size={24} />
          <span>5</span>
        </div>
      </header>

      {/* --- MAIN QUESTION AREA --- */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-32">
        <div className="w-full max-w-2xl">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-700 mb-8 text-center">
            {questionData.question}
          </h1>

          {/* Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {questionData.options.map((option) => {
              const isSelected = selectedOption === option.id;
              const isCorrect = status === "correct" && isSelected;
              const isWrong = status === "wrong" && isSelected;

              return (
                <button
                  key={option.id}
                  onClick={() =>
                    status === "idle" && setSelectedOption(option.id)
                  }
                  disabled={status !== "idle"}
                  className={`
                    p-6 rounded-2xl border-2 border-b-4 text-xl font-bold flex items-center justify-between
                    transition-all duration-200 active:scale-[0.98]
                    ${
                      isSelected
                        ? "bg-blue-50 border-[#4854F6] text-[#4854F6]"
                        : "bg-white border-gray-200 hover:bg-gray-50 text-gray-700"
                    }
                    ${
                      isCorrect &&
                      "bg-green-100 border-green-500 text-green-600 !border-b-4"
                    }
                    ${
                      isWrong &&
                      "bg-red-100 border-red-500 text-red-600 !border-b-4"
                    }
                  `}
                >
                  <span>{option.text}</span>

                  {/* Option Checkbox Display */}
                  <div
                    className={`
                    w-6 h-6 rounded border-2 flex items-center justify-center
                    ${
                      isSelected
                        ? "border-[#4854F6] bg-[#4854F6] text-white"
                        : "border-gray-200"
                    }
                    ${isCorrect && "border-green-500 bg-green-500"}
                    ${isWrong && "border-red-500 bg-red-500"}
                  `}
                  >
                    {isSelected && <Check size={16} strokeWidth={4} />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </main>

      {/* --- FOOTER (Fixed Bottom) --- */}
      <footer
        className={`
          fixed bottom-0 left-0 w-full border-t-2 p-4 pb-8 md:pb-4 transition-colors duration-300 z-50
          ${
            status === "correct"
              ? "bg-green-100 border-green-200"
              : status === "wrong"
              ? "bg-red-100 border-red-200"
              : "bg-white border-gray-200"
          }
        `}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          {/* Feedback Message (Hidden when idle) */}
          <div className="hidden md:block">
            {status === "correct" && (
              <div className="flex items-center gap-3 text-green-700 font-bold text-xl">
                <div className="bg-white p-2 rounded-full">
                  <Check size={30} />
                </div>
                <span>Excellent!</span>
              </div>
            )}
            {status === "wrong" && (
              <div className="flex items-center gap-3 text-red-700 font-bold text-xl">
                <div className="bg-white p-2 rounded-full">
                  <X size={30} />
                </div>
                <div className="flex flex-col">
                  <span>Correct Answer:</span>
                  <span className="text-sm font-normal">
                    {
                      questionData.options.find(
                        (o) => o.id === questionData.correctAnswerId
                      )?.text
                    }
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="w-full md:w-auto ml-auto">
            {status === "idle" ? (
              <button
                onClick={handleCheck}
                disabled={!selectedOption}
                className={`
                  w-full md:w-40 py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all
                  ${
                    selectedOption
                      ? "bg-[#4854F6] text-white shadow-[0_4px_0_#353EB5] btn-press hover:brightness-110"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }
                `}
              >
                Check
              </button>
            ) : (
              <button
                onClick={handleContinue}
                className={`
                  w-full md:w-40 py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all btn-press
                  text-white shadow-[0_4px_0_rgba(0,0,0,0.2)]
                  ${
                    status === "correct"
                      ? "bg-green-500 shadow-[0_4px_0_#16a34a]"
                      : "bg-red-500 shadow-[0_4px_0_#dc2626]"
                  }
                `}
              >
                Continue
              </button>
            )}
          </div>
        </div>
      </footer>

      {/* Mobile Feedback Overlay (Shows above footer on small screens) */}
      <AnimatePresence>
        {status !== "idle" && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden fixed bottom-28 left-4 right-4 z-40"
          >
            {status === "correct" && (
              <div className="bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 text-green-600 font-bold border-2 border-green-100">
                <Check size={24} className="text-green-500" /> Great job!
              </div>
            )}
            {status === "wrong" && (
              <div className="bg-white p-4 rounded-2xl shadow-xl flex flex-col text-red-600 font-bold border-2 border-red-100">
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle size={20} /> Correct solution:
                </div>
                <div className="text-gray-700">
                  {
                    questionData.options.find(
                      (o) => o.id === questionData.correctAnswerId
                    )?.text
                  }
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
