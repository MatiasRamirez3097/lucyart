import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
    SESSION_COOKIE_NAME,
    verifySessionToken,
} from "@/lib/session-token";

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const session = await verifySessionToken(token);

    // Protect all /admin routes: require authenticated user with role === "admin"
    if (pathname.startsWith("/admin")) {
        if (!session) {
            const loginUrl = new URL("/login", request.url);
            loginUrl.searchParams.set("callbackUrl", pathname);
            return NextResponse.redirect(loginUrl);
        }

        if (session.role !== "admin") {
            // Future client role attempting to access admin backoffice
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    // Redirect authenticated admins away from /login straight to /admin
    if (pathname === "/login" && session) {
        if (session.role === "admin") {
            return NextResponse.redirect(new URL("/admin", request.url));
        }
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/login"],
};
