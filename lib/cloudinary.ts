import crypto from "crypto";

export interface CloudinarySignResult {
    signature: string;
    timestamp: number;
    cloudName: string;
    apiKey: string;
    folder: string;
}

export function getCloudinaryConfig() {
    const cloudName =
        process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
        process.env.CLOUDINARY_CLOUD_NAME ||
        "";
    const apiKey = process.env.CLOUDINARY_API_KEY || "";
    const apiSecret = process.env.CLOUDINARY_API_SECRET || "";

    return {
        cloudName,
        apiKey,
        apiSecret,
        isConfigured: Boolean(cloudName && apiKey && apiSecret),
    };
}

/**
 * Generates a SHA-1 signature for Cloudinary signed uploads.
 * Parameters must be sorted alphabetically before appending the API secret.
 */
export function signCloudinaryParams(
    params: Record<string, string | number>,
    apiSecret: string,
): string {
    const sortedQuery = Object.keys(params)
        .filter(
            (key) =>
                params[key] !== undefined &&
                params[key] !== null &&
                params[key] !== "",
        )
        .sort()
        .map((key) => `${key}=${params[key]}`)
        .join("&");

    return crypto
        .createHash("sha1")
        .update(`${sortedQuery}${apiSecret}`)
        .digest("hex");
}

export function createUploadSignature(
    folder = "lucyart/portfolio",
): CloudinarySignResult {
    const { cloudName, apiKey, apiSecret, isConfigured } =
        getCloudinaryConfig();

    if (!isConfigured) {
        throw new Error(
            "Cloudinary credentials are not configured. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.",
        );
    }

    const timestamp = Math.round(Date.now() / 1000);
    const signature = signCloudinaryParams({ folder, timestamp }, apiSecret);

    return {
        signature,
        timestamp,
        cloudName,
        apiKey,
        folder,
    };
}

/**
 * Deletes an uploaded image from Cloudinary using its public_id.
 */
export async function deleteFromCloudinary(publicId?: string): Promise<boolean> {
    if (!publicId) return false;

    const { cloudName, apiKey, apiSecret, isConfigured } =
        getCloudinaryConfig();
    if (!isConfigured) return false;

    try {
        const timestamp = Math.round(Date.now() / 1000);
        const signature = signCloudinaryParams(
            { public_id: publicId, timestamp },
            apiSecret,
        );

        const formData = new URLSearchParams();
        formData.append("public_id", publicId);
        formData.append("timestamp", String(timestamp));
        formData.append("api_key", apiKey);
        formData.append("signature", signature);

        const res = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
            {
                method: "POST",
                body: formData,
            },
        );

        if (!res.ok) return false;
        const data = (await res.json()) as { result?: string };
        return data.result === "ok";
    } catch (error) {
        console.error("Failed to delete image from Cloudinary:", error);
        return false;
    }
}
