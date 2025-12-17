"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Award,
  Target,
  TrendingUp,
  Clock,
  BookOpen,
  User,
  Mail,
  Calendar,
  Edit3,
  Check,
  X,
  Loader2,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase";
import { useFetcher } from "@/hook/useFetcher";

interface ProfileData {
  id: string;
  clerk_id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  class_id: string | null;
  role: "student" | "teacher" | "parent";
  created_at: string;
}

interface ProgressStats {
  totalTopics: number;
  completedTopics: number;
  overallProgress: number;
  currentStreak: number;
  totalStudyTime: number;
}

interface Class {
  id: string;
  name: string;
}

export default function Profile() {
  const { user: clerkUser } = useUser();
  const [isEditingClass, setIsEditingClass] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch user profile data
  const fetchProfile: () => Promise<ProfileData> = useCallback(async () => {
    if (!clerkUser?.id) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("clerk_id", clerkUser.id)
      .single();

    if (error) throw error;
    return data;
  }, [clerkUser?.id]);

  const { data: profile, isPending: profileLoading } = useFetcher<ProfileData>(
    fetchProfile,
    {
      enabled: !!clerkUser?.id,
    }
  );

  // Fetch progress statistics
  const fetchProgressStats: () => Promise<ProgressStats> =
    useCallback(async () => {
      if (!clerkUser?.id) throw new Error("User not authenticated");

      // Get all topics with user's progress
      const { data: progressData, error: progressError } = await supabase
        .from("student_progress")
        .select(
          `
        completed,
        last_attempt,
        topics!inner (
          id,
          title,
          subject:subject_id (name, theme)
        )
      `
        )
        .eq("user_id", clerkUser.id);

      if (progressError) throw progressError;

      const completedTopics =
        progressData?.filter((p) => p.completed).length || 0;
      const totalTopics = progressData?.length || 0;

      // Calculate streak (simplified - consecutive days with activity)
      const sortedProgress =
        progressData?.sort(
          (a, b) =>
            new Date(b.last_attempt).getTime() -
            new Date(a.last_attempt).getTime()
        ) || [];

      let streak = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      for (let i = 0; i < sortedProgress.length; i++) {
        const progressDate = new Date(sortedProgress[i].last_attempt);
        progressDate.setHours(0, 0, 0, 0);

        const daysDiff = Math.floor(
          (today.getTime() - progressDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysDiff === streak) {
          streak++;
        } else {
          break;
        }
      }

      // Estimate study time (5 minutes per completed topic)
      const totalStudyTime = completedTopics * 5;

      return {
        totalTopics,
        completedTopics,
        overallProgress:
          totalTopics > 0
            ? Math.round((completedTopics / totalTopics) * 100)
            : 0,
        currentStreak: streak,
        totalStudyTime,
      };
    }, [clerkUser?.id]);

  const { data: progressStats, isPending: statsLoading } =
    useFetcher<ProgressStats>(fetchProgressStats, {
      enabled: !!clerkUser?.id,
    });

  // Fetch available classes
  const fetchClasses: () => Promise<Class[]> = useCallback(async () => {
    const { data, error } = await supabase
      .from("classes")
      .select("id, name")
      .order("name");

    if (error) throw error;
    return data || [];
  }, []);

  const { data: classes } = useFetcher<Class[]>(fetchClasses);

  // Update user class
  const updateUserClass = async () => {
    if (!clerkUser?.id || !selectedClassId) return;

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ class_id: selectedClassId })
        .eq("clerk_id", clerkUser.id);

      if (error) throw error;

      // Refresh profile data
      window.location.reload();
    } catch (error) {
      console.error("Error updating class:", error);
    } finally {
      setIsUpdating(false);
      setIsEditingClass(false);
    }
  };

  const stats = [
    {
      label: "Total Study Time",
      value: progressStats
        ? `${Math.floor(progressStats.totalStudyTime / 60)}h ${
            progressStats.totalStudyTime % 60
          }m`
        : "0h 0m",
      icon: Clock,
      color: "bg-blue-500",
    },
    {
      label: "Lessons Completed",
      value: progressStats?.completedTopics.toString() || "0",
      icon: BookOpen,
      color: "bg-green-500",
    },
    {
      label: "Overall Progress",
      value: `${progressStats?.overallProgress || 0}%`,
      icon: TrendingUp,
      color: "bg-purple-500",
    },
    {
      label: "Current Streak",
      value: `${progressStats?.currentStreak || 0} days`,
      icon: Target,
      color: "bg-yellow-500",
    },
  ];

  if (profileLoading || statsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#6c47ff]" />
      </div>
    );
  }

  return (
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
            <Link href="/auth/dashboard">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-[#6c47ff] text-white rounded-lg hover:bg-[#5a3ae6] transition-colors shadow-sm"
              >
                Back to Dashboard
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-6 mb-8"
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-24 h-24 bg-linear-to-br from-[#6c47ff] to-[#8b5cf6] rounded-full flex items-center justify-center text-4xl font-bold text-white overflow-hidden">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                profile?.full_name?.charAt(0)?.toUpperCase() || "U"
              )}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {profile?.full_name || "Student"}
              </h2>
              <div className="flex items-center gap-2 text-gray-600 mb-4 justify-center sm:justify-start">
                <Mail className="w-4 h-4" />
                <span>{profile?.email}</span>
              </div>

              {/* Class Selection */}
              <div className="mb-4">
                {isEditingClass ? (
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedClassId}
                      onChange={(e) => setSelectedClassId(e.target.value)}
                      className="px-3 py-1 border border-black rounded-lg text-sm"
                    >
                      <option value="">Select Class</option>
                      {classes?.map((cls) => (
                        <option key={cls.id} value={cls.id}>
                          {cls.name}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={updateUserClass}
                      disabled={isUpdating || !selectedClassId}
                      className="p-1 text-green-600 hover:text-green-700 disabled:opacity-50"
                    >
                      {isUpdating ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => setIsEditingClass(false)}
                      className="p-1 text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <span className="text-gray-600">Class:</span>
                    <span className="font-medium">
                      {classes?.find((c) => c.id === profile?.class_id)?.name ||
                        "Not set"}
                    </span>
                    <button
                      onClick={() => {
                        setIsEditingClass(true);
                        setSelectedClassId(profile?.class_id || "");
                      }}
                      className="p-1 text-[#6c47ff] hover:text-[#5a3ae6]"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#6c47ff]">
                    {progressStats?.overallProgress || 0}%
                  </div>
                  <div className="text-sm text-gray-600">Overall Progress</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#6c47ff]">
                    {progressStats?.currentStreak || 0}
                  </div>
                  <div className="text-sm text-gray-600">Day Streak</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#6c47ff]">
                    {progressStats?.completedTopics || 0}
                  </div>
                  <div className="text-sm text-gray-600">Topics Completed</div>
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
              <div
                className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center mb-4`}
              >
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Recent Activity Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-6 h-6 text-[#6c47ff]" />
            <h2 className="text-2xl font-semibold text-gray-900">
              Recent Activity
            </h2>
          </div>
          <div className="space-y-4">
            {progressStats && progressStats.completedTopics > 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Activity tracking coming soon!</p>
                <p className="text-sm">
                  Keep learning to unlock detailed activity insights.
                </p>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No activity yet</p>
                <p className="text-sm">
                  Start completing lessons to track your learning journey!
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
