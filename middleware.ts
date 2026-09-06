import { NextResponse, type NextRequest } from "next/server";
import {
  ATTR_COOKIE,
  ATTR_MAX_AGE,
  isSocialReferrer,
  mergeAttribution,
  parseAttribution,
  touchFromRequest,
} from "./lib/attribution";

function isPagePath(pathname: string): boolean {
  if (pathname.startsWith("/_next")) return false;
  if (pathname.startsWith("/api")) return false;
  if (pathname.startsWith("/fonts")) return false;
  if (pathname === "/favicon.ico" || pathname === "/icon.svg") return false;
  if (/\.[a-zA-Z0-9]+$/.test(pathname)) return false;
  return true;
}

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  if (request.method !== "GET" || !isPagePath(request.nextUrl.pathname)) {
    return response;
  }

  const referrer = request.headers.get("referer") || "";
  const incoming = touchFromRequest(request.nextUrl, referrer);
  if (!incoming) {
    return response;
  }

  if (
    !incoming.source &&
    !incoming.campaign &&
    !isSocialReferrer(referrer)
  ) {
    return response;
  }

  const existing = parseAttribution(request.cookies.get(ATTR_COOKIE)?.value);
  const vid = existing?.vid || crypto.randomUUID();
  const { attr, isNewLanding } = mergeAttribution(existing, incoming, vid);

  response.cookies.set(ATTR_COOKIE, JSON.stringify(attr), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ATTR_MAX_AGE,
  });

  if (isNewLanding) {
    console.log(
      "[attr]",
      JSON.stringify({
        event: "landing",
        vid: attr.vid,
        source: attr.last.source,
        medium: attr.last.medium,
        campaign: attr.last.campaign,
        content: attr.last.content,
        referrer: attr.last.referrer,
        path: attr.last.path,
      })
    );
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
