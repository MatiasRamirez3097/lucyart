"use server";

import { revalidatePath } from "next/cache";
import dbConnect, { isDbConfigured } from "@/lib/mongodb";
import CommissionTierModel from "@/models/CommissionTier";
import InquiryModel from "@/models/Inquiry";
import { CommissionTier, Inquiry, InquiryStatus } from "@/types";

const DEFAULT_TIERS: Omit<CommissionTier, "id">[] = [
    {
        title: "Digital Sketch",
        priceBase: 40,
        description: "Clean sketch with flat colors.",
        features: [
            "1 Character",
            "Bust / Shoulders",
            "Simple Background",
            "Personal Use",
        ],
        exampleImages: [],
        order: 1,
    },
    {
        title: "Full Color Portrait",
        priceBase: 90,
        description: "Fully shaded illustration with detailed eyes.",
        features: [
            "1 Character",
            "Headshot to Bust",
            "Abstract Background",
            "Personal Use",
        ],
        exampleImages: [],
        order: 2,
    },
    {
        title: "Full Body Scene",
        priceBase: 180,
        description: "Complex posing and detailed environment.",
        features: [
            "1 Character (+$80 add.)",
            "Full Body",
            "Complex Background",
            "Personal Use",
        ],
        exampleImages: [],
        order: 3,
    },
];

export async function getCommissionTiers(): Promise<CommissionTier[]> {
    if (!isDbConfigured()) {
        return DEFAULT_TIERS.map((t, index) => ({
            ...t,
            id: `tier-${index + 1}`,
        }));
    }

    try {
        await dbConnect();
        let docs = await CommissionTierModel.find({})
            .sort({ order: 1, createdAt: 1 })
            .lean();

        // Seed initial tiers if collection is empty
        if (docs.length === 0) {
            await CommissionTierModel.insertMany(DEFAULT_TIERS);
            docs = await CommissionTierModel.find({})
                .sort({ order: 1, createdAt: 1 })
                .lean();
        }

        return docs.map((doc) => ({
            id: doc._id.toString(),
            title: doc.title,
            priceBase: doc.priceBase,
            description: doc.description,
            features: doc.features || [],
            exampleImages: doc.exampleImages || [],
            order: doc.order ?? 0,
        }));
    } catch (error) {
        console.error("Error fetching commission tiers:", error);
        return DEFAULT_TIERS.map((t, index) => ({
            ...t,
            id: `tier-${index + 1}`,
        }));
    }
}

export async function saveCommissionTier(formData: FormData): Promise<{
    success: boolean;
    message: string;
}> {
    try {
        await dbConnect();

        const id = (formData.get("id") as string | null)?.trim() || "";
        const title = (formData.get("title") as string | null)?.trim() || "";
        const priceBase = Number(formData.get("priceBase") || 0);
        const description =
            (formData.get("description") as string | null)?.trim() || "";
        const featuresRaw =
            (formData.get("features") as string | null)?.trim() || "";
        const exampleImagesRaw =
            (formData.get("exampleImages") as string | null)?.trim() || "";
        const order = Number(formData.get("order") || 0);

        if (!title || Number.isNaN(priceBase) || priceBase < 0) {
            return {
                success: false,
                message: "Valid Tier Title and Base Price are required.",
            };
        }

        const features = featuresRaw
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean);

        const exampleImages = exampleImagesRaw
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean);

        if (id && !id.startsWith("tier-")) {
            await CommissionTierModel.findByIdAndUpdate(id, {
                title,
                priceBase,
                description,
                features,
                exampleImages,
                order,
            });
        } else {
            await CommissionTierModel.create({
                title,
                priceBase,
                description,
                features,
                exampleImages,
                order,
            });
        }

        revalidatePath("/commissions");
        revalidatePath("/admin");
        revalidatePath("/admin/commissions");
        revalidatePath("/admin/portfolio");

        return {
            success: true,
            message: id
                ? "Commission tier updated!"
                : "New commission tier created!",
        };
    } catch (error) {
        const message =
            error instanceof Error
                ? error.message
                : "Failed to save commission tier.";
        return { success: false, message };
    }
}

export async function deleteCommissionTier(id: string): Promise<{
    success: boolean;
    message: string;
}> {
    try {
        await dbConnect();
        await CommissionTierModel.findByIdAndDelete(id);

        revalidatePath("/commissions");
        revalidatePath("/admin/commissions");

        return { success: true, message: "Commission tier removed." };
    } catch (error) {
        const message =
            error instanceof Error
                ? error.message
                : "Failed to delete commission tier.";
        return { success: false, message };
    }
}

export async function getInquiries(): Promise<Inquiry[]> {
    if (!isDbConfigured()) {
        return [];
    }

    try {
        await dbConnect();
        const docs = await InquiryModel.find({})
            .sort({ createdAt: -1 })
            .lean();

        return docs.map((doc) => ({
            id: doc._id.toString(),
            name: doc.name,
            email: doc.email,
            subject: doc.subject,
            targetItem: doc.targetItem || "",
            message: doc.message,
            status: doc.status,
            createdAt: doc.createdAt
                ? new Date(doc.createdAt).toISOString()
                : new Date().toISOString(),
        }));
    } catch (error) {
        console.error("Error fetching inquiries:", error);
        return [];
    }
}

export async function updateInquiryStatus(
    id: string,
    status: InquiryStatus,
): Promise<{ success: boolean; message: string }> {
    try {
        await dbConnect();
        await InquiryModel.findByIdAndUpdate(id, { status });

        revalidatePath("/admin");
        revalidatePath("/admin/commissions");

        return { success: true, message: `Inquiry marked as ${status}.` };
    } catch (error) {
        const message =
            error instanceof Error
                ? error.message
                : "Failed to update inquiry status.";
        return { success: false, message };
    }
}

export async function deleteInquiry(id: string): Promise<{
    success: boolean;
    message: string;
}> {
    try {
        await dbConnect();
        await InquiryModel.findByIdAndDelete(id);

        revalidatePath("/admin");
        revalidatePath("/admin/commissions");

        return { success: true, message: "Inquiry deleted." };
    } catch (error) {
        const message =
            error instanceof Error
                ? error.message
                : "Failed to delete inquiry.";
        return { success: false, message };
    }
}
