import {
  clerkMiddleware,
  createRouteMatcher,
  clerkClient,
} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/",
  "/explorer",
  "/api/(.*)", // Exclure toutes les routes API de la protection
]);

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }

  // Règles d'accès par type d'utilisateur sur les routes /admin
  if (!isAdminRoute(req)) {
    return;
  }

  const { userId } = await auth();

  if (!userId) {
    return;
  }

  let userType: string | undefined;

  try {
    // `clerkClient` may be an async factory in this @clerk/nextjs version.
    const client = typeof clerkClient === "function" ? await clerkClient() : clerkClient;
    const clerkUser = await client.users.getUser(userId as string);
    const meta =
      (clerkUser.publicMetadata?.userType as string | undefined) ||
      (clerkUser.privateMetadata?.userType as string | undefined);
    userType = meta ? meta.toString().toUpperCase() : undefined;
  } catch (e) {
    console.warn("[middleware] Impossible de lire userType depuis Clerk", e);
  }

  const pathname = req.nextUrl.pathname;

  // MEDICAL : uniquement la vérification des cartes
  if (userType === "MEDICAL" && pathname !== "/admin/explorer") {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/explorer";
    url.search = "";
    return NextResponse.redirect(url);
  }

  // INSURER : tout voir sauf la vérification des cartes
  if (userType === "INSURER" && pathname === "/admin/explorer") {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
