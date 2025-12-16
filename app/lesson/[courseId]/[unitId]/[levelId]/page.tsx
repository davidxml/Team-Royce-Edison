import { createClient } from "@/utils/supabase/server";
import { generateLessonContent } from "@/app/actions/generateLessonContent";
import LessonClient from "./LessonClient";
// Make sure you import the component correctly

export default async function Page({
  params,
}: {
  params: Promise<{ courseId: string; unitId: string; levelId: string }>;
}) {
  // 1. Await params (Next.js 15+ requirement)
  const { courseId, unitId, levelId } = await params;

  // 2. Await the Supabase client (Next.js 15+ requirement)
  // The error "supabase.from is not a function" happens because 'supabase' was a Promise here.
  const supabase = await createClient(); 

  // 3. Now you can use .from()
  const { data: topic } = await supabase
    .from("topics")
    .select("title")
    .eq("id", unitId)
    .single();

  const slides = await generateLessonContent(levelId, topic?.title || "General");

  // Define navigation URLs
  const nextUrl = `/lesson/${courseId}/${unitId}/level/${levelId}/quiz`;
  const backUrl = "/dashboard";

  return (
    <LessonClient 
      slides={slides} 
      nextUrl={nextUrl}
      backUrl={backUrl} 
    />
  );
}