import type { Metadata } from "next";
import { Nunito } from "next/font/google";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Edison",
  description: "Focus mode learning",
};

import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import MobileBottomNav from "@/components/MobileBottomNav";

export default function LessonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={nunito.className}>
      {/* Re-declaring your global styles here to ensure they apply in this isolated layout */}
     
          <div className="min-h-screen bg-white text-gray-700">
               {/* --- LEFT SIDEBAR (Navigation) --- */}
              <LeftSidebar/>
              <MobileBottomNav/>
              {children}
               {/* --- RIGHT SIDEBAR --- */}
              <RightSidebar/>
              
      </div>
    </div>
  );
}
