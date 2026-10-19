import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DiscordFloatingButton from "@/components/DiscordFloatingButton";
import { getSiteSettings } from "@/app/actions/settings";
import { Metadata } from "next";
import React from "react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "LucyArt | Digital Art Portfolio, Commissions & Adoptables",
    description:
        "Vibrant anime-influenced digital illustrations, custom commissions, and original adoptable character designs by Lucy.",
};

interface RootLayoutProps {
    children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
    const settings = await getSiteSettings();

    return (
        <html lang="en">
            <body>
                <Navbar />
                <main className="min-h-screen">{children}</main>
                <Footer socialLinks={settings.socialLinks} />
                <DiscordFloatingButton discord={settings.discord} />
            </body>
        </html>
    );
}
