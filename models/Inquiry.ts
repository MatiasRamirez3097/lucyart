import mongoose, { Schema, Model } from "mongoose";
import { InquiryStatus, InquirySubject } from "@/types";

export interface IInquiryDocument {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    subject: InquirySubject;
    targetItem?: string;
    message: string;
    status: InquiryStatus;
    createdAt: Date;
    updatedAt: Date;
}

const InquirySchema = new Schema<IInquiryDocument>(
    {
        name: {
            type: String,
            required: [true, "Name or alias is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email address is required"],
            trim: true,
            lowercase: true,
        },
        subject: {
            type: String,
            enum: ["commission", "adoptable", "collaboration", "other"],
            required: [true, "Subject is required"],
        },
        targetItem: {
            type: String,
            default: "",
            trim: true,
        },
        message: {
            type: String,
            required: [true, "Message details are required"],
            trim: true,
        },
        status: {
            type: String,
            enum: ["pending", "in_progress", "completed", "archived"],
            default: "pending",
        },
    },
    {
        timestamps: true,
    },
);

const InquiryModel: Model<IInquiryDocument> =
    (mongoose.models.Inquiry as Model<IInquiryDocument>) ||
    mongoose.model<IInquiryDocument>("Inquiry", InquirySchema);

export default InquiryModel;
