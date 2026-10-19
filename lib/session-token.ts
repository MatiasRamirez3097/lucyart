import { SessionUser } from "@/types";

export const SESSION_COOKIE_NAME = "lucyart_session";
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function getSecretKey(): string {
    return (
        process.env.AUTH_SECRET ||
        process.env.CLOUDINARY_API_SECRET ||
        "lucyart-dev-fallback-secret-change-in-production"
    );
}

function toBase64Url(bytes: Uint8Array): string {
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
}

function fromBase64Url(base64Url: string): Uint8Array {
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
        base64.length + ((4 - (base64.length % 4)) % 4),
        "=",
    );
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
}

async function getHmacKey(secret: string): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    return crypto.subtle.importKey(
        "raw",
        encoder.encode(secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign", "verify"],
    );
}

export async function signSessionToken(
    user: Omit<SessionUser, "expiresAt">,
): Promise<{ token: string; expiresAt: Date }> {
    const expiresAtMs = Date.now() + SESSION_DURATION_MS;
    const payload: SessionUser = {
        ...user,
        expiresAt: expiresAtMs,
    };

    const encoder = new TextEncoder();
    const payloadBytes = encoder.encode(JSON.stringify(payload));
    const payloadB64 = toBase64Url(payloadBytes);

    const key = await getHmacKey(getSecretKey());
    const signatureBuffer = await crypto.subtle.sign(
        "HMAC",
        key,
        encoder.encode(payloadB64),
    );
    const signatureB64 = toBase64Url(new Uint8Array(signatureBuffer));

    return {
        token: `${payloadB64}.${signatureB64}`,
        expiresAt: new Date(expiresAtMs),
    };
}

export async function verifySessionToken(
    token?: string,
): Promise<SessionUser | null> {
    if (!token || !token.includes(".")) {
        return null;
    }

    try {
        const [payloadB64, signatureB64] = token.split(".");
        if (!payloadB64 || !signatureB64) return null;

        const encoder = new TextEncoder();
        const key = await getHmacKey(getSecretKey());
        const signatureBytes = fromBase64Url(signatureB64);

        const isValid = await crypto.subtle.verify(
            "HMAC",
            key,
            signatureBytes as BufferSource,
            encoder.encode(payloadB64),
        );

        if (!isValid) return null;

        const payloadJson = new TextDecoder().decode(
            fromBase64Url(payloadB64),
        );
        const session = JSON.parse(payloadJson) as SessionUser;

        if (!session.expiresAt || Date.now() > session.expiresAt) {
            return null;
        }

        return session;
    } catch {
        return null;
    }
}
