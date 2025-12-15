"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";

interface Course {
  id: string;
  title: string;
  grade: number;
}

interface AddCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddCourseModal({ isOpen, onClose }: AddCourseModalProps) {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    async function fetchCourses() {
      const { data, error } = await supabase.from("courses").select("*");
      if (error) {
        console.error("Error fetching courses:", error);
      } else {
        setCourses(data as Course[]);
      }
    }

    if (isOpen) {
      fetchCourses();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a Course</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <ul className="space-y-2">
            {courses.map((course) => (
              <li
                key={course.id}
                className="flex items-center justify-between p-2 border rounded-lg"
              >
                <div>
                  <p className="font-semibold">{course.title}</p>
                  <p className="text-sm text-gray-500">Grade {course.grade}</p>
                </div>
                <button
                  onClick={() => {
                    // Handle adding the course
                    onClose();
                  }}
                  className="px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                >
                  Add
                </button>
              </li>
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}
