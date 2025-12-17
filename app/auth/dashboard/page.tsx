"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  BookOpen,
  Clock,
  TrendingUp,
  Play,
  BookMarked,
  Award,
  Target,
} from "lucide-react";

export default function Dashboard() {

  return (
    
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Welcome Back!
            </h1>
            <p className="text-gray-600">
              Continue your learning journey with personalized AI tutoring
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              {
                icon: BookOpen,
                label: "Lessons Completed",
                value: "12",
                color: "bg-blue-500",
              },
              {
                icon: Clock,
                label: "Study Time",
                value: "24h",
                color: "bg-green-500",
              },
              {
                icon: TrendingUp,
                label: "Progress",
                value: "85%",
                color: "bg-purple-500",
              },
              {
                icon: Award,
                label: "Achievements",
                value: "8",
                color: "bg-yellow-500",
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}
                  >
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link href="/auth/session">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-linear-to-br from-[#6c47ff] to-[#8b5cf6] text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                >
                  <Play className="w-8 h-8 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    Start New Session
                  </h3>
                  <p className="text-white/80">
                    Begin a personalized tutoring session
                  </p>
                </motion.div>
              </Link>

              <Link href="/auth/lessons">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer border-2 border-gray-100"
                >
                  <BookMarked className="w-8 h-8 mb-4 text-[#6c47ff]" />
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">
                    Browse Lessons
                  </h3>
                  <p className="text-gray-600">
                    Explore available subjects and topics
                  </p>
                </motion.div>
              </Link>

              <Link href="/auth/profile">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer border-2 border-gray-100"
                >
                  <Target className="w-8 h-8 mb-4 text-[#6c47ff]" />
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">
                    View Progress
                  </h3>
                  <p className="text-gray-600">Track your learning journey</p>
                </motion.div>
              </Link>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Recent Activity
            </h2>
            <div className="space-y-4">
              {[
                {
                  subject: "Mathematics",
                  topic: "Algebra Basics",
                  date: "2 hours ago",
                  progress: 75,
                },
                {
                  subject: "English",
                  topic: "Grammar Review",
                  date: "Yesterday",
                  progress: 100,
                },
                {
                  subject: "Physics",
                  topic: "Mechanics",
                  date: "2 days ago",
                  progress: 50,
                },
              ].map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-[#6c47ff] rounded-lg flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {activity.subject}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {activity.topic}
                        </p>
                      </div>
                    </div>
                    <div className="ml-13">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Progress</span>
                        <span className="text-gray-900 font-medium">
                          {activity.progress}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${activity.progress}%` }}
                          transition={{
                            duration: 0.5,
                            delay: 0.8 + index * 0.1,
                          }}
                          className="bg-[#6c47ff] h-2 rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 ml-4">
                    {activity.date}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
  );
}
