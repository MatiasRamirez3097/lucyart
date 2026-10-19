"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { DiscordConfig } from "@/types";

interface DiscordFloatingButtonProps {
    discord: DiscordConfig;
}

export default function DiscordFloatingButton({
    discord,
}: DiscordFloatingButtonProps) {
    const pathname = usePathname();
    const [copied, setCopied] = useState(false);

    // Hide on /admin backoffice routes or when disabled in settings
    if (!discord?.enabled || pathname?.startsWith("/admin")) {
        return null;
    }

    function handleCopyUsername(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        if (!discord.username) return;
        void navigator.clipboard?.writeText(discord.username);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    }

    return (
        <div
            style={{
                position: "fixed",
                bottom: "24px",
                right: "24px",
                zIndex: 9000,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: "8px",
            }}
        >
            {/* Optional quick copy username pill */}
            {discord.username && (
                <button
                    type="button"
                    onClick={handleCopyUsername}
                    title="Click to copy Discord username"
                    style={{
                        background: "rgba(26, 10, 46, 0.92)",
                        backdropFilter: "blur(8px)",
                        border: "1px solid var(--border-cyan)",
                        color: copied ? "#00f550" : "var(--cyan)",
                        padding: "4px 12px",
                        borderRadius: "20px",
                        fontSize: "0.75rem",
                        fontWeight: 800,
                        cursor: "pointer",
                        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.4)",
                        transition: "all 0.2s ease",
                    }}
                >
                    {copied
                        ? "✅ Username Copied!"
                        : `📋 @${discord.username.replace(/^@/, "")}`}
                </button>
            )}

            {/* Main Floating Discord Chat Button */}
            <a
                href={discord.url || "https://discord.com"}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "13px 22px",
                    borderRadius: "50px",
                    background: "linear-gradient(135deg, #5865F2, var(--purple))",
                    color: "#ffffff",
                    fontWeight: 800,
                    fontSize: "0.95rem",
                    boxShadow:
                        "0 0 25px rgba(88, 101, 242, 0.55), 0 6px 20px rgba(0, 0, 0, 0.4)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    transition: "transform 0.25s ease, box-shadow 0.25s ease",
                }}
            >
                <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                >
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
                <span>{discord.buttonText || "Chat on Discord"}</span>
            </a>
        </div>
    );
}
