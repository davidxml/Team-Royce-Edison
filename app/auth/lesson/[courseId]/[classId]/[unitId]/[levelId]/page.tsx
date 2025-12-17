"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Mic, 
  HelpCircle, 
  Zap, 
  MessageCircle,
  PlayCircle
} from "lucide-react";

// --- MOCK DATA: Lesson Slides ---
//  fetch this later based on params.levelId
const lessonSlides = [
  {
    id: 1,
    type: "intro",
    title: "Introduction to Number Bases",
    content: "We count in Base 10 every day because we have 10 fingers. But computers only have 'switches' (on/off), so they count in Base 2 (Binary).",
    emoji: "🖐️",
  },
  {
    id: 2,
    type: "concept",
    title: "What is a 'Base'?",
    content: "A 'Base' tells you how many digits you can use before you have to add a new column. \n\n• Base 10: 0-9 \n• Base 2: 0-1 \n• Base 8: 0-7",
    emoji: "🧮",
  },
  {
    id: 3,
    type: "example",
    title: "Let's look at Base 2",
    content: "In Base 2 (Binary), the number '5' is written as '101'. \n\n1 (fours place) \n0 (twos place) \n1 (ones place) \n\n4 + 0 + 1 = 5!",
    emoji: "💡",
  },
  {
    id: 4,
    type: "summary",
    title: "Quick Recap",
    content: "• Base 10 is for humans.\n• Base 2 is for computers.\n• Next, we will test your knowledge on converting them.",
    emoji: "📝",
  },
];

export default function LevelPage({
  params,
}: {
  params: { courseId: string; unitId: string; levelId: string };
}) {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [xpGained, setXpGained] = useState(0);
  const [showXpAnim, setShowXpAnim] = useState(false);

  const totalSlides = lessonSlides.length;
  const progressPercentage = ((currentSlide + 1) / totalSlides) * 100;

  const handleNext = () => {
    if (currentSlide < totalSlides - 1) {
      // 1. Move to next slide
      setCurrentSlide((prev) => prev + 1);
      
      // 2. Trigger XP Animation
      triggerXpFeedback();
    } else {
      // 3. Last slide? Go to Quiz
      router.push(`./${params.levelId}/quiz`);
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
    setTimeout(() => setShowXpAnim(false), 1000); // Hide after 1s
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto bg-white relative overflow-hidden">
      
      {/* --- HEADER: Progress & Exit --- */}
      <header className="flex items-center gap-4 p-6 w-full z-20 bg-white/90 backdrop-blur-sm sticky top-0">
        <button 
          onClick={() => router.back()} 
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={28} />
        </button>
        
        {/* Segmented Progress Bar */}
        <div className="flex-1 flex gap-2 h-2">
          {lessonSlides.map((_, index) => (
            <div 
              key={index}
              className={`h-full rounded-full flex-1 transition-all duration-300 ${
                index <= currentSlide ? "bg-[#4854F6]" : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        {/* Live XP Counter */}
        <div className="flex items-center gap-1 font-bold text-orange-500 min-w-[60px] justify-end">
          <Zap size={20} fill="currentColor" />
          <span>{xpGained}</span>
        </div>
      </header>

      {/* --- CONTENT AREA (Slides) --- */}
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
            {/* Slide Header */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl">{lessonSlides[currentSlide].emoji}</span>
              <h2 className="text-2xl font-black text-gray-800 leading-tight">
                {lessonSlides[currentSlide].title}
              </h2>
            </div>

            {/* Slide Body */}
            <div className="prose prose-lg text-gray-600 leading-relaxed whitespace-pre-line">
               {lessonSlides[currentSlide].content}
            </div>

            {/* Visual Decoration (Optional Placeholder for Diagram) */}
            <div className="mt-8 p-8 bg-blue-50 border-2 border-dashed border-blue-200 rounded-xl flex items-center justify-center text-blue-400 font-bold">
               [ Interactive Diagram / Image ]
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* --- XP POPUP ANIMATION --- */}
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

      {/* --- FLOATING ACTION BUTTONS (FABs) --- */}
      <div className="absolute bottom-28 right-6 flex flex-col gap-4 z-40">
        {/* Ask Question FAB */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-14 h-14 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center text-gray-600 shadow-lg hover:shadow-xl hover:border-[#4854F6] hover:text-[#4854F6] transition-colors"
          title="Ask AI a Question"
        >
          <MessageCircle size={24} />
        </motion.button>

        {/* Live Discussion FAB */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-14 h-14 bg-[#4854F6] rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-200 hover:bg-blue-600 transition-colors"
          title="Join Live Discussion"
        >
          <Mic size={24} />
          {/* pulsating ring for 'live' effect */}
          <span className="absolute w-full h-full rounded-full border-2 border-white animate-ping opacity-20"></span>
        </motion.button>
      </div>

      {/* --- FOOTER: Navigation --- */}
      <footer className="p-6 border-t border-gray-100 bg-white z-30">
        <div className="flex gap-4">
          
          {/* Back Button (Hidden on first slide) */}
          <button
            onClick={handleBack}
            disabled={currentSlide === 0}
            className={`
              flex items-center justify-center w-16 h-14 rounded-2xl font-bold transition-all
              ${currentSlide === 0 
                ? "bg-gray-100 text-gray-300 cursor-not-allowed" 
                : "bg-gray-200 text-gray-500 hover:bg-gray-300 btn-press"}
            `}
          >
            <ChevronLeft size={24} />
          </button>

          {/* Next / Finish Button */}
          <button
            onClick={handleNext}
            className={`
              flex-1 h-14 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-all btn-press
              ${currentSlide === totalSlides - 1 
                ? "bg-green-500 text-white shadow-[0_4px_0_#16a34a]" // Finish Style
                : "bg-[#4854F6] text-white shadow-[0_4px_0_#353EB5]"} // Next Style
            `}
          >
            {currentSlide === totalSlides - 1 ? (
              <>Start Quiz <PlayCircle size={20} /></>
            ) : (
              <>Next <ChevronRight size={20} /></>
            )}
          </button>
        </div>
      </footer>

    </div>
  );
}