"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { use } from "react";
import { ArrowLeft, Play, CheckCircle2, Clock, BookOpen } from "lucide-react";

const lessonData: Record<
  number,
  {
    name: string;
    lessons: Array<{
      id: number;
      title: string;
      duration: string;
      completed: boolean;
    }>;
  }
> = {
  1: {
    name: "Mathematics",
    lessons: [
      {
        id: 1,
        title: "Introduction to Algebra",
        duration: "15 min",
        completed: true,
      },
      { id: 2, title: "Linear Equations", duration: "20 min", completed: true },
      {
        id: 3,
        title: "Quadratic Equations",
        duration: "25 min",
        completed: false,
      },
      { id: 4, title: "Polynomials", duration: "18 min", completed: false },
      { id: 5, title: "Factoring", duration: "22 min", completed: false },
    ],
  },
  2: {
    name: "English Language",
    lessons: [
      { id: 1, title: "Parts of Speech", duration: "12 min", completed: true },
      {
        id: 2,
        title: "Sentence Structure",
        duration: "16 min",
        completed: true,
      },
      { id: 3, title: "Tenses", duration: "20 min", completed: false },
    ],
  },
};

export default function LessonDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const subjectId = parseInt(id);
  const subject = lessonData[subjectId] || lessonData[1];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link href="/auth/lessons">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Lessons
            </motion.button>
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            {subject.name}
          </h1>
          <p className="text-gray-600">
            {subject.lessons.length} lessons available
          </p>
        </motion.div>

        {/* Lessons List */}
        <div className="space-y-4">
          {subject.lessons.map((lesson, index) => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      lesson.completed ? "bg-green-500" : "bg-[#6c47ff]"
                    }`}
                  >
                    {lesson.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    ) : (
                      <BookOpen className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {lesson.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{lesson.duration}</span>
                      </div>
                      {lesson.completed && (
                        <span className="text-green-600 font-medium">
                          Completed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <Link href="/session">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                      lesson.completed
                        ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        : "bg-[#6c47ff] text-white hover:bg-[#5a3ae6]"
                    }`}
                  >
                    {lesson.completed ? "Review" : "Start"}
                    <Play className="w-4 h-4" />
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
