"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@clerk/nextjs";
import { useProfile } from "@/hook/useProfile";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { GraduationCap, Check } from "lucide-react";

type ClassOption = {
  id: string;
  name: string;
};

export default function ClassSelectionModal() {
  const { profile, refetchProfile } = useProfile();
  const { user } = useUser();
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [isOpen, setIsOpen] = useState(true);

  // Keep original logic: if profile has a class, don't show modal
  if (profile?.class_id) return null;

  useEffect(() => {
    const fetchClasses = async () => {
      const { data, error } = await supabase.from("classes").select("*");
      if (error) {
        console.error("Error fetching classes:", error);
        return;
      }
      setClasses(data || []);
    };
    fetchClasses();
  }, []);

  const handleSubmit = async () => {
    if (!selectedClass || !user) return;
    setLoading(true);

    const { error } = await supabase
      .from("profiles")
      .update({ class_id: selectedClass })
      .eq("clerk_id", user.id);

    if (error) {
      console.error("Failed to save class:", error.message);
      setLoading(false);
      return;
    }

    await refetchProfile();
    setLoading(false);
    setIsOpen(false); // Close modal on success
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          {/* Header */}
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#4854F6] rounded-full flex items-center justify-center text-white shadow-[0_4px_0_#353EB5]">
                <GraduationCap size={24} />
              </div>
              <div>
                <DialogTitle className="text-xl font-black text-gray-700">
                  Join a Class
                </DialogTitle>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">
                  Select your current level to continue
                </p>
                <p className="text-red-500 text-xs mt-1">
                  * Required to access the platform
                </p>
              </div>
            </div>
          </DialogHeader>

          {/* Body */}
          <div className="max-h-[400px] overflow-y-auto space-y-3 py-4">
            {classes.map((cls) => {
              const isSelected = selectedClass === cls.id;
              return (
                <button
                  key={cls.id}
                  onClick={() => setSelectedClass(cls.id)}
                  className={`
                    btn-pressable w-full p-4 rounded-2xl border-2 flex items-center justify-between group text-left
                    ${
                      isSelected
                        ? "bg-[#EEF2FF] border-[#4854F6] border-b-4"
                        : "bg-white border-gray-200 border-b-4 hover:bg-gray-50 text-gray-600"
                    }
                  `}
                >
                  <span
                    className={`font-bold text-lg ${
                      isSelected ? "text-[#4854F6]" : "text-gray-600"
                    }`}
                  >
                    {cls.name}
                  </span>

                  <div
                    className={`
                      w-8 h-8 rounded-xl flex items-center justify-center border-2 transition-all
                      ${
                        isSelected
                          ? "bg-[#4854F6] border-[#4854F6] text-white"
                          : "bg-transparent border-gray-300 text-transparent"
                      }
                    `}
                  >
                    <Check size={20} strokeWidth={4} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <DialogFooter>
            <button
              onClick={handleSubmit}
              disabled={!selectedClass || loading}
              className={`
                btn-pressable w-full py-4 rounded-2xl font-extrabold uppercase tracking-wider text-sm flex items-center justify-center gap-2
                ${
                  selectedClass && !loading
                    ? "bg-[#4854F6] text-white border-[#353EB5] border-b-4 shadow-sm"
                    : "bg-gray-200 text-gray-400 border-gray-300 border-b-4 cursor-not-allowed"
                }
              `}
            >
              {loading ? "Saving..." : "Confirm Selection"}
            </button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
