import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/(.*)"]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
});

export const config = { matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"] };

/* import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/sign-in(.*)"]);

export default clerkMiddleware((auth, req) => {
  const userAuth = auth();

  if (!userAuth.userId && !isPublicRoute(req)) {
    userAuth.protect();
  }
}); */

/* export default clerkMiddleware((auth, req) => {
  const userAuth = auth();  

  if(userAuth.userId && isPublicRoute(req)) {
    let path = "/select-org";

    if (userAuth.orgId) {
      path = `/organization/${userAuth.orgId}`;
    }

    const orgSelection = new URL(path, req.url);
    return NextResponse.redirect(orgSelection);
  }

  if(!userAuth.userId && !isPublicRoute(req)) {
    userAuth.protect()
  }

  if(userAuth.userId && !userAuth.orgId && req.nextUrl.pathname !== "/select-org") {
    const orgSelection = new URL("/select-org", userAuth.orgId)
    return NextResponse.redirect(orgSelection)
  }
}); */
/* 
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}; */
