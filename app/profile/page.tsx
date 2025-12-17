"use client";

import { motion } from "framer-motion";
import { SignedIn } from "@clerk/nextjs";
import { Award, Target, TrendingUp, Clock, BookOpen, Settings } from "lucide-react";

const achievements = [
  { id: 1, name: "First Steps", description: "Complete your first lesson", icon: "🎯", unlocked: true },
  { id: 2, name: "Week Warrior", description: "Study for 7 days straight", icon: "🔥", unlocked: true },
  { id: 3, name: "Math Master", description: "Complete all math lessons", icon: "📐", unlocked: false },
  { id: 4, name: "Speed Learner", description: "Complete 10 lessons in a day", icon: "⚡", unlocked: false },
  { id: 5, name: "Perfect Score", description: "Get 100% on 5 quizzes", icon: "💯", unlocked: true },
  { id: 6, name: "Night Owl", description: "Study after 10 PM", icon: "🦉", unlocked: false },
];

const stats = [
  { label: "Total Study Time", value: "124 hours", icon: Clock, color: "bg-blue-500" },
  { label: "Lessons Completed", value: "51", icon: BookOpen, color: "bg-green-500" },
  { label: "Average Score", value: "87%", icon: TrendingUp, color: "bg-purple-500" },
  { label: "Current Streak", value: "12 days", icon: Target, color: "bg-yellow-500" },
];

export default function Profile() {
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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                  Your Profile
                </h1>
                <p className="text-gray-600">
                  Track your progress and achievements
                </p>
              </div>
            </div>
          </motion.div>

          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-6 mb-8"
          >
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="w-24 h-24 bg-linear-to-br from-[#6c47ff] to-[#8b5cf6] rounded-full flex items-center justify-center text-4xl font-bold text-white">
                JD
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">John Doe</h2>
                <p className="text-gray-600 mb-4">Student • Grade 10</p>
                <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#6c47ff]">43%</div>
                    <div className="text-sm text-gray-600">Overall Progress</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#6c47ff]">12</div>
                    <div className="text-sm text-gray-600">Day Streak</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#6c47ff]">3</div>
                    <div className="text-sm text-gray-600">Achievements</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center mb-4`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-6 h-6 text-[#6c47ff]" />
              <h2 className="text-2xl font-semibold text-gray-900">Achievements</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className={`p-4 rounded-lg border-2 ${
                    achievement.unlocked
                      ? "bg-linear-to-br from-[#6c47ff]/10 to-[#8b5cf6]/10 border-[#6c47ff]"
                      : "bg-gray-50 border-gray-200 opacity-60"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{achievement.icon}</span>
                    <div className="flex-1">
                      <h3 className={`font-semibold ${achievement.unlocked ? "text-gray-900" : "text-gray-500"}`}>
                        {achievement.name}
                      </h3>
                      <p className={`text-sm ${achievement.unlocked ? "text-gray-600" : "text-gray-400"}`}>
                        {achievement.description}
                      </p>
                    </div>
                    {achievement.unlocked && (
                      <div className="w-6 h-6 bg-[#6c47ff] rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Progress Chart Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8 bg-white rounded-xl shadow-sm p-6"
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Learning Progress</h2>
            <div className="space-y-4">
              {[
                { subject: "Mathematics", progress: 33, color: "bg-blue-500" },
                { subject: "English", progress: 67, color: "bg-green-500" },
                { subject: "Physics", progress: 25, color: "bg-purple-500" },
                { subject: "Chemistry", progress: 45, color: "bg-yellow-500" },
              ].map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-900 font-medium">{item.subject}</span>
                    <span className="text-gray-600">{item.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.progress}%` }}
                      transition={{ duration: 0.8, delay: 0.9 + index * 0.1 }}
                      className={`${item.color} h-3 rounded-full`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </SignedIn>
  );
}


