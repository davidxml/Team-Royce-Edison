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
import { NavItem } from "@/components/ui/dashboard-subcomponents";

const Sidebar = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("learn");
  return (
    <div>
      {/* --- LEFT SIDEBAR (Navigation) --- */}
      <aside className="w-20 lg:w-64 border-r border-gray-200 fixed h-full bg-white z-40 hidden md:flex flex-col px-4 py-6">
        {/* Logo */}
        <Link
          href="/auth/dashboard"
          className="mb-8 px-2 lg:px-4 cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Image src="/logo.svg" alt="Edison Logo" width={120} height={50} />
          </div>
        </Link>
        {/* Nav Items - Mapped to real routes if needed, or keeping active state */}
        <nav className="flex-1 space-y-2">
          <NavItem
            href="/auth/dashboard"
            icon={<Book size={28} />}
            label="Learn"
            isActive={activeTab === "learn"}
            onClick={() => setActiveTab("learn")}
          />
          <NavItem
            href="/auth/voice-ai"
            icon={<Mic size={28} />}
            label="Voice Chat AI"
            isActive={activeTab === "voice"}
            onClick={() => setActiveTab("voice")}
            badge="NEW"
          />
          <NavItem
            href="/auth/practice"
            icon={<Dumbbell size={28} />}
            label="Practice"
            isActive={activeTab === "practice"}
            onClick={() => setActiveTab("practice")}
          />
          <NavItem
            href="/auth/flashcards"
            icon={<Layers size={28} />}
            label="Flashcards"
            isActive={activeTab === "cards"}
            onClick={() => setActiveTab("cards")}
          />
          <NavItem
            href="/auth/notes"
            icon={<PenTool size={28} />}
            label="Notes"
            isActive={activeTab === "notes"}
            onClick={() => setActiveTab("notes")}
          />
          <NavItem
            href="/auth/leaderboard"
            icon={<Trophy size={28} />}
            label="Leaderboard"
            isActive={activeTab === "leaderboard"}
            onClick={() => setActiveTab("leaderboard")}
          />
          <NavItem
            href="/auth/profile"
            icon={<User size={28} />}
            label="Profile"
            isActive={activeTab === "profile"}
            onClick={() => setActiveTab("profile")}
          />
        </nav>
        {/* User Profile Mini - Clerk Integration */}
        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center gap-3 px-2">
          <UserButton afterSignOutUrl="/" />
          <div className="hidden lg:block text-sm font-bold truncate">
            {user?.fullName || "Student"}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
