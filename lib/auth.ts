import crypto from "crypto";
import { cookies } from "next/headers";
import { SessionUser } from "@/types";
import {
    SESSION_COOKIE_NAME,
    signSessionToken,
    verifySessionToken,
} from "@/lib/session-token";

export function hashPassword(password: string): string {
    const salt = crypto.randomBytes(16).toString("hex");
    const derivedKey = crypto.scryptSync(password, salt, 64).toString("hex");
    return `${salt}:${derivedKey}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
    const [salt, keyHex] = storedHash.split(":");
    if (!salt || !keyHex) return false;

    const keyBuffer = Buffer.from(keyHex, "hex");
    const derivedBuffer = crypto.scryptSync(password, salt, 64);

    if (keyBuffer.length !== derivedBuffer.length) return false;
    return crypto.timingSafeEqual(keyBuffer, derivedBuffer);
}

export async function createSessionCookie(
    user: Omit<SessionUser, "expiresAt">,
): Promise<void> {
    const { token, expiresAt } = await signSessionToken(user);
    const cookieStore = await cookies();

    cookieStore.set(SESSION_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        expires: expiresAt,
        path: "/",
    });
}

export async function clearSessionCookie(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getSession(): Promise<SessionUser | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    return verifySessionToken(token);
}

export async function requireAuth(): Promise<SessionUser> {
    const session = await getSession();
    if (!session) {
        throw new Error("Authentication required. Please log in.");
    }
    return session;
}

export async function requireAdmin(): Promise<SessionUser> {
    const session = await getSession();
    if (!session || session.role !== "admin") {
        throw new Error("Unauthorized: Administrator access required.");
    }
    return session;
}
