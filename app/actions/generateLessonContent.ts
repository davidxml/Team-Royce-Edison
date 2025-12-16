"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@/utils/supabase/server";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

export async function generateLessonContent(lessonId: string, topicTitle: string) {
  // 1. Setup Supabase
  const supabase = await createClient();

  // 2. Check DB first (Cache check)
  const { data: lesson } = await supabase
    .from("lessons")
    .select("slides, title")
    .eq("id", lessonId)
    .single();

  if (lesson?.slides) {
    return lesson.slides;
  }

  // 3. Generate with Gemini
  try {
    const prompt = `
      You are an educational content generator for Nigerian students.
      Create structured slide content for a lesson titled "${lesson?.title || "Lesson"}" 
      within the topic "${topicTitle}".
      
      Style: Fun, bite-sized, Duolingo-style. Use relevant emojis.
      
      Return ONLY valid JSON. Do not wrap it in markdown code blocks.
      The structure must be:
      {
        "slides": [
          { "type": "intro", "title": "...", "content": "...", "emoji": "👋" },
          { "type": "concept", "title": "...", "content": "...", "emoji": "💡" },
          { "type": "example", "title": "...", "content": "...", "emoji": "🧪" }
        ]
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // CLEANUP: Remove markdown formatting if Gemini adds it (e.g. ```json ... ```)
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    const generatedData = JSON.parse(text);

    // 4. Save to DB
    await supabase
      .from("lessons")
      .update({ slides: generatedData.slides })
      .eq("id", lessonId);

    return generatedData.slides;

  } catch (error: any) {
    console.error("Gemini AI Error:", error);

    // Fallback Mock Data so your app never crashes
    return [
      {
        type: "error",
        title: "AI Generation Failed",
        content: "We are having trouble connecting to the brain. Here is some offline content.",
        emoji: "🤖"
      },
      {
        type: "intro",
        title: "Welcome (Offline Mode)",
        content: "This is placeholder content to verify your UI works while the AI is resting.",
        emoji: "🔌"
      }
    ];
  }
}