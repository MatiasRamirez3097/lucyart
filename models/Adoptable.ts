import mongoose, { Schema, Model } from "mongoose";
import { AdoptableStatus } from "@/types";

export interface IAdoptableDocument {
    _id: mongoose.Types.ObjectId;
    title: string;
    price: number;
    status: AdoptableStatus;
    description: string;
    imageUrl: string;
    publicId?: string;
    owner?: string;
    createdAt: Date;
    updatedAt: Date;
}

const AdoptableSchema = new Schema<IAdoptableDocument>(
    {
        title: {
            type: String,
            required: [true, "Adoptable title is required"],
            trim: true,
        },
        price: {
            type: Number,
            required: [true, "Price is required"],
            min: 0,
        },
        status: {
            type: String,
            enum: ["available", "pending", "sold"],
            default: "available",
        },
        description: {
            type: String,
            required: [true, "Description is required"],
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
        owner: {
            type: String,
            default: "",
            trim: true,
        },
    },
    {
        timestamps: true,
    },
);

const AdoptableModel: Model<IAdoptableDocument> =
    (mongoose.models.Adoptable as Model<IAdoptableDocument>) ||
    mongoose.model<IAdoptableDocument>("Adoptable", AdoptableSchema);

export default AdoptableModel;
