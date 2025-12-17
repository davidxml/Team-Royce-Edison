
import { motion } from "framer-motion";
import Link from "next/link";


// --- SUBCOMPONENTS ---// 
interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick?: () => void;
  badge?: string | number;
  href?: string;
}

// Updated to support Next.js Link with TypeScript
export const NavItem = ({ icon, label, isActive, onClick, badge, href }: NavItemProps) => {
  return (
      <Link href={href || "#"}>
          <button
    onClick={onClick}
              className={`
                  flex items-center gap-4 px-4 py-3 rounded-xl w-full transition-all duration-200
                              ${
                                  isActive
                                  ? "bg-indigo-50 border-2 border-indigo-100 text-[#4854F6]"
                                      : "hover:bg-gray-100 border-2 border-transparent text-gray-500"
                                    }
                              `}
                              >
              <div className="relative">
                  {icon}
                  {badge && (
          <span className="absolute -top-2 -right-4 bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md">
                          {badge}
                        </span>
          )}
                </div>
              <span className="hidden lg:block font-bold uppercase tracking-widest text-sm">
                  {label}
                </span>
            </button>
        </Link>
  );
};

export const MobileNavItem = ({ icon, label, isActive, onClick, href }: NavItemProps) => (
  <Link href={href || "#"} className="w-full h-full">
      <button
  onClick={onClick}
          className="flex flex-col items-center gap-1 w-full h-full justify-center"
          >
          <div className={`${isActive ? "text-[#4854F6]" : "text-gray-400"}`}>
              {icon}
            </div>
        </button>
    </Link>
);

interface QuestItemProps {
    title: string;
    progress: number;
    total: number;
    icon: React.ReactNode;
}

export const QuestItem = ({ title, progress, total, icon }: QuestItemProps) => (
  <div className="flex items-center gap-3">
      <div className="p-2 bg-gray-100 rounded-lg">{icon}</div>
      <div className="flex-1">
          <div className="flex justify-between mb-1">
              <span className="font-bold text-gray-700 text-sm">{title}</span>
              <span className="font-bold text-gray-400 text-xs">
                  {progress}/{total}
                </span>
            </div>
          <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
              <motion.div
      initial={{ width: 0 }}
                  whileInView={{ width: `${(progress / total) * 100}%` }}
                  transition={{ duration: 1 }}
                  className="bg-yellow-400 h-full rounded-full"
                  ></motion.div>
            </div>
        </div>
    </div>
);
// Icon component helper
interface TargetProps {
  size: number | string;
  className?: string;
}

export const Target = ({ size, className }: TargetProps) => (
  <svg
  xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
);