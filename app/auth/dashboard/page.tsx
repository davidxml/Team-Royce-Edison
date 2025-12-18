"use client";

import React, { useCallback, useState } from "react";
import { SignedIn, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Nunito } from "next/font/google";
import Image from "next/image";
import {
  BookOpen,
  Brain,
  Zap,
  Flame,
  Target,
  Clock,
  ChevronRight,
  Star,
  Bell,
  Gift,
} from "lucide-react";
import { AddCourseModal } from "@/components/modals/add-course-modal";
import { supabase } from "@/lib/supabase";
import { useProfile } from "@/hook/useProfile";
import { useFetcher } from "@/hook/useFetcher";
import { ClassSubjectResponse } from "@/types/classSubjects";
import { ThemeColor } from "@/types/theme";
import { redirect } from "next/navigation";
import { colors, getBgColor, getColorClass } from "@/lib/colors";

// Optimize Font Loading
const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

// 2. Define the structure of a Course
interface Course {
  id: number;
  title: string;
  level: string;
  progress: number;
  theme: ThemeColor; // Apply the specific color type here
  icon: React.ReactNode;
  nextLesson: string;
}

// 3. Define the structure of a Recommendation
interface Recommendation {
  id: number;
  type: "weakness" | "streak";
  text: string;
  action: string;
  theme: ThemeColor; // Apply the specific color type here
  icon: React.ReactNode;
}

