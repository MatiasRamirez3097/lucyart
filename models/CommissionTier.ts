import mongoose, { Schema, Model } from "mongoose";
import { CommissionTierStatus } from "@/types";

export interface ICommissionTierDocument {
    _id: mongoose.Types.ObjectId;
    title: string;
    priceBase: number;
    status: CommissionTierStatus;
    categoryMatch?: string;
    description: string;
    features: string[];
    exampleImages: string[];
    isNsfw: boolean;
    nsfwAvailable: boolean;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}

const CommissionTierSchema = new Schema<ICommissionTierDocument>(
    {
        title: {
            type: String,
            required: [true, "Tier title is required"],
            trim: true,
        },
        priceBase: {
            type: Number,
            required: [true, "Base price is required"],
            min: 0,
        },
        status: {
            type: String,
            enum: ["open", "waitlist", "closed"],
            default: "open",
        },
        categoryMatch: {
            type: String,
            default: "",
            trim: true,
        },
        description: {
            type: String,
            required: [true, "Description is required"],
            trim: true,
        },
        features: {
            type: [String],
            default: [],
        },
        exampleImages: {
            type: [String],
            default: [],
        },
        isNsfw: {
            type: Boolean,
            default: false,
        },
        nsfwAvailable: {
            type: Boolean,
            default: false,
        },
        order: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    },
);

const CommissionTierModel: Model<ICommissionTierDocument> =
    (mongoose.models.CommissionTier as Model<ICommissionTierDocument>) ||
    mongoose.model<ICommissionTierDocument>(
        "CommissionTier",
        CommissionTierSchema,
    );

export default CommissionTierModel;
