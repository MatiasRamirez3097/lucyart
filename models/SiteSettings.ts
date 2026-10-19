import mongoose, { Schema, Model } from "mongoose";
import { DiscordConfig, SocialLinkItem } from "@/types";

export interface ISiteSettingsDocument {
    _id: mongoose.Types.ObjectId;
    key: string;
    socialLinks: SocialLinkItem[];
    discord: DiscordConfig;
    updatedAt: Date;
}

const SocialLinkSubSchema = new Schema<SocialLinkItem>(
    {
        id: { type: String, required: true },
        name: { type: String, required: true, trim: true },
        url: { type: String, required: true, trim: true },
        icon: { type: String, default: "🔗" },
        enabled: { type: Boolean, default: true },
    },
    { _id: false },
);

const DiscordSubSchema = new Schema<DiscordConfig>(
    {
        enabled: { type: Boolean, default: true },
        url: { type: String, default: "https://discord.com", trim: true },
        username: { type: String, default: "lucyart", trim: true },
        buttonText: { type: String, default: "Chat on Discord", trim: true },
    },
    { _id: false },
);

const SiteSettingsSchema = new Schema<ISiteSettingsDocument>(
    {
        key: {
            type: String,
            default: "global",
            unique: true,
            index: true,
        },
        socialLinks: {
            type: [SocialLinkSubSchema],
            default: [],
        },
        discord: {
            type: DiscordSubSchema,
            default: () => ({
                enabled: true,
                url: "https://discord.com",
                username: "lucyart",
                buttonText: "Chat on Discord",
            }),
        },
    },
    {
        timestamps: true,
    },
);

const SiteSettingsModel: Model<ISiteSettingsDocument> =
    (mongoose.models.SiteSettings as Model<ISiteSettingsDocument>) ||
    mongoose.model<ISiteSettingsDocument>("SiteSettings", SiteSettingsSchema);

export default SiteSettingsModel;
