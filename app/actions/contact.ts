"use server";

import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/mongodb";
import InquiryModel from "@/models/Inquiry";
import { InquirySubject } from "@/types";

export interface ContactActionState {
    success: boolean;
    message: string;
}

export async function submitContactForm(
    _prevState: ContactActionState,
    formData: FormData,
): Promise<ContactActionState> {
    try {
        const name = (formData.get("name") as string | null)?.trim() || "";
        const email = (formData.get("email") as string | null)?.trim() || "";
        const subject = ((formData.get("subject") as string | null)?.trim() ||
            "other") as InquirySubject;
        const targetItem =
            (formData.get("targetItem") as string | null)?.trim() || "";
        const message =
            (formData.get("message") as string | null)?.trim() || "";

        if (!name || !email || !subject || !message) {
            return {
                success: false,
                message: "Please fill out all required fields.",
            };
        }

        await dbConnect();

        await InquiryModel.create({
            name,
            email,
            subject,
            targetItem,
            message,
            status: "pending",
        });

        revalidatePath("/admin");
        revalidatePath("/admin/commissions");

        return {
            success: true,
            message:
                "Your request has been sent! Lucy will review it and reply to your email soon.",
        };
    } catch (error) {
        const msg =
            error instanceof Error
                ? error.message
                : "Could not send message. Please check database configuration.";
        return {
            success: false,
            message: msg,
        };
    }
}
