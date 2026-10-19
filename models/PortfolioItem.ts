import mongoose, { Schema, Model } from "mongoose";

export interface IPortfolioItemDocument {
    _id: mongoose.Types.ObjectId;
    title: string;
    category: string;
    imageUrl: string;
    publicId?: string;
    description?: string;
    isCommission: boolean;
    clientName?: string;
    commissionTierId?: string;
    featured: boolean;
    isNsfw: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const PortfolioItemSchema = new Schema<IPortfolioItemDocument>(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
        },
        category: {
            type: String,
            required: [true, "Category is required"],
            default: "Full Body",
            trim: true,
        },
        imageUrl: {
            type: String,
            required: [true, "Image URL is required"],
        },
        publicId: {
            type: String,
            default: "",
        },
        description: {
            type: String,
            default: "",
            trim: true,
        },
        isCommission: {
            type: Boolean,
            default: false,
        },
        clientName: {
            type: String,
            default: "",
            trim: true,
        },
        commissionTierId: {
            type: String,
            default: "",
        },
        featured: {
            type: Boolean,
            default: false,
        },
        isNsfw: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

const PortfolioItemModel: Model<IPortfolioItemDocument> =
    (mongoose.models.PortfolioItem as Model<IPortfolioItemDocument>) ||
    mongoose.model<IPortfolioItemDocument>(
        "PortfolioItem",
        PortfolioItemSchema,
    );

export default PortfolioItemModel;
