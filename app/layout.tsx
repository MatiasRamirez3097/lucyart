import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title: "LucyArt | Digital Art Portfolio, Commissions & Adoptables",
    description:
        "Vibrant anime-influenced digital illustrations, custom commissions, and original adoptable character designs by Lucy.",
};

interface RootLayoutProps {
    children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="en">
            <body>
                <Navbar />
                <main className="min-h-screen">{children}</main>
                <Footer />
            </body>
        </html>
    );
}
