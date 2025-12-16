"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  GraduationCap,
} from "lucide-react";

interface Course {
  id: string;
  title: string;
  grade: number;
}

interface AddCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Extended Dummy Data
const dummyCourses: Course[] = [
  // Grade 1
  { id: "g1-math", title: "Mathematics", grade: 1 },
  { id: "g1-eng", title: "English Language", grade: 1 },
  { id: "g1-sci", title: "Basic Science", grade: 1 },

  // Generating logic for other grades...
  ...[...Array(11)].flatMap((_, i) => {
    const grade = i + 2;
    const courses = [
      { id: `g${grade}-math`, title: "Mathematics", grade: grade },
      { id: `g${grade}-eng`, title: "English Language", grade: grade },
      { id: `g${grade}-geo`, title: "Geography", grade: grade },
      { id: `g${grade}-bst`, title: "Basic Science & Tech", grade: grade },
    ];
    if (grade > 6) {
      courses.push({ id: `g${grade}-phy`, title: "Physics", grade: grade });
      courses.push({ id: `g${grade}-chem`, title: "Chemistry", grade: grade });
    }
    return courses;
  }),
];

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 20 : -20,
    opacity: 0,
    scale: 0.95,
    filter: "blur(4px)",
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 20 : -20,
    opacity: 0,
    scale: 0.95,
    filter: "blur(4px)",
  }),
};

