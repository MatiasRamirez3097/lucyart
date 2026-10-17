"use server";

import { revalidatePath } from "next/cache";
import dbConnect, { isDbConfigured } from "@/lib/mongodb";
import AdoptableModel from "@/models/Adoptable";
import { deleteFromCloudinary } from "@/lib/cloudinary";
import { Adoptable, AdoptableStatus } from "@/types";

const FALLBACK_ADOPTABLES: Adoptable[] = [
    {
        id: "1",
        title: "Starlight Mage",
        price: 85,
        status: "available",
        description:
            "Includes full character sheet, high-res PNG, and commercial rights.",
        imageUrl: "https://via.placeholder.com/300x400",
    },
    {
        id: "2",
        title: "Cyber Neko",
        price: 120,
        status: "sold",
        description:
            "Vibrant cyberpunk style character design. Sold to @User123.",
        imageUrl: "https://via.placeholder.com/300x400",
    },
    {
        id: "3",
        title: "Forest Spirit",
        price: 65,
        status: "pending",
        description: "On hold. Waiting for payment confirmation.",
        imageUrl: "https://via.placeholder.com/300x400",
    },
];

export async function getAdoptables(): Promise<Adoptable[]> {
    if (!isDbConfigured()) {
        return FALLBACK_ADOPTABLES;
    }

    try {
        await dbConnect();
        const docs = await AdoptableModel.find({})
            .sort({ createdAt: -1 })
            .lean();

        return docs.map((doc) => ({
            id: doc._id.toString(),
            title: doc.title,
            price: doc.price,
            status: doc.status,
            description: doc.description,
            imageUrl: doc.imageUrl,
            publicId: doc.publicId || "",
            owner: doc.owner || "",
            createdAt: doc.createdAt
                ? new Date(doc.createdAt).toISOString()
                : undefined,
        }));
    } catch (error) {
        console.error("Error fetching adoptables:", error);
        return FALLBACK_ADOPTABLES;
    }
}

export async function saveAdoptable(formData: FormData): Promise<{
    success: boolean;
    message: string;
}> {
    try {
        await dbConnect();

        const id = (formData.get("id") as string | null)?.trim() || "";
        const title = (formData.get("title") as string | null)?.trim() || "";
        const price = Number(formData.get("price") || 0);
        const status = ((formData.get("status") as string | null)?.trim() ||
            "available") as AdoptableStatus;
        const description =
            (formData.get("description") as string | null)?.trim() || "";
        const imageUrl =
            (formData.get("imageUrl") as string | null)?.trim() || "";
        const publicId =
            (formData.get("publicId") as string | null)?.trim() || "";
        const owner = (formData.get("owner") as string | null)?.trim() || "";

        if (!title || !imageUrl || Number.isNaN(price) || price < 0) {
            return {
                success: false,
                message: "Title, valid Price, and Image are required.",
            };
        }

        if (id && id.length >= 12) {
            const existing = await AdoptableModel.findById(id);
            if (!existing) {
                return { success: false, message: "Adoptable not found." };
            }

            if (
                existing.publicId &&
                publicId &&
                existing.publicId !== publicId
            ) {
                await deleteFromCloudinary(existing.publicId);
            }

            existing.title = title;
            existing.price = price;
            existing.status = status;
            existing.description = description;
            existing.imageUrl = imageUrl;
            existing.publicId = publicId;
            existing.owner = owner;
            await existing.save();
        } else {
            await AdoptableModel.create({
                title,
                price,
                status,
                description,
                imageUrl,
                publicId,
                owner,
            });
        }

        revalidatePath("/");
        revalidatePath("/adoptables");
        revalidatePath("/admin");
        revalidatePath("/admin/adoptables");

        return {
            success: true,
            message: id
                ? "Adoptable updated successfully!"
                : "New adoptable created!",
        };
    } catch (error) {
        const message =
            error instanceof Error
                ? error.message
                : "Failed to save adoptable.";
        return { success: false, message };
    }
}

export async function updateAdoptableStatus(
    id: string,
    status: AdoptableStatus,
): Promise<{ success: boolean; message: string }> {
    try {
        await dbConnect();
        await AdoptableModel.findByIdAndUpdate(id, { status });

        revalidatePath("/");
        revalidatePath("/adoptables");
        revalidatePath("/admin");
        revalidatePath("/admin/adoptables");

        return {
            success: true,
            message: `Adoptable status updated to ${status}.`,
        };
    } catch (error) {
        const message =
            error instanceof Error
                ? error.message
                : "Failed to update status.";
        return { success: false, message };
    }
}

export async function deleteAdoptable(id: string): Promise<{
    success: boolean;
    message: string;
}> {
    try {
        await dbConnect();
        const item = await AdoptableModel.findById(id);
        if (!item) {
            return { success: false, message: "Adoptable not found." };
        }

        if (item.publicId) {
            await deleteFromCloudinary(item.publicId);
        }

        await item.deleteOne();

        revalidatePath("/");
        revalidatePath("/adoptables");
        revalidatePath("/admin");
        revalidatePath("/admin/adoptables");

        return { success: true, message: "Adoptable deleted." };
    } catch (error) {
        const message =
            error instanceof Error
                ? error.message
                : "Failed to delete adoptable.";
        return { success: false, message };
    }
}
