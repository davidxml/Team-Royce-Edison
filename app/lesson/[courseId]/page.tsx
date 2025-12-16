import { createClient } from "@/utils/supabase/server";
import CourseMapClient from "./CourseMapClient";
import Sidebar from "@/components/Sidebar";
import Link from "next/link"; // Needed for the Empty State button

export default async function CoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const supabase = await createClient();
  const { courseId } = await params;

  // --- DEBUG LOGGING START ---
  console.log("🔍 Fetching course:", courseId);
  // --- DEBUG LOGGING END ---

  const { data: { user } } = await supabase.auth.getUser();

  // 1. Fetch Topics (Units)
  // We use a "left join" by default. If lessons are empty, topic still shows.
  const { data: topics, error } = await supabase
    .from("topics")
    .select(`
      id, title, description, color_theme, order_index,
      lessons ( id, title, order_index ),
      user_progress: student_progress ( mastery_score ) 
    `)
    .eq("subject_id", courseId)
    .order("order_index", { ascending: true });

  if (error) {
    console.error("❌ Supabase Error:", error.message);
    return <div className="p-10 text-red-500">Error loading course: {error.message}</div>;
  }

  // --- DEBUG LOGGING ---
  console.log(`✅ Found ${topics?.length || 0} topics.`);
  if (topics && topics.length > 0) {
    console.log(`First topic has ${topics[0].lessons?.length || 0} lessons.`);
    if (topics[0].lessons?.length === 0) {
      console.log("⚠️ WARNING: Topics exist but have NO lessons linked via 'topic_id'.");
    }
  }
  // ---------------------

  // 2. Fetch User Progress
  const { data: completedLessons } = await supabase
    .from("user_lesson_states")
    .select("lesson_id, status")
    .eq("user_id", user?.id);

  const completedSet = new Set(completedLessons?.map((l) => l.lesson_id));

  // 3. Transform Data
  let foundActive = false;
  const units = (topics || []).map((topic) => {
    // Sort lessons (handle null/undefined safely)
    const sortedLessons = (topic.lessons || []).sort((a: any, b: any) => a.order_index - b.order_index);

    const levels = sortedLessons.map((lesson: any) => {
      const isCompleted = completedSet.has(lesson.id);
      let status = "locked";

      if (isCompleted) {
        status = "completed";
      } else if (!foundActive) {
        status = "current";
        foundActive = true;
      }

      return {
        id: lesson.id,
        order_index: lesson.order_index,
        status,
        stars: 0,
      };
    });

    // If unit has no lessons, force at least one level to show UI (Optional Debug Hack)
    if (levels.length === 0) {
       levels.push({ id: "debug-1", order_index: 1, status: "current", stars: 0 });
    } 
    

    return {
      id: topic.id,
      title: topic.title,
      description: topic.description || "No description",
      color_theme: topic.color_theme || "bg-[#4854F6]",
      levels,
    };
  });

  return (
    <div className="flex">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <div className="flex-1">
        {units.length > 0 ? (
           <CourseMapClient units={units} courseId={courseId} />
        ) : (
          /* EMPTY STATE UI */
          <div className="flex flex-col items-center justify-center min-h-screen text-center p-8">
            <h2 className="text-2xl font-bold text-gray-700 mb-2">This course is empty!</h2>
            <p className="text-gray-500 mb-6">
              We couldn't find any Units or Lessons for Course ID: <code className="bg-gray-100 p-1 rounded">{courseId}</code>
            </p>
            <div className="bg-blue-50 p-4 rounded-xl text-left text-sm text-blue-800 border border-blue-200">
               <strong>Troubleshooting:</strong>
               <ul className="list-disc pl-5 mt-2 space-y-1">
                 <li>Check your <code>topics</code> table. Do any have <code>subject_id</code> matching this ID?</li>
                 <li>Check your <code>lessons</code> table. Did you link them to topics using <code>topic_id</code>?</li>
               </ul>
            </div>
            <Link href="/dashboard" className="mt-8 text-blue-500 font-bold hover:underline">
              ← Go back to Dashboard
            </Link>
          </div>
          )}
      </div>
    </div>
  );
}