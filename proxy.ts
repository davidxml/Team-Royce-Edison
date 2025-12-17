import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define a matcher for routes under /auth/*
const isAuthRoute = createRouteMatcher(['/auth(.*)']);

export default clerkMiddleware(async (auth, req) => {
  // Protect all routes matching /auth/*
  if (isAuthRoute(req)) {
    await auth.protect(); // Redirects unauthenticated users to the sign-in page
  }
}); 

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};