"use server";

import { revalidatePath } from "next/cache";
import dbConnect, { isDbConfigured } from "@/lib/mongodb";
import SiteSettingsModel from "@/models/SiteSettings";
import { requireAdmin } from "@/lib/auth";
import { SiteSettings } from "@/types";

const DEFAULT_SETTINGS: SiteSettings = {
    socialLinks: [
        {
            id: "social-1",
            name: "Twitter / X",
            url: "https://x.com",
            icon: "x",
            enabled: true,
        },
        {
            id: "social-2",
            name: "DeviantArt",
            url: "https://deviantart.com",
            icon: "deviantart",
            enabled: true,
        },
        {
            id: "social-3",
            name: "Instagram",
            url: "https://instagram.com",
            icon: "instagram",
            enabled: true,
        },
        {
            id: "social-4",
            name: "Trello (Status)",
            url: "https://trello.com",
            icon: "trello",
            enabled: true,
        },
    ],
    discord: {
        enabled: true,
        url: "https://discord.com",
        username: "lucyart",
        buttonText: "Chat on Discord",
    },
};

export async function getSiteSettings(): Promise<SiteSettings> {
    if (!isDbConfigured()) {
        return DEFAULT_SETTINGS;
    }

    try {
        await dbConnect();
        let doc = await SiteSettingsModel.findOne({ key: "global" }).lean();

        if (!doc) {
            await SiteSettingsModel.create({
                key: "global",
                socialLinks: DEFAULT_SETTINGS.socialLinks,
                discord: DEFAULT_SETTINGS.discord,
            });
            doc = await SiteSettingsModel.findOne({ key: "global" }).lean();
        }

        if (!doc) {
            return DEFAULT_SETTINGS;
        }

        return {
            socialLinks: (doc.socialLinks || []).map((item, idx) => ({
                id: item.id || `social-${idx + 1}`,
                name: item.name,
                url: item.url,
                icon: item.icon || "🔗",
                enabled: item.enabled ?? true,
            })),
            discord: {
                enabled: doc.discord?.enabled ?? true,
                url: doc.discord?.url || "https://discord.com",
                username: doc.discord?.username || "lucyart",
                buttonText: doc.discord?.buttonText || "Chat on Discord",
            },
        };
    } catch (error) {
        console.error("Error fetching site settings:", error);
        return DEFAULT_SETTINGS;
    }
}

export async function saveSiteSettings(
    settings: SiteSettings,
): Promise<{ success: boolean; message: string }> {
    try {
        await requireAdmin();
        await dbConnect();

        const cleanedLinks = (settings.socialLinks || [])
            .filter((item) => item.name.trim().length > 0)
            .map((item, idx) => ({
                id: item.id || `social-${Date.now()}-${idx}`,
                name: item.name.trim(),
                url: item.url.trim() || "#",
                icon: item.icon.trim() || "🔗",
                enabled: Boolean(item.enabled),
            }));

        const cleanedDiscord = {
            enabled: Boolean(settings.discord?.enabled),
            url: (settings.discord?.url || "").trim() || "https://discord.com",
            username: (settings.discord?.username || "").trim(),
            buttonText:
                (settings.discord?.buttonText || "").trim() ||
                "Chat on Discord",
        };

        await SiteSettingsModel.findOneAndUpdate(
            { key: "global" },
            {
                $set: {
                    socialLinks: cleanedLinks,
                    discord: cleanedDiscord,
                },
            },
            { upsert: true, new: true },
        );

        revalidatePath("/", "layout");
        revalidatePath("/admin");
        revalidatePath("/admin/settings");

        return {
            success: true,
            message: "Social links & Discord settings saved!",
        };
    } catch (error) {
        const message =
            error instanceof Error
                ? error.message
                : "Failed to save site settings.";
        return { success: false, message };
    }
}
