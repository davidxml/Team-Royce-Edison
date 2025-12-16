"use server";

import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

export async function generateCourseStructure(
  topic: string,
  level: string,
  userId: string
) {
  // 1. Create the Course in Supabase
  const { data: course } = await supabase
    .from("courses")
    .insert({ title: `${topic} for ${level}`, user_id: userId })
    .select()
    .single();

  if (!course) throw new Error("Failed to create course");

  // 2. Prompt AI for the Structure (NERDC Curriculum)
  const prompt = `
    You are an expert Nigerian teacher using the NERDC curriculum.
    Create a structured syllabus for the subject: "${topic}" for level: "${level}" (e.g., JSS1, SS3).
    
    Output strictly in this JSON format:
    {
      "units": [
        {
          "title": "Unit Title",
          "description": "Short description",
          "lessons": [
            { "title": "Lesson 1 Title" },
            { "title": "Lesson 2 Title" }
          ]
        }
      ]
    }
    Create exactly 3 units, with 3 lessons each.
  `;

  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: "You are a helpful JSON generator." },
      { role: "user", content: prompt },
    ],
    model: "gpt-3.5-turbo-012", // Cost-effective
    response_format: { type: "json_object" },
  });

  const structure = JSON.parse(completion.choices[0].message.content!);

  // 3. Insert into Supabase (Batch Insert is better, but loop is easier to read)
  let unitIndex = 0;
  for (const unitData of structure.units) {
    unitIndex++;

    // Insert Unit
    const { data: unit } = await supabase
      .from("units")
      .insert({
        course_id: course.id,
        title: unitData.title,
        order_index: unitIndex,
      })
      .select()
      .single();

    // Insert Lessons for this Unit
    const lessonsPayload = unitData.lessons.map((l: any, i: number) => ({
      unit_id: unit!.id,
      title: l.title,
      order_index: i + 1,
      type: "lesson", // Default to lesson, you can add a quiz at the end manually
    }));

    await supabase.from("lessons").insert(lessonsPayload);
  }

  return course.id;
}
