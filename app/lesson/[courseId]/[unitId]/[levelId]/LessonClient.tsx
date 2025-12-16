"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronLeft,
  X,
  Mic,
  Zap,
  MessageCircle,
  PlayCircle,
} from "lucide-react";

// Define the shape of our slide data
interface Slide {
  type: string;
  title: string;
  content: string;
  emoji: string;
}

interface LessonClientProps {
  slides: Slide[];
  nextUrl: string; // URL for the Quiz or Next Lesson
  backUrl: string; // URL for the Dashboard
}

export default function LessonClient({
  slides,
  nextUrl,
  backUrl,
}: LessonClientProps) {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [xpGained, setXpGained] = useState(0);
  const [showXpAnim, setShowXpAnim] = useState(false);

  const totalSlides = slides.length;

  const handleNext = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide((prev) => prev + 1);
      triggerXpFeedback();
    } else {
      router.push(nextUrl);
    }
  };

  const handleBack = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  const triggerXpFeedback = () => {
    setXpGained((prev) => prev + 5);
    setShowXpAnim(true);
    setTimeout(() => setShowXpAnim(false), 1000);
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto bg-white relative overflow-hidden font-nunito">
      {/* HEADER */}
      <header className="flex items-center gap-4 p-6 w-full z-20 bg-white/90 backdrop-blur-sm sticky top-0">
        <button
          onClick={() => router.push(backUrl)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={28} />
        </button>

        <div className="flex-1 flex gap-2 h-2">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-full rounded-full flex-1 transition-all duration-300 ${
                index <= currentSlide ? "bg-[#4854F6]" : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-1 font-bold text-orange-500 min-w-[60px] justify-end">
          <Zap size={20} fill="currentColor" />
          <span>{xpGained}</span>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 relative w-full overflow-hidden flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex-1 flex flex-col px-8 py-4 overflow-y-auto"
          >
            <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl">{slides[currentSlide].emoji}</span>
              <h2 className="text-2xl font-black text-gray-800 leading-tight">
                {slides[currentSlide].title}
              </h2>
            </div>

            <div className="prose prose-lg text-gray-600 leading-relaxed whitespace-pre-line">
              {slides[currentSlide].content}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* XP POPUP */}
      <AnimatePresence>
        {showXpAnim && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.5 }}
            animate={{ opacity: 1, y: -50, scale: 1.2 }}
            exit={{ opacity: 0 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 font-black text-4xl text-orange-500 z-50 pointer-events-none drop-shadow-sm"
          >
            +5 XP
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER */}
      <footer className="p-6 border-t border-gray-100 bg-white z-30">
        <div className="flex gap-4">
          <button
            onClick={handleBack}
            disabled={currentSlide === 0}
            className={`
              flex items-center justify-center w-16 h-14 rounded-2xl font-bold transition-all
              ${
                currentSlide === 0
                  ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                  : "bg-gray-200 text-gray-500 hover:bg-gray-300 btn-press"
              }
            `}
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={handleNext}
            className={`
              flex-1 h-14 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-all btn-press
              ${
                currentSlide === totalSlides - 1
                  ? "bg-green-500 text-white shadow-[0_4px_0_#16a34a]"
                  : "bg-[#4854F6] text-white shadow-[0_4px_0_#353EB5]"
              }
            `}
          >
            {currentSlide === totalSlides - 1 ? (
              <>
                Start Quiz <PlayCircle size={20} />
              </>
            ) : (
              <>
                Next <ChevronRight size={20} />
              </>
            )}
          </button>
        </div>
      </footer>
    </div>
  );
}
