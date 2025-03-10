import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { NextResponse } from "next/server";

const publicRoutes = [
  "/",
  "/login",
  "/register",
  "/reset-password",
  "/send-reset-password",
  "/api/auth/verify-email",
  "/api/auth/send-verify-email",
  "/api/auth/reset-password",
  "/api/auth/send-reset-password",
];

const { auth: middleware } = NextAuth(authConfig);

export default middleware((req) => {
  const { nextUrl, auth } = req;
  const isLoggedIn = !!auth?.user;

  if ("/" === nextUrl.pathname) {
    return NextResponse.next();
  }

  if (publicRoutes.includes(nextUrl.pathname) && isLoggedIn) {
    return NextResponse.redirect(new URL("/alzu", nextUrl));
  }

  //proteger / dashboard /admin
  if (!publicRoutes.includes(nextUrl.pathname) && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
