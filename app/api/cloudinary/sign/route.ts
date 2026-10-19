import { NextResponse } from "next/server";
import { createUploadSignature } from "@/lib/cloudinary";
import { requireAdmin } from "@/lib/auth";

const ALLOWED_FOLDERS = new Set([
    "lucyart/portfolio",
    "lucyart/commissions",
    "lucyart/adoptables",
]);

export async function POST(request: Request) {
    try {
        await requireAdmin();

        const body = (await request.json().catch(() => ({}))) as {
            folder?: string;
        };
        const requestedFolder = body.folder || "lucyart/portfolio";
        const folder = ALLOWED_FOLDERS.has(requestedFolder)
            ? requestedFolder
            : "lucyart/portfolio";

        const signedData = createUploadSignature(folder);
        return NextResponse.json(signedData);
    } catch (error) {
        const message =
            error instanceof Error
                ? error.message
                : "Failed to generate upload signature";
        const status = message.includes("Unauthorized") ? 401 : 500;
        return NextResponse.json({ error: message }, { status });
    }
}
