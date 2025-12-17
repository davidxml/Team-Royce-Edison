import { supabase } from "./supabase";

export const updateProgress = async (
  topicId: string,
  userId: string,
) => {
  const { data, error } = await supabase
    .from("student_progress")
    .upsert({
      topic_id: topicId,
      user_id: userId,
      completed: true,
      last_attempt: new Date().toISOString(),
    },{
      onConflict: "topic_id,user_id",
    })
    .select()
    .single();


  if (error) {
    console.error("Error updating progress:", error);
    throw error;
  }

  return data;
};