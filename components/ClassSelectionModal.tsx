"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@clerk/nextjs";
import { useProfile } from "@/hook/useProfile";

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

  if (profile?.class_id) return null;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const fetchClasses = async (): Promise<ClassOption[]> => {
      const { data, error } = await supabase.from("classes").select("*");

      if (error) {
        console.error("Error fetching classes:", error);
        return [];
      }
      return data || [];
    };
    fetchClasses().then(setClasses);

    return () => {
      document.body.style.overflow = "auto";
    };
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
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Select Your Class
        </h2>
        <div className="flex flex-col gap-3 max-h-64 overflow-y-auto mb-4">
          {classes &&
            classes.map((cls) => (
              <button
                key={cls.id}
                onClick={() => setSelectedClass(cls.id)}
                className={`p-2 rounded-lg text-left border transition-colors ${
                  selectedClass === cls.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:bg-gray-100"
                }`}
              >
                {cls.name}
              </button>
            ))}
        </div>
        <button
          disabled={!selectedClass || loading}
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg disabled:opacity-50"
        >
          {loading ? "Saving..." : "Confirm Class"}
        </button>
      </div>
    </div>
  );
}
