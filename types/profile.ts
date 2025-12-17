export type UserProfile = {
  id: string;
  clerk_id: string;
  full_name: string | null;
  class_id: string | null;
  role: "student" | "teacher" | "parent";
};