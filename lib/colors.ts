import { ThemeColor } from "@/types/theme";

export const colors: Record<ThemeColor, string> = {
  blue: "bg-[#1CB0F6] border-[#1899D6]",
  green: "bg-[#58CC02] border-[#46A302]",
  red: "bg-[#FF4B4B] border-[#EA2B2B]",
  yellow: "bg-[#FFC800] border-[#E5B400]",
  purple: "bg-[#CE82FF] border-[#A568CC]",
  orange: "bg-[#FF9600] border-[#CC7800]",
};


// Helper function to get color class safely
export const getColorClass = (theme: ThemeColor | null): string => {
  return colors[theme || "blue"];
};

export const getBgColor = (theme: ThemeColor| null): string => {
  const colorMap: Record<ThemeColor, string> = {
    blue: "#1CB0F6",
    green: "#58CC02",
    red: "#FF4B4B",
    yellow: "#FFC800",
    purple: "#CE82FF",
    orange: "#FF9600",
  };
  return colorMap[theme || "blue"];
};