export default function Dashboard() {
  const { user } = useUser();
  const { profile, loading: profileLoading } = useProfile();
  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);

  // Mock User Data
  const userData = {
    streak: 12,
    xp: 450,
    league: "Sapphire",
    leagueRank: 4,
    avatar: user?.firstName?.charAt(0) || "S",
  };

  const fetchSubjects: () => Promise<ClassSubjectResponse> =
    useCallback(async () => {
      const { data, error } = await supabase
        .from("class_subjects")
        .select(
          `
        id,
        class:class_id (
          id,
          name,
          order_no
        ),
        subject:subject_id (
          id,
          name,
          category,
          description,
          image,
          theme,
          created_at
        )
      `
        )
        .eq("class_id", profile?.class_id);

      if (error) {
        throw error;
      }
      return data as unknown as ClassSubjectResponse;
    }, [profile?.class_id]);

  const { data, isPending, error } = useFetcher<ClassSubjectResponse>(
    fetchSubjects,
    {
      enabled: !!profile?.class_id,
    }
  );

  // Error handling
  if (error) {
    return (
      <SignedIn>
        <div
          className={`min-h-screen bg-gray-50 text-gray-700 ${nunito.className} flex items-center justify-center`}
        >
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen size={32} className="text-red-500" />
            </div>
            <h2 className="text-2xl font-black text-gray-700 mb-2">
              Oops! Something went wrong
            </h2>
            <p className="text-gray-500 mb-6">{error.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-[#4854F6] text-white font-bold rounded-xl hover:bg-[#3a45d1] transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </SignedIn>
    );
  }

  // AI Recommendations (Typed)
  const aiRecommendations: Recommendation[] = [
    {
      id: 1,
      type: "weakness",
      text: "You missed 3 questions on 'Fractions'.",
      action: "REVIEW",
      theme: "red",
      icon: <Target size={24} className="text-white" />,
    },
    {
      id: 2,
      type: "streak",
      text: "Keep your 12-day streak alive!",
      action: "PRACTICE",
      theme: "yellow",
      icon: <Flame size={24} className="text-white" />,
    },
  ];

  return (
    <SignedIn>
      <AddCourseModal
        isOpen={isAddCourseModalOpen}
        onClose={() => setIsAddCourseModalOpen(false)}
      />
      <div
        className={`min-h-screen bg-gray-50 text-gray-700 ${nunito.className}`}
      >
        {/* Custom CSS for 3D Effects */}
        <style jsx global>{`
          /* The "Pressable" 3D Effect */
          .btn-3d {
            transition: all 0.1s;
            transform: translateY(0);
            border-bottom-width: 5px !important;
          }
          .btn-3d:active {
            transform: translateY(1px);
            border-bottom-width: 0px !important;
            margin-top: 4px;
          }

          .card-3d {
            border-bottom-width: 4px;
            transition: all 0.2s;
          }
          .card-3d:hover {
            transform: translateY(-2px);
            filter: brightness(1.02);
          }
          .card-3d:active {
            transform: translateY(2px);
            border-bottom-width: 0px;
            margin-top: 2px;
            margin-bottom: 2px;
          }
        `}</style>

        {/* --- TOP NAVIGATION BAR --- */}
        <header className="bg-white border-b-2 border-gray-200 sticky top-0 z-30 px-4 lg:px-8 h-20 flex items-center justify-between shadow-sm">
          <Link href="/auth/dashboard">
            <div className="flex items-center gap-2 cursor-pointer group">
              {/* Animated Logo Icon */}
              <Image
                src="/logo.svg"
                alt="Edison Logo"
                width={120}
                height={50}
              />
            </div>
          </Link>

          <div className="flex items-center gap-4 md:gap-6">
            {/* Stats Capsules */}
            <div className="hidden md:flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-2xl cursor-pointer transition-colors border-2 border-transparent hover:border-gray-200">
              <Flame size={24} className="text-[#FF9600] fill-[#FF9600]" />
              <span className="font-extrabold text-[#FF9600]">
                {userData.streak}
              </span>
            </div>
            <div className="hidden md:flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-2xl cursor-pointer transition-colors border-2 border-transparent hover:border-gray-200">
              <Zap size={24} className="text-[#4854F6] fill-[#4854F6]" />
              <span className="font-extrabold text-[#4854F6]">
                {userData.xp}
              </span>
            </div>

            {/* User Profile - Clerk Integration */}
            <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
              <div className="relative cursor-pointer hover:scale-110 transition-transform">
                <Bell size={28} className="text-gray-400 hover:text-gray-600" />
                <span className="absolute top-0 right-0 w-3 h-3 bg-[#FF4B4B] rounded-full border-2 border-white"></span>
              </div>

              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-10 h-10 border-2 border-gray-200",
                  },
                }}
                afterSignOutUrl="/"
              />
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* --- LEFT COLUMN (Main Content) --- */}
          <div className="lg:col-span-2 space-y-8">
            {/* Welcome & AI Brief */}
            <section className="relative">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-3xl font-black text-gray-700">
                    Welcome back, {user?.firstName || "Student"}!
                  </h1>
                  <p className="text-gray-400 font-bold text-lg">
                    Let's keep that brain active.
                  </p>
                </div>

                <button
                  className="btn-3d bg-[#4854F6]  text-white font-extrabold py-3.5 px-6 rounded-xl uppercase tracking-widest text-sm  border-b-[#3a45d1]"
                  onClick={() => redirect("/auth/profile")}
                >
                  Open Profile
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aiRecommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className={`card-3d bg-white rounded-3xl p-5 border-2 border-gray-200 flex flex-col gap-4 relative overflow-hidden group hover:border-${
                      rec.theme === "red" ? "red-400" : "yellow-400"
                    } transition-colors`}
                  >
                    {/* Background Decoration */}
                    <div
                      className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 ${
                        colors[rec.theme].split(" ")[0]
                      }`}
                    ></div>

                    <div className="flex items-start gap-4 z-10">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                          colors[rec.theme]
                        }`}
                      >
                        {rec.icon}
                      </div>
                      <p className="font-bold text-gray-600 text-lg leading-tight">
                        {rec.text}
                      </p>
                    </div>

                    <button
                      className={`btn-3d w-full py-3 rounded-xl font-extrabold uppercase tracking-widest text-sm text-white shadow-sm ${
                        colors[rec.theme]
                      }`}
                    >
                      {rec.action}
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Recent Courses */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-gray-700">Subjects </h2>
                {/* <div className="flex items-center gap-2">
                  <Link
                    href="/auth/courses"
                    className="text-gray-400 hover:text-gray-600 font-extrabold text-sm uppercase tracking-wider px-4 py-2 transition-colors"
                  >
                    View All
                  </Link>
                  <button
                    onClick={() => setIsAddCourseModalOpen(true)}
                    className="text-[#4854F6] font-extrabold text-sm uppercase tracking-wider hover:bg-blue-50 px-4 py-2 rounded-xl transition-colors border-2 border-transparent hover:border-blue-100"
                  >
                    + Add Course
                  </button>
                </div> */}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profileLoading || isPending ? (
                  // Loading skeletons
                  Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className="card-3d bg-white rounded-3xl border-2 border-gray-200 p-2 h-full animate-pulse"
                    >
                      <div className="p-4 flex flex-col h-full">
                        <div className="flex items-start justify-between mb-6">
                          <div className="w-20 h-20 bg-gray-200 rounded-2xl"></div>
                          <div className="h-6 bg-gray-200 rounded-xl w-16"></div>
                        </div>
                        <div className="mt-auto space-y-3">
                          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-200 rounded w-full"></div>
                          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                          <div className="h-10 bg-gray-200 rounded-xl w-full"></div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : data && data.length > 0 ? (
                  data.map((course) => (
                    <div
                      key={course.id}
                      className="card-3d bg-white rounded-3xl border-2 border-gray-200 p-2 cursor-pointer group h-full"
                    >
                      <div className="p-4 flex flex-col h-full">
                        <div className="flex items-start justify-between mb-6">
                          {/* Giant Icon */}
                          <div
                            className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-md transform group-hover:scale-105 transition-transform duration-300"
                            style={{
                              backgroundColor: getBgColor(course.subject.theme),
                            }}
                          >
                            <BookOpen size={40} color="white" />
                          </div>

                          {/* Level Badge */}
                          <div className="bg-gray-100 border-2 border-gray-200 text-gray-400 text-xs font-black px-3 py-1.5 rounded-xl uppercase">
                            {course.class.name}
                          </div>
                        </div>

                        <div className="mt-auto space-y-3">
                          <h3 className="font-black text-xl text-gray-700 group-hover:text-[#4854F6] transition-colors">
                            {course.subject.name}
                          </h3>

                          <p className="text-sm text-gray-500">
                            {course.subject.description}
                          </p>
                          {/* //TODO: add progress bar */}

                          <button
                            className={`btn-3d w-full py-3 rounded-xl font-extrabold uppercase tracking-widest text-sm text-white shadow-sm ${getColorClass(
                              course.subject.theme as ThemeColor
                            )}`}
                            onClick={() =>
                              redirect(
                                `/auth/lesson/${course.subject.id}/${course.class.id}`
                              )
                            }
                          >
                            Continue Learning
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  // Empty state
                  <div className="col-span-full text-center py-12">
                    <BookOpen
                      size={48}
                      className="text-gray-300 mx-auto mb-4"
                    />
                    <h3 className="text-xl font-bold text-gray-500 mb-2">
                      No Courses Available
                    </h3>
                    <p className="text-gray-400 mb-6">
                      You don't have any courses assigned to your class yet.
                    </p>
                    <button
                      onClick={() => setIsAddCourseModalOpen(true)}
                      className="px-6 py-3 bg-[#4854F6] text-white font-bold rounded-xl hover:bg-[#3a45d1] transition-colors"
                    >
                      Add Course
                    </button>
                  </div>
                )}
              </div>
            </section>

            {/* Recent Achievements */}
            <section>
              <h2 className="text-2xl font-black text-gray-700 mb-6">
                Recent Achievements
              </h2>
              <div className="bg-white rounded-3xl border-2 border-gray-200 p-6 flex flex-wrap gap-6">
                {/* Achievement 1 */}
                <div className="flex flex-col items-center gap-2 group cursor-pointer">
                  <div className="w-24 h-24 bg-[#FFC800] rounded-2xl border-b-4 border-[#E5B400] flex items-center justify-center transform group-hover:-translate-y-1 transition-transform">
                    <Flame
                      size={48}
                      className="text-white fill-white/20"
                      strokeWidth={2.5}
                    />
                  </div>
                  <span className="font-black text-gray-600 text-sm uppercase">
                    Wildfire
                  </span>
                </div>
                {/* Achievement 2 */}
                <div className="flex flex-col items-center gap-2 group cursor-pointer">
                  <div className="w-24 h-24 bg-[#CE82FF] rounded-2xl border-b-4 border-[#A568CC] flex items-center justify-center transform group-hover:-translate-y-1 transition-transform">
                    <Brain
                      size={48}
                      className="text-white fill-white/20"
                      strokeWidth={2.5}
                    />
                  </div>
                  <span className="font-black text-gray-600 text-sm uppercase">
                    Sage
                  </span>
                </div>
                {/* Locked Achievement */}
                <div className="flex flex-col items-center gap-2 opacity-50">
                  <div className="w-24 h-24 bg-gray-100 rounded-2xl border-b-4 flex items-center justify-center border-dashed border-2 border-gray-300">
                    <Gift
                      size={48}
                      className="text-gray-300"
                      strokeWidth={2.5}
                    />
                  </div>
                  <span className="font-black text-gray-400 text-sm uppercase">
                    Locked
                  </span>
                </div>

                <Link
                  href="/auth/achievements"
                  className="ml-auto flex items-center"
                >
                  <button className="text-gray-400 hover:text-gray-600 font-extrabold text-sm uppercase tracking-wider">
                    View All
                  </button>
                </Link>
              </div>
            </section>
          </div>

          {/* --- RIGHT COLUMN (Sidebar Stats) --- */}
          <aside className="space-y-6">
            {/* Daily Quests Card */}
            <div className="bg-white rounded-3xl border-2 border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-black text-xl text-gray-700">
                  Daily Quests
                </h3>
                <Clock size={20} className="text-[#4854F6]" strokeWidth={2.5} />
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#FFC800] border-b-4 border-[#E5B400] rounded-xl flex items-center justify-center text-white shrink-0">
                    <Zap size={24} fill="currentColor" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm font-extrabold mb-2">
                      <span className="text-gray-700">Earn 50 XP</span>
                      <span className="text-gray-400">30/50</span>
                    </div>
                    <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                      <div className="h-full bg-[#FFC800] w-[60%]"></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#CE82FF] border-b-4 border-[#A568CC] rounded-xl flex items-center justify-center text-white shrink-0">
                    <BookOpen size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm font-extrabold mb-2">
                      <span className="text-gray-700">Finish 1 Unit</span>
                      <span className="text-gray-400">0/1</span>
                    </div>
                    <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                      <div className="h-full bg-[#CE82FF] w-0"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Leaderboard Card */}
            <div className="bg-white rounded-3xl border-2 border-gray-200 p-6">
              <h3 className="font-black text-xl text-gray-700 mb-6">
                Diamond League
              </h3>
              <Link href="/auth/leaderboard">
                <div className="flex items-center gap-4 mb-4 hover:bg-gray-50 p-2 rounded-xl transition-colors cursor-pointer">
                  <div className="w-14 h-14 rounded-full border-2 border-gray-200 p-1">
                    <div className="w-full h-full bg-[#4854F6] rounded-full flex items-center justify-center text-white font-black">
                      #{userData.leagueRank}
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-extrabold text-gray-800 text-lg">
                      Sage League
                    </p>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                      Top 10 Advance
                    </p>
                  </div>
                  <ChevronRight className="text-gray-300" strokeWidth={3} />
                </div>
              </Link>

              {/* Mini Ranking List */}
              <div className="space-y-2 mt-4">
                {[1, 2, 3].map((rank) => (
                  <div
                    key={rank}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50"
                  >
                    <span
                      className={`font-black w-6 ${
                        rank === 1 ? "text-[#FFC800]" : "text-gray-400"
                      }`}
                    >
                      {rank}
                    </span>
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    <div className="h-3 w-20 bg-gray-100 rounded-full"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Premium Ad (Duolingo Style) */}
            <div className="rounded-3xl p-6 bg-[#101928] text-white text-center relative overflow-hidden border-b-4 border-gray-900">
              {/* Background shapes */}
              <div className="absolute top-0 left-0 w-full h-full opacity-10">
                <Star
                  size={100}
                  className="absolute -top-4 -left-4 rotate-12"
                />
                <Star
                  size={60}
                  className="absolute bottom-4 right-4 -rotate-12"
                />
              </div>

              <div className="relative z-10">
                <div className="w-16 h-16 bg-linear-to-tr from-[#FFC800] to-[#FF9600] rounded-2xl flex items-center justify-center mx-auto mb-4 border-b-4 border-[#CC7800] shadow-lg">
                  <Star fill="white" className="text-white" size={32} />
                </div>
                <h3 className="font-black text-xl mb-2">Super Edison</h3>
                <p className="text-sm text-gray-300 mb-6 font-medium leading-relaxed">
                  No ads, unlimited hearts, and personalized mistake review.
                </p>
                <button className="btn-3d w-full bg-white text-[#4854F6] font-extrabold py-3.5 rounded-xl uppercase tracking-widest text-sm">
                  Try 2 Weeks Free
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </SignedIn>
  );
}


