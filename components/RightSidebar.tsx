"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Trophy,
    Mic,
  Heart,
  Flame,
  Zap,
  Target,
} from "lucide-react";
import {
  QuestItem,
} from "@/components/ui/dashboard-subcomponents";


const RightSidebar = () => {
  return (
    <div>
      {/* --- RIGHT SIDEBAR (Stats & Quests) --- */}
              <aside className="hidden lg:block w-96 p-6 fixed right-0 h-full overflow-y-auto z-40 bg-white border-l border-gray-200">
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

export default RightSidebar;
