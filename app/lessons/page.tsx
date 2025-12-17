"use client";

import { motion } from "framer-motion";
import { SignedIn } from "@clerk/nextjs";
import Link from "next/link";
import { BookOpen, Clock, CheckCircle2, Play, TrendingUp } from "lucide-react";

const subjects = [
  {
    id: 1,
    name: "Mathematics",
    description: "Algebra, Geometry, Calculus, and more",
    icon: "📐",
    color: "bg-blue-500",
    lessons: 24,
    completed: 8,
    progress: 33,
  },
  {
    id: 2,
    name: "English Language",
    description: "Grammar, Literature, Composition",
    icon: "📚",
    color: "bg-green-500",
    lessons: 18,
    completed: 12,
    progress: 67,
  },
  {
    id: 3,
    name: "Physics",
    description: "Mechanics, Thermodynamics, Optics",
    icon: "⚛️",
    color: "bg-purple-500",
    lessons: 20,
    completed: 5,
    progress: 25,
  },
  {
    id: 4,
    name: "Chemistry",
    description: "Organic, Inorganic, Physical Chemistry",
    icon: "🧪",
    color: "bg-yellow-500",
    lessons: 22,
    completed: 10,
    progress: 45,
  },
  {
    id: 5,
    name: "Biology",
    description: "Cell Biology, Genetics, Ecology",
    icon: "🔬",
    color: "bg-pink-500",
    lessons: 19,
    completed: 7,
    progress: 37,
  },
  {
    id: 6,
    name: "History",
    description: "Nigerian History, World History",
    icon: "📜",
    color: "bg-orange-500",
    lessons: 15,
    completed: 9,
    progress: 60,
  },
];

export default function Lessons() {
  return (
    <SignedIn>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Browse Lessons
            </h1>
            <p className="text-gray-600">
              Explore subjects and topics aligned with Nigerian curriculum
            </p>
          </motion.div>

          {/* Subjects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject, index) => (
              <motion.div
                key={subject.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className={`${subject.color} p-6 text-white`}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-4xl">{subject.icon}</span>
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-sm font-medium">{subject.completed}/{subject.lessons}</span>
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold mb-2">{subject.name}</h2>
                  <p className="text-white/90 text-sm">{subject.description}</p>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between text-sm mb-3">
                    <span className="text-gray-600">Progress</span>
                    <span className="text-gray-900 font-semibold">{subject.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${subject.progress}%` }}
                      transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                      className={`${subject.color} h-2 rounded-full`}
                    />
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <Clock className="w-4 h-4" />
                    <span>{subject.lessons} lessons available</span>
                  </div>
                  
                  <Link href={`/lessons/${subject.id}`}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-[#6c47ff] text-white font-semibold py-3 rounded-lg hover:bg-[#5a3ae6] transition-colors flex items-center justify-center gap-2"
                    >
                      <Play className="w-4 h-4" />
                      Start Learning
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12 bg-linear-to-r from-[#6c47ff] to-[#8b5cf6] rounded-xl p-8 text-white"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">118</div>
                <div className="text-white/80">Total Lessons</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">51</div>
                <div className="text-white/80">Completed</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">43%</div>
                <div className="text-white/80">Overall Progress</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </SignedIn>
  );
}


