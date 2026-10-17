import { NextResponse } from "next/server";
import { createUploadSignature } from "@/lib/cloudinary";

const ALLOWED_FOLDERS = new Set([
    "lucyart/portfolio",
    "lucyart/commissions",
    "lucyart/adoptables",
]);

export async function POST(request: Request) {
    try {
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
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
