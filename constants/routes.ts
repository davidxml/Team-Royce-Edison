export const LESSON_ROUTES = {
  root: "/lesson",
  // Helper to generate the path dynamically
  forLevel: (courseId: string, unitId: string, levelId: string) => 
    `/lesson/${courseId}/${unitId}/level/${levelId}`,
  forQuiz: (courseId: string, unitId: string, levelId: string) => 
    `/lesson/${courseId}/${unitId}/level/${levelId}/quiz`,
};

export const DASHBOARD_ROUTES = {
  home: "/dashboard",
  courses: "/courses",
  leaderboard: "/leaderboard",
  profile: "/profile",
};