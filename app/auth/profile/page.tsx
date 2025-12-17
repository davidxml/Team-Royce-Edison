"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Nunito } from "next/font/google"; // 1. Import Font
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
  Zap,
  Flame,
  Shield,
  Trophy,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase";
import { useFetcher } from "@/hook/useFetcher";

// 2. Initialize Edison Font
const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

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
      label: "Study Time",
      value: progressStats
        ? `${Math.floor(progressStats.totalStudyTime / 60)}h ${
            progressStats.totalStudyTime % 60
          }m`
        : "0h 0m",
      icon: Clock,
      color: "text-blue-500",
      bg: "bg-blue-100",
      border: "border-blue-200",
    },
    {
      label: "Lessons Done",
      value: progressStats?.completedTopics.toString() || "0",
      icon: BookOpen,
      color: "text-green-500",
      bg: "bg-green-100",
      border: "border-green-200",
    },
    {
      label: "Progress",
      value: `${progressStats?.overallProgress || 0}%`,
      icon: TrendingUp,
      color: "text-purple-500",
      bg: "bg-purple-100",
      border: "border-purple-200",
    },
    {
      label: "Streak",
      value: `${progressStats?.currentStreak || 0} days`,
      icon: Flame,
      color: "text-orange-500",
      bg: "bg-orange-100",
      border: "border-orange-200",
    },
  ];

  if (profileLoading || statsLoading) {
    return (
      <div
        className={`min-h-screen bg-white flex items-center justify-center ${nunito.className}`}
      >
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-[#4854F6]" />
          <p className="text-gray-400 font-bold text-lg">Loading Profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-white text-gray-700 ${nunito.className}`}>
      {/* 3D Button Styles */}
      <style jsx global>{`
        .btn-press {
          transition: all 0.1s;
          border-bottom-width: 4px;
        }
        .btn-press:active {
          transform: translateY(2px);
          border-bottom-width: 0px;
          margin-bottom: 4px;
        }
      `}</style>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gray-100 rounded-2xl border-2 border-gray-200">
              <Shield className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-800">My Profile</h1>
              <p className="text-gray-400 font-bold text-sm">
                Student Stats & Settings
              </p>
            </div>
          </div>

          <Link href="/auth/dashboard">
            <button className="px-6 py-3 rounded-xl font-black uppercase tracking-widest text-sm bg-gray-100 text-gray-400 border-b-4 border-gray-200 btn-press hover:bg-gray-200">
              BACK TO DASHBOARD
            </button>
          </Link>
        </motion.div>

        {/* Profile Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border-2 border-gray-200 p-8 mb-8 shadow-sm relative overflow-hidden"
        >
          {/* Background Decor */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50" />

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 relative z-10">
            {/* Avatar */}
            <div className="w-32 h-32 rounded-3xl border-4 border-white shadow-lg overflow-hidden bg-[#4854F6] flex items-center justify-center text-5xl font-black text-white">
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

            {/* Info */}
            <div className="flex-1 text-center sm:text-left space-y-2">
              <h2 className="text-3xl font-black text-gray-800">
                {profile?.full_name || "Student"}
              </h2>

              <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-400 font-bold">
                <Mail className="w-4 h-4" />
                <span>{profile?.email}</span>
              </div>

              {/* Class Selection UI */}
              <div className="pt-2">
                {isEditingClass ? (
                  <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl border-2 border-gray-200 w-fit mx-auto sm:mx-0">
                    <select
                      value={selectedClassId}
                      onChange={(e) => setSelectedClassId(e.target.value)}
                      className="bg-transparent font-bold text-gray-700 outline-none text-sm"
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
                      className="p-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      {isUpdating ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => setIsEditingClass(false)}
                      className="p-1.5 bg-red-100 text-red-500 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center sm:justify-start gap-3">
                    <div className="px-4 py-2 bg-blue-50 text-[#4854F6] font-black rounded-xl text-sm border-2 border-blue-100">
                      {classes?.find((c) => c.id === profile?.class_id)?.name ||
                        "No Class Set"}
                    </div>
                    <button
                      onClick={() => {
                        setIsEditingClass(true);
                        setSelectedClassId(profile?.class_id || "");
                      }}
                      className="p-2 text-gray-400 hover:text-[#4854F6] hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mini Summary Right Side (Desktop) */}
            <div className="hidden lg:flex gap-4">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-yellow-400 border-b-4 border-yellow-500 flex items-center justify-center mx-auto mb-2">
                  <Trophy className="w-8 h-8 text-white" fill="currentColor" />
                </div>
                <p className="font-black text-gray-700 text-xl">
                  {progressStats?.currentStreak || 0}
                </p>
                <p className="text-xs font-bold text-gray-400 uppercase">
                  Streak
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#4854F6] border-b-4 border-[#353EB5] flex items-center justify-center mx-auto mb-2">
                  <Zap className="w-8 h-8 text-white" fill="currentColor" />
                </div>
                <p className="font-black text-gray-700 text-xl">
                  {progressStats?.totalStudyTime || 0}
                </p>
                <p className="text-xs font-bold text-gray-400 uppercase">XP</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-2xl p-4 border-2 ${stat.border} ${stat.bg} flex items-center gap-4`}
            >
              <div className="p-3 bg-white rounded-xl shadow-sm">
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <div className={`text-2xl font-black ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wide opacity-70">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recent Activity Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl border-2 border-gray-200 p-8"
        >
          <div className="flex items-center gap-3 mb-8">
            <Calendar className="w-6 h-6 text-gray-400" />
            <h2 className="text-xl font-black text-gray-700">
              Recent Activity
            </h2>
          </div>

          <div className="space-y-4">
            {progressStats && progressStats.completedTopics > 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                <Clock className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="font-bold text-gray-500 text-lg">
                  Detailed history coming soon!
                </p>
                <p className="text-sm text-gray-400 font-medium mt-1">
                  We are tracking your progress in the background.
                </p>
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                <Target className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="font-bold text-gray-500 text-lg">
                  No activity yet
                </p>
                <p className="text-sm text-gray-400 font-medium mt-1">
                  Complete your first lesson to see stats here!
                </p>

                <Link href="/auth/dashboard">
                  <button className="mt-6 px-6 py-3 bg-[#4854F6] text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-200 hover:bg-blue-600 transition-colors">
                    Start Learning
                  </button>
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
