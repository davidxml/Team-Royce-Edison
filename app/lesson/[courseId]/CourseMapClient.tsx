"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Book, Star, Lock, Check, Trophy } from "lucide-react";
import { LESSON_ROUTES } from "@/constants/routes";

// Level Types
type Level = {
  id: string;
  order_index: number;
  status: "locked" | "active" | "completed" | "current";
  stars: number;
};

type Unit = {
  id: string;
  title: string;
  description: string;
  color_theme: string;
  levels: Level[];
};

export default function CourseMapClient({ units, courseId }: { units: Unit[], courseId: string }) {
  
  // Helper to resolve Tailwind colors dynamically
  const getColor = (theme: string) => {
    return theme || "bg-[#4854F6]"; 
  };

  return (
    <div className="min-h-screen bg-white text-gray-700 pb-24">
      {/* ... (Keep your Header/Sidebar logic here or passed in layout) ... */}

      <div className="max-w-2xl mx-auto px-4 pt-6 space-y-4">
        {units.map((unit) => (
          <div key={unit.id} className="relative pb-10">
            
            {/* Unit Header */}
            <div className={`sticky top-28 z-20 ${getColor(unit.color_theme)} text-white rounded-2xl p-4 mb-12 flex justify-between items-center shadow-lg mx-2`}>
              <div>
                <h3 className="font-bold text-lg opacity-90">{unit.title}</h3>
                <p className="text-sm font-medium opacity-75">{unit.description}</p>
              </div>
            </div>

            {/* The Snake Path */}
            <div className="flex flex-col items-center gap-6 relative">
              {unit.levels.map((level, index) => {
                // Snake Logic
                const offsetClass =
                  index % 4 === 1 ? "-translate-x-12" : 
                  index % 4 === 2 ? "-translate-x-12" : 
                  index % 4 === 3 ? "translate-x-12" : 
                  (index % 4 === 0 && index !== 0) ? "translate-x-12" : "";

                return (
                   <motion.div
                      key={level.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      className={`transform ${offsetClass} relative group`}
                   >
                     {/* "START" Bubble */}
                     {level.status === "current" && (
                       <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-gray-700 font-bold py-1 px-3 rounded-xl border-2 border-gray-200 shadow-sm animate-bounce z-10">
                         START
                       </div>
                     )}

                    <Link href={LESSON_ROUTES.forLevel(courseId, unit.id, level.id)}>
                       <button
                         disabled={level.status === "locked"}
                         className={`
                           w-20 h-20 rounded-full flex items-center justify-center relative transition-all duration-200 border-b-4 active:border-b-0 active:translate-y-1
                           ${level.status === "completed" ? "bg-[#FFC800] border-[#E5B400] text-white" : 
                             level.status === "current" ? "bg-[#4854F6] border-[#353EB5] text-white" : 
                             "bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed"}
                         `}
                       >
                         {level.status === "locked" ? <Lock size={24} opacity={0.5} /> : 
                          level.status === "completed" ? <Check size={28} strokeWidth={4} /> : 
                          <Star size={24} fill="currentColor" />}
                       </button>
                     </Link>
                   </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}