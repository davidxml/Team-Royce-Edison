"use client";

import { Nunito } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import {
  Book,
  ChevronRight,
  Flame,
  Heart,
  Mic,
  Trophy,
  Zap,
  CheckCircle,
  Circle,
  Lock,
} from "lucide-react";
import { UserButton, useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import Link from "next/link";
import { QuestItem, Target } from "@/components/ui/dashboard-subcomponents";
import { use, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useFetcher } from "@/hook/useFetcher";
import { Topic } from "@/types/topics";
import { ThemeColor } from "@/types/theme";
import { getBgColor, getColorClass } from "@/lib/colors";
import { redirect } from "next/navigation";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const page = ({
  params,
}: {
  params: Promise<{ courseId: string; classId: string }>;
}) => {
  const { courseId, classId } = use(params);
  const { user } = useUser();

  const fetchTopics: () => Promise<Topic[]> = useCallback(async () => {
    let { data, error } = await supabase
      .from("topics")
      .select(
        "id, subject:subject_id (id, name, theme), title, class:class_id (id, name), description, completed, student_progress!left (completed) order_index"
      )
      .eq("subject_id", courseId)
      .eq("class_id", classId)
      .eq("student_progress.user_id", user?.id)
      .order("order_index", { ascending: true });

    if (error) {
      throw error;
    }
    return data as unknown as Topic[];
  }, [classId, courseId , user?.id]);

  const { data, isPending, error } = useFetcher<Topic[]>(fetchTopics, {
    enabled: !!classId && !!courseId,
  });

  if (error) {
    return (
      <div
        className={`min-h-screen bg-white text-gray-700 flex ${nunito.className}`}
      >
        <main className="flex-1 px-4 max-w-2xl mx-auto w-full pb-24 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Book size={32} className="text-red-500" />
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

            <button
              onClick={() => (window.location.href = "/auth/dashboard")}
              className="ml-4 px-6 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </main>
      </div>
    );
  }
  return (
    <div
      className={`min-h-screen bg-white text-gray-700 flex ${nunito.className}`}
    >
      <Sidebar />
      {/* --- MAIN CONTENT (The Path) --- */}
      <main className="flex-1 md:ml-20 lg:ml-64 mr-0 lg:mr-96 px-4 max-w-2xl mx-auto w-full pb-24 flex flex-col">
        {/* Mobile Header (Visible only on small screens) */}
        <div className="md:hidden flex items-center justify-between py-4 border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur z-50">
          <span className="text-xl font-black text-[#4854F6]">Edison</span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-orange-500 font-bold">
              <Flame size={20} fill="currentColor" /> 12
            </div>
            <div className="flex items-center gap-1 text-blue-500 font-bold">
              <Zap size={20} fill="currentColor" /> 450
            </div>
            <UserButton />
          </div>
        </div>

        {/* FIXED COURSE HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm w-full pt-6 pb-4 border-b border-gray-100 mb-6"
        >
          <div className="flex items-center justify-between" onClick={()=>redirect('/auth/dashboard')}>
            <div className="flex items-center gap-2 hover:bg-gray-100 p-2 -ml-2 rounded-xl cursor-pointer transition-colors group">
              <div className="w-10 h-8 rounded-lg border-2 border-gray-300 group-hover:border-gray-400 flex items-center justify-center bg-white">
                <img
                  src="https://flagcdn.com/w40/ng.png"
                  alt="Nigeria"
                  className="w-6 h-4 object-cover rounded-sm opacity-80"
                />
              </div>
              <div>
                <h2 className="font-extrabold text-gray-400 text-xs uppercase tracking-wider">
                  Current Course
                </h2>
                <h1 className="font-black text-gray-700 text-lg md:text-xl">
                  {isPending ? (
                    <div className="h-6 bg-gray-200 animate-pulse rounded w-48"></div>
                  ) : data && data.length > 0 ? (
                    data[0].subject.name
                  ) : (
                    "Course Not Found"
                  )}
                </h1>
              </div>
              <ChevronRight className="text-gray-400 group-hover:rotate-90 transition-transform" />
            </div>
          </div>
        </motion.div>

        {/* TOPICS CONTAINER - Fixed Height with Internal Scrolling */}
        <div className="flex-1 min-h-0">
          <div className="bg-gray-50 rounded-3xl border border-gray-200 p-6 h-full overflow-y-auto">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-black text-gray-700">
                  Course Topics
                </h2>
                {data && data.length > 0 && (
                  <div className="text-sm text-gray-500 font-medium">
                    {data.filter((t) => t.student_progress[0]?.completed).length} of {data.length}{" "}
                    completed
                  </div>
                )}
              </div>
              {data && data.length > 0 && (
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        (data.filter((t) => t.student_progress[0]?.completed).length / data.length) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              )}
              <p className="text-gray-500">
                Complete all topics to master this subject
              </p>
            </div>

            {isPending ? (
              // Loading skeleton
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-white animate-pulse rounded-2xl p-6 shadow-sm border border-gray-100"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                      <div className="flex-1">
                        <div className="h-5 bg-gray-200 rounded mb-2 w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                      </div>
                      <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : data?.length === 0 ? (
              <div className="text-center py-12">
                <Book size={48} className="text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-500 mb-2">
                  No Topics Found
                </h3>
                <p className="text-gray-400">
                  This course doesn't have any topics yet.
                </p>
              </div>
            ) : data && data.every((t) => t.student_progress[0]?.completed) ? (
              // Course Completed Celebration
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Trophy
                    size={48}
                    className="text-green-600"
                    fill="currentColor"
                  />
                </div>
                <h3 className="text-2xl font-black text-green-700 mb-2">
                  🎉 Course Completed!
                </h3>
                <p className="text-gray-600 mb-6">
                  Congratulations! You've mastered all topics in{" "}
                  {data[0].subject.name}.
                </p>
                <div className="flex gap-3 justify-center">
                  <Link
                    href="/auth/dashboard"
                    className="px-6 py-3 bg-[#4854F6] text-white font-bold rounded-xl hover:bg-[#3a45d1] transition-colors"
                  >
                    Back to Dashboard
                  </Link>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-colors"
                  >
                    Review Topics
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {data?.map((topic, index) => {
                  const isCompleted = topic.student_progress[0]?.completed;
                  const isNext =
                    !isCompleted &&
                    data.slice(0, index).every((t) => t.student_progress[0]?.completed);
                  const isLocked = !isCompleted && !isNext;

                  return (
                    <motion.div
                      key={topic.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className={`bg-white rounded-2xl p-6 shadow-sm border transition-all duration-300 hover:shadow-md ${
                        isCompleted
                          ? "border-green-200 bg-green-50/50"
                          : isNext
                          ? "border-blue-200 hover:border-blue-300"
                          : "border-gray-100 opacity-60"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {/* Status Indicator */}
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                            isCompleted
                              ? "bg-green-100"
                              : isNext
                              ? "bg-blue-100"
                              : "bg-gray-100"
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle
                              size={24}
                              className="text-green-600"
                              fill="currentColor"
                            />
                          ) : isLocked ? (
                            <Lock size={20} className="text-gray-400" />
                          ) : (
                            <Circle size={20} className="text-blue-500" />
                          )}
                        </div>

                        {/* Topic Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3
                              className={`font-bold text-lg truncate ${
                                isCompleted
                                  ? "text-green-700"
                                  : isLocked
                                  ? "text-gray-400"
                                  : "text-gray-700"
                              }`}
                            >
                              {topic.title}
                            </h3>
                            {isCompleted && (
                              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                                COMPLETED
                              </span>
                            )}
                          </div>
                          <p
                            className={`text-sm ${
                              isCompleted
                                ? "text-green-600"
                                : isLocked
                                ? "text-gray-400"
                                : "text-gray-500"
                            }`}
                          >
                            {topic.description ||
                              "Explore this topic to enhance your understanding and skills."}
                          </p>
                        </div>

                        {/* Action Button */}
                        <div className="shrink-0">
                          {isCompleted ? (
                            <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-xl">
                              <CheckCircle size={16} fill="currentColor" />
                              <span className="font-bold text-sm">Done</span>
                            </div>
                          ) : isLocked ? (
                            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-400 rounded-xl">
                              <Lock size={16} />
                              <span className="font-bold text-sm">Locked</span>
                            </div>
                          ) : (
                            <Link
                              href={`/unit/${topic.id}`}
                              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors font-bold text-sm"
                            >
                              <span>Start</span>
                              <ChevronRight size={16} />
                            </Link>
                          )}
                        </div>
                      </div>

                      {/* Progress Indicator for Next Topic */}
                      {isNext && (
                        <div className="mt-4 pt-4 border-t border-blue-100">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-blue-600 font-medium">
                              Next up in your learning path
                            </span>
                            <span className="text-blue-500 font-bold">
                              Topic {index + 1} of {data.length}
                            </span>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* --- RIGHT SIDEBAR (Stats & Quests) --- */}
      <aside className="hidden lg:block w-96 p-6 fixed right-0 h-full overflow-y-auto z-40 bg-white border-l border-gray-200">
        {/* Course Progress Card */}
        {data && data.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-2 border-gray-200 rounded-2xl p-4 mb-6 bg-linear-to-br from-blue-50 to-indigo-50"
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: getBgColor(data[0].subject.theme) }}
              >
                <Book size={24} color="white" />
              </div>
              <div>
                <h3 className="font-black text-gray-700 text-lg">
                  {data[0].subject.name}
                </h3>
                <p className="text-sm text-gray-500">Course Progress</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Topics Completed</span>
                <span className="font-bold text-gray-700">
                  {data.filter((t) => t.student_progress[0]?.completed).length} / {data.length}
                </span>
              </div>
              <div className="w-full bg-white rounded-full h-3">
                <div
                  className="h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      (data.filter((t) => t.student_progress[0]?.completed).length / data.length) *
                      100
                    }%`,
                    backgroundColor: getBgColor(data[0].subject.theme),
                  }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {Math.round(
                  (data.filter((t) => t.student_progress[0]?.completed).length / data.length) * 100
                )}
                % complete
              </p>
            </div>
          </motion.div>
        )}

        {/* Top Stats Bar */}
        <div className="flex items-center gap-4 mb-10">
          <div className="group relative flex items-center gap-2 cursor-pointer">
            <img
              src="https://flagcdn.com/w40/ng.png"
              className="w-8 h-5 rounded-md object-cover border border-gray-200"
              alt="Flag"
            />
          </div>
          <div className="flex items-center gap-2 text-orange-500 font-bold hover:bg-gray-100 px-2 py-1 rounded-xl cursor-pointer">
            <Flame size={24} fill="currentColor" /> 12
          </div>
          <div className="flex items-center gap-2 text-blue-400 font-bold hover:bg-gray-100 px-2 py-1 rounded-xl cursor-pointer">
            <Zap size={24} fill="currentColor" /> 450
          </div>
          <div className="flex items-center gap-2 text-red-500 font-bold hover:bg-gray-100 px-2 py-1 rounded-xl cursor-pointer">
            <Heart size={24} fill="currentColor" /> 5
          </div>
        </div>
        {/* "Try Super" Ad Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="border-2 border-gray-200 rounded-2xl p-4 mb-6 hover:border-gray-300 transition-all cursor-pointer"
        >
          <h3 className="font-black text-gray-800 text-lg mb-2">
            Super Edison
          </h3>
          <p className="text-gray-500 mb-4 text-sm leading-relaxed">
            Unlimited hearts, personalized mistakes review, and no ads.
          </p>
          <button className="w-full py-3 rounded-xl font-bold uppercase tracking-widest text-sm bg-linear-to-r from-indigo-500 to-purple-500 text-white shadow-md hover:brightness-110 active:scale-95 transition-all">
            Try 2 Weeks Free
          </button>
        </motion.div>
        {/* Daily Quests */}
        <div className="border-2 border-gray-200 rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-gray-700 text-lg">Daily Quests</h3>
            <Link
              href="/auth/quests"
              className="text-blue-400 text-sm font-bold uppercase hover:text-blue-500"
            >
              View all
            </Link>
          </div>
          <div className="space-y-4">
            <QuestItem
              title="Earn 50 XP"
              progress={30}
              total={50}
              icon={<Zap size={20} className="text-blue-500" />}
            />
            <QuestItem
              title="Complete 2 Voice Sessions"
              progress={1}
              total={2}
              icon={<Mic size={20} className="text-purple-500" />}
            />
            <QuestItem
              title="Score 90% in Math Quiz"
              progress={0}
              total={1}
              icon={<Target size={20} className="text-red-500" />}
            />
          </div>
        </div>
        {/* Leaderboard Teaser */}
        <div className="border-2 border-gray-200 rounded-2xl p-4">
          <h3 className="font-black text-gray-700 text-lg mb-4">
            Diamond League
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                JD
              </div>
              <div className="flex-1">
                <div className="font-bold text-gray-700">John Doe</div>
                <div className="text-xs text-gray-400">1200 XP</div>
              </div>
              <Trophy
                size={20}
                className="text-yellow-400"
                fill="currentColor"
              />
            </div>
            <div className="flex items-center gap-3 opacity-60">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                SA
              </div>
              <div className="flex-1">
                <div className="font-bold text-gray-700">Sarah A.</div>
                <div className="text-xs text-gray-400">950 XP</div>
              </div>
              <span className="font-bold text-gray-400">#2</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default page;
