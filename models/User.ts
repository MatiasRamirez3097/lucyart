import mongoose, { Schema, Model } from "mongoose";
import { UserRole } from "@/types";

export interface IUserDocument {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    passwordHash: string;
    role: UserRole;
    avatarUrl?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        passwordHash: {
            type: String,
            required: [true, "Password hash is required"],
        },
        role: {
            type: String,
            enum: ["admin", "client"],
            default: "client",
            index: true,
        },
        avatarUrl: {
            type: String,
            default: "",
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    },
);

const UserModel: Model<IUserDocument> =
    (mongoose.models.User as Model<IUserDocument>) ||
    mongoose.model<IUserDocument>("User", UserSchema);

export default UserModel;
