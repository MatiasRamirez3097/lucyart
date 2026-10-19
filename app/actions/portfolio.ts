"use server";

import { revalidatePath } from "next/cache";
import dbConnect, { isDbConfigured } from "@/lib/mongodb";
import PortfolioItemModel from "@/models/PortfolioItem";
import CommissionTierModel from "@/models/CommissionTier";
import { deleteFromCloudinary } from "@/lib/cloudinary";
import { requireAdmin } from "@/lib/auth";
import { PortfolioItem } from "@/types";

const FALLBACK_PORTFOLIO: PortfolioItem[] = [
    {
        id: "p1",
        title: "Cyberpunk Girl",
        category: "Full Body",
        imageUrl: "https://via.placeholder.com/400x500",
        description: "Neon street samurai illustration with glowing katana.",
        isCommission: true,
        clientName: "@NeonValkyrie",
        featured: true,
    },
    {
        id: "p2",
        title: "Fantasy Landscape",
        category: "Scene",
        imageUrl: "https://via.placeholder.com/600x400",
        description: "Celestial shrine floating above bioluminescent clouds.",
        isCommission: false,
        featured: true,
    },
    {
        id: "p3",
        title: "Starlight VTuber Bust",
        category: "Bust",
        imageUrl: "https://via.placeholder.com/400x400",
        description: "Detailed idol portrait with holographic hair highlights.",
        isCommission: true,
        clientName: "@StarVT",
        featured: false,
    },
    {
        id: "p4",
        title: "Chibi Paladin",
        category: "Chibi",
        imageUrl: "https://via.placeholder.com/400x500",
        description: "Cute armored chibi mascot for stream alerts.",
        isCommission: true,
        clientName: "@PalaStream",
        featured: false,
    },
];

export async function getPortfolioItems(): Promise<PortfolioItem[]> {
    if (!isDbConfigured()) {
        return FALLBACK_PORTFOLIO;
    }

    try {
        await dbConnect();
        const docs = await PortfolioItemModel.find({})
            .sort({ createdAt: -1 })
            .lean();

        return docs.map((doc) => ({
            id: doc._id.toString(),
            title: doc.title,
            category: doc.category,
            imageUrl: doc.imageUrl,
            publicId: doc.publicId || "",
            description: doc.description || "",
            isCommission: Boolean(doc.isCommission),
            clientName: doc.clientName || "",
            commissionTierId: doc.commissionTierId || "",
            featured: Boolean(doc.featured),
            createdAt: doc.createdAt
                ? new Date(doc.createdAt).toISOString()
                : undefined,
        }));
    } catch (error) {
        console.error("Error fetching portfolio items:", error);
        return FALLBACK_PORTFOLIO;
    }
}

export async function savePortfolioItem(formData: FormData): Promise<{
    success: boolean;
    message: string;
}> {
    try {
        await requireAdmin();
        await dbConnect();

        const id = (formData.get("id") as string | null)?.trim() || "";
        const title = (formData.get("title") as string | null)?.trim() || "";
        const category =
            (formData.get("category") as string | null)?.trim() || "Full Body";
        const imageUrl =
            (formData.get("imageUrl") as string | null)?.trim() || "";
        const publicId =
            (formData.get("publicId") as string | null)?.trim() || "";
        const description =
            (formData.get("description") as string | null)?.trim() || "";
        const isCommission = formData.get("isCommission") === "true";
        const clientName =
            (formData.get("clientName") as string | null)?.trim() || "";
        const commissionTierId =
            (formData.get("commissionTierId") as string | null)?.trim() || "";
        const featured = formData.get("featured") === "true";

        if (!title || !imageUrl) {
            return {
                success: false,
                message: "Title and Artwork Image are required.",
            };
        }

        if (id) {
            const existing = await PortfolioItemModel.findById(id);
            if (!existing) {
                return {
                    success: false,
                    message: "Portfolio item not found.",
                };
            }

            // If image was replaced, remove old one from Cloudinary
            if (
                existing.publicId &&
                publicId &&
                existing.publicId !== publicId
            ) {
                await deleteFromCloudinary(existing.publicId);
            }

            existing.title = title;
            existing.category = category;
            existing.imageUrl = imageUrl;
            existing.publicId = publicId;
            existing.description = description;
            existing.isCommission = isCommission;
            existing.clientName = isCommission ? clientName : "";
            existing.commissionTierId = isCommission ? commissionTierId : "";
            existing.featured = featured;
            await existing.save();
        } else {
            await PortfolioItemModel.create({
                title,
                category,
                imageUrl,
                publicId,
                description,
                isCommission,
                clientName: isCommission ? clientName : "",
                commissionTierId: isCommission ? commissionTierId : "",
                featured,
            });
        }

        // If linked to a Commission Tier, add imageUrl to that tier's exampleImages
        if (isCommission && commissionTierId && imageUrl) {
            await CommissionTierModel.findByIdAndUpdate(commissionTierId, {
                $addToSet: { exampleImages: imageUrl },
            }).catch(() => null);
        }

        revalidatePath("/");
        revalidatePath("/portfolio");
        revalidatePath("/commissions");
        revalidatePath("/admin");
        revalidatePath("/admin/portfolio");
        revalidatePath("/admin/commissions");

        return {
            success: true,
            message: id
                ? "Portfolio artwork updated successfully!"
                : "Artwork added to portfolio!",
        };
    } catch (error) {
        const message =
            error instanceof Error
                ? error.message
                : "Failed to save portfolio item.";
        return { success: false, message };
    }
}

export async function deletePortfolioItem(id: string): Promise<{
    success: boolean;
    message: string;
}> {
    try {
        await requireAdmin();
        await dbConnect();
        const item = await PortfolioItemModel.findById(id);

        if (!item) {
            return { success: false, message: "Item not found." };
        }

        if (item.publicId) {
            await deleteFromCloudinary(item.publicId);
        }

        // Also remove from any CommissionTier exampleImages if linked
        if (item.imageUrl) {
            await CommissionTierModel.updateMany(
                { exampleImages: item.imageUrl },
                { $pull: { exampleImages: item.imageUrl } },
            ).catch(() => null);
        }

        await item.deleteOne();

        revalidatePath("/");
        revalidatePath("/portfolio");
        revalidatePath("/commissions");
        revalidatePath("/admin");
        revalidatePath("/admin/portfolio");

        return { success: true, message: "Artwork deleted." };
    } catch (error) {
        const message =
            error instanceof Error
                ? error.message
                : "Failed to delete artwork.";
        return { success: false, message };
    }
}
