import mongoose, { Schema, Model } from "mongoose";

export interface ICommissionTierDocument {
    _id: mongoose.Types.ObjectId;
    title: string;
    priceBase: number;
    description: string;
    features: string[];
    exampleImages: string[];
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
