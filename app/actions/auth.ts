"use server";

import { redirect } from "next/navigation";
import dbConnect, { isDbConfigured } from "@/lib/mongodb";
import UserModel from "@/models/User";
import {
    clearSessionCookie,
    createSessionCookie,
    hashPassword,
    verifyPassword,
} from "@/lib/auth";
import { UserRole } from "@/types";

export interface AuthActionState {
    success: boolean;
    message: string;
}

export async function loginAction(
    _prevState: AuthActionState,
    formData: FormData,
): Promise<AuthActionState> {
    const email =
        (formData.get("email") as string | null)?.trim().toLowerCase() || "";
    const password = (formData.get("password") as string | null) || "";
    const callbackUrl =
        (formData.get("callbackUrl") as string | null)?.trim() || "";

    if (!email || !password) {
        return {
            success: false,
            message: "Please enter both your email and password.",
        };
    }

    const configuredAdminEmail = (
        process.env.ADMIN_EMAIL || "admin@lucyart.com"
    )
        .trim()
        .toLowerCase();
    const configuredAdminPassword =
        process.env.ADMIN_PASSWORD || "lucyadmin123";

    let authenticatedUser: {
        userId: string;
        name: string;
        email: string;
        role: UserRole;
    } | null = null;

    try {
        if (isDbConfigured()) {
            await dbConnect();
            let userDoc = await UserModel.findOne({ email });

            // Auto-bootstrap initial Admin user in MongoDB Atlas on first login
            if (
                !userDoc &&
                email === configuredAdminEmail &&
                password === configuredAdminPassword
            ) {
                userDoc = await UserModel.create({
                    name: "Lucy",
                    email: configuredAdminEmail,
                    passwordHash: hashPassword(configuredAdminPassword),
                    role: "admin",
                    isActive: true,
                });
            }

            if (!userDoc || !userDoc.isActive) {
                return {
                    success: false,
                    message: "Invalid email or password.",
                };
            }

            const isValid = verifyPassword(password, userDoc.passwordHash);
            if (!isValid) {
                return {
                    success: false,
                    message: "Invalid email or password.",
                };
            }

            authenticatedUser = {
                userId: userDoc._id.toString(),
                name: userDoc.name,
                email: userDoc.email,
                role: userDoc.role,
            };
        } else {
            // Fallback when MONGODB_URI is not configured yet in local development
            if (
                email === configuredAdminEmail &&
                password === configuredAdminPassword
            ) {
                authenticatedUser = {
                    userId: "local-admin",
                    name: "Lucy",
                    email: configuredAdminEmail,
                    role: "admin",
                };
            } else {
                return {
                    success: false,
                    message: "Invalid email or password.",
                };
            }
        }

        await createSessionCookie(authenticatedUser);
    } catch (error) {
        const message =
            error instanceof Error
                ? error.message
                : "Authentication error occurred.";
        return {
            success: false,
            message,
        };
    }

    // Redirect outside try/catch as Next.js redirect() throws control-flow exception
    if (authenticatedUser.role === "admin") {
        const target =
            callbackUrl && callbackUrl.startsWith("/admin")
                ? callbackUrl
                : "/admin";
        redirect(target);
    }

    redirect("/");
}

export async function logoutAction(): Promise<void> {
    await clearSessionCookie();
    redirect("/login");
}
