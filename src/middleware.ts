import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define protected routes
const isProtectedRoute = createRouteMatcher(['/CodeEditor']);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) {
    auth(); // Enforce authentication
  }
});

export const config = {
  matcher: [
    // Protect specific routes dynamically
    '/CodeEditor',
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
