"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { SignedIn, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Nunito } from "next/font/google"; // Optimized font loading
import Image from "next/image";
import {
  Book,
  Layers,
  PenTool,
  Trophy,
  User,
  Mic,
  Dumbbell,
} from "lucide-react";
import {
  MobileNavItem,
} from "@/components/ui/dashboard-subcomponents";


const Sidebar = () => {
    const { user } = useUser();
    const [activeTab, setActiveTab] = useState("learn");
  return (
    <div>
       {/* --- MOBILE BOTTOM NAV --- */}
              <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex justify-around items-center h-20 px-2 pb-2 z-50">
                  <MobileNavItem
        href="/auth/dashboard"
                      icon={<Book size={24} />}
                      label="Learn"
                      isActive={activeTab === "learn"}
                      onClick={() => setActiveTab("learn")}
                      />
                  <MobileNavItem
        href="/auth/voice-ai"
                      icon={<Mic size={24} />}
                      label="Speak"
                      isActive={activeTab === "voice"}
                      onClick={() => setActiveTab("voice")}
                      />
                  <MobileNavItem
        href="/auth/practice"
                      icon={<Dumbbell size={24} />}
                      label="Practice"
                      isActive={activeTab === "practice"}
                      onClick={() => setActiveTab("practice")}
                      />
                  <MobileNavItem
        href="/auth/flashcards"
                      icon={<Layers size={24} />}
                      label="Cards"
                      isActive={activeTab === "cards"}
                      onClick={() => setActiveTab("cards")}
                      />
                  <MobileNavItem
        href="/auth/leaderboard"
                      icon={<Trophy size={24} />}
                      label="Rank"
                      isActive={activeTab === "leaderboard"}
                      onClick={() => setActiveTab("leaderboard")}
                      />
                  <MobileNavItem
        href="/auth/profile"
                      icon={<User size={24} />}
                      label="Profile"
                      isActive={activeTab === "profile"}
                      onClick={() => setActiveTab("profile")}
                      />
                </div>
    </div>
  );
};

export default Sidebar;
