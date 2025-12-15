"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Course {
  id: string;
  title: string;
  grade: number;
}

interface AddCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const dummyCourses: Course[] = [
  { id: "1", title: "Mathematics", grade: 1 },
  { id: "2", title: "English Language", grade: 1 },
  { id: "3", title: "Geography", grade: 2 },
  { id: "4", title: "Geography", grade: 3 },
  { id: "5", title: "Geography", grade: 4 },
  { id: "6", title: "Geography", grade: 5 },
  { id: "7", title: "Geography", grade: 6 },
  { id: "8", title: "Geography", grade: 7 },
  { id: "9", title: "Geography", grade: 8 },
  { id: "10", title: "Geography", grade: 9 },
  { id: "11", title: "Geography", grade: 10 },
  { id: "12", title: "Geography", grade: 11 },
  { id: "13", title: "Geography", grade: 12 },
];

const coursesByGrade = dummyCourses.reduce((acc, course) => {
  if (!acc[course.grade]) {
    acc[course.grade] = [];
  }
  acc[course.grade].push(course);
  return acc;
}, {} as Record<number, Course[]>);

export function AddCourseModal({ isOpen, onClose }: AddCourseModalProps) {
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);

  const handleSelectCourse = (courseId: string) => {
    setSelectedCourses((prevSelected) => {
      if (prevSelected.includes(courseId)) {
        return prevSelected.filter((id) => id !== courseId);
      } else {
        return [...prevSelected, courseId];
      }
    });
  };

  const handleSave = () => {
    console.log("Selected courses:", selectedCourses);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a Course</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          {Object.entries(coursesByGrade).map(([grade, courses]) => (
            <div key={grade}>
              <h3 className="mb-2 text-lg font-semibold">Grade {grade}</h3>
              <ul className="space-y-2">
                {courses.map((course) => (
                  <li
                    key={course.id}
                    className="flex items-center justify-between p-2 border rounded-lg"
                  >
                    <div>
                      <p className="font-semibold">{course.title}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedCourses.includes(course.id)}
                      onChange={() => handleSelectCourse(course.id)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <DialogFooter>
          <button
            onClick={handleSave}
            className="px-4 py-2 mt-4 text-sm font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            Save
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