export function AddCourseModal({ isOpen, onClose }: AddCourseModalProps) {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);

  const coursesForSelectedGrade = dummyCourses.filter(
    (c) => c.grade === selectedGrade
  );

  const handleNext = () => {
    if (selectedGrade === null) return;
    setDirection(1);
    setStep(2);
  };

  const handleBack = () => {
    setDirection(-1);
    setStep(1);
  };

  const handleSelectCourse = (courseId: string) => {
    setSelectedCourses((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleSave = () => {
    // Logic to save courses would go here
    console.log("Saving:", { grade: selectedGrade, courses: selectedCourses });
    handleClose();
  };

  const handleClose = () => {
    // Small timeout to allow exit animation if needed,
    // but Dialog controls unmount, so we just reset state.
    setStep(1);
    setSelectedGrade(null);
    setSelectedCourses([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      {/* Custom global styles for this component's 3D elements */}
      <style jsx global>{`
        .btn-pressable {
          transition: all 0.1s cubic-bezier(0.4, 0, 0.2, 1);
          transform: translateY(0);
          border-bottom-width: 4px;
        }
        .btn-pressable:active {
          transform: translateY(2px);
          border-bottom-width: 2px !important;
          margin-top: 2px;
          margin-bottom: -2px;
          filter: brightness(0.95);
        }
      `}</style>

      <DialogContent className="sm:max-w-[600px] bg-white rounded-3xl border-0 shadow-2xl p-0 overflow-hidden font-sans">
        {/* Animated Wrapper for the entire modal content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="flex flex-col h-full"
        >
          {/* Header Strip */}
          <div className="bg-gray-50 border-b-2 border-gray-100 p-6 flex items-center gap-3">
            <div className="w-12 h-12 bg-[#4854F6] rounded-full flex items-center justify-center text-white shadow-[0_4px_0_#353EB5]">
              {step === 1 ? (
                <GraduationCap size={20} />
              ) : (
                <BookOpen size={20} />
              )}
            </div>
            <div>
              <DialogTitle className="text-xl font-black text-gray-700">
                {step === 1
                  ? "Pick your Level"
                  : `Grade ${selectedGrade} Subjects`}
              </DialogTitle>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">
                Step {step} of 2
              </p>
            </div>
          </div>

          <div className="p-6 min-h-100 flex flex-col relative">
            <AnimatePresence initial={false} mode="wait" custom={direction}>
              {step === 1 && (
                <motion.div
                  key="step1"
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="flex-1"
                >
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(
                      (grade) => {
                        const isSelected = selectedGrade === grade;
                        return (
                          <button
                            key={grade}
                            onClick={() => setSelectedGrade(grade)}
                            className={`
                                        btn-pressable h-24 rounded-2xl flex flex-col items-center justify-center gap-1 border-2
                                        ${
                                          isSelected
                                            ? "bg-[#4854F6] border-[#353EB5] border-b-4 text-white"
                                            : "bg-white border-gray-200 border-b-4 text-gray-500 hover:bg-gray-50 hover:border-gray-300"
                                        }
                                    `}
                          >
                            <span
                              className={`text-2xl font-black ${
                                isSelected ? "text-white" : "text-gray-700"
                              }`}
                            >
                              {grade}
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                              Grade
                            </span>
                          </button>
                        );
                      }
                    )}
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="flex-1 flex flex-col"
                >
                  <div className="flex-1 overflow-y-auto pr-2 max-h-[300px] space-y-3">
                    {coursesForSelectedGrade.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <p className="font-bold">
                          No courses found for this grade.
                        </p>
                      </div>
                    ) : (
                      coursesForSelectedGrade.map((course) => {
                        const isSelected = selectedCourses.includes(course.id);
                        return (
                          <div
                            key={course.id}
                            onClick={() => handleSelectCourse(course.id)}
                            className={`
                                            btn-pressable cursor-pointer p-4 rounded-2xl border-2 flex items-center justify-between group
                                            ${
                                              isSelected
                                                ? "bg-[#EEF2FF] border-[#4854F6] border-b-4"
                                                : "bg-white border-gray-200 border-b-4 hover:bg-gray-50"
                                            }
                                        `}
                          >
                            <span
                              className={`font-bold text-lg ${
                                isSelected ? "text-[#4854F6]" : "text-gray-600"
                              }`}
                            >
                              {course.title}
                            </span>

                            {/* Custom Checkbox UI */}
                            <div
                              className={`
                                            w-8 h-8 rounded-xl flex items-center justify-center border-2 transition-all
                                            ${
                                              isSelected
                                                ? "bg-[#4854F6] border-[#4854F6] text-white"
                                                : "bg-transparent border-gray-300 text-transparent"
                                            }
                                        `}
                            >
                              <Check size={20} strokeWidth={4} />
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer Navigation */}
          <DialogFooter className="p-6 bg-gray-50 border-t-2 border-gray-100 flex items-center justify-between gap-4">
            {step === 2 ? (
              <button
                onClick={handleBack}
                className="btn-pressable px-6 py-3 rounded-2xl font-extrabold text-gray-500 bg-white border-2 border-gray-200 border-b-4 hover:bg-gray-100 uppercase tracking-wider text-sm flex items-center gap-2"
              >
                <ChevronLeft size={18} strokeWidth={3} /> Back
              </button>
            ) : (
              // Empty div to maintain spacing when Back button is hidden
              <div />
            )}

            {step === 1 ? (
              <button
                onClick={handleNext}
                disabled={selectedGrade === null}
                className={`
                            btn-pressable px-8 py-3 rounded-2xl font-extrabold uppercase tracking-wider text-sm flex items-center gap-2
                            ${
                              selectedGrade !== null
                                ? "bg-[#4854F6] text-white border-[#353EB5] border-b-4 shadow-sm"
                                : "bg-gray-200 text-gray-400 border-gray-300 border-b-4 cursor-not-allowed"
                            }
                        `}
              >
                Next <ChevronRight size={18} strokeWidth={3} />
              </button>
            ) : (
              <button
                onClick={handleSave}
                disabled={selectedCourses.length === 0}
                className={`
                            btn-pressable px-8 py-3 rounded-2xl font-extrabold uppercase tracking-wider text-sm w-full sm:w-auto
                            ${
                              selectedCourses.length > 0
                                ? "bg-[#4854F6] text-white border-[#353EB5] border-b-4 shadow-sm"
                                : "bg-gray-200 text-gray-400 border-gray-300 border-b-4 cursor-not-allowed"
                            }
                        `}
              >
                Start Learning
              </button>
            )}
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
