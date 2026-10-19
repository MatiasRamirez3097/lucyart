"use client";

import React, { useState, useTransition } from "react";
import { DiscordConfig, SiteSettings, SocialLinkItem } from "@/types";
import { saveSiteSettings } from "@/app/actions/settings";
import { buildDiscordHref } from "@/components/DiscordFloatingButton";

interface AdminSettingsClientProps {
    initialSettings: SiteSettings;
}

const ICON_PRESETS = ["🐦", "🎨", "📸", "📋", "✨", "🦋", "🎵", "☕", "🏠", "🔗"];

export default function AdminSettingsClient({
    initialSettings,
}: AdminSettingsClientProps) {
    const [isPending, startTransition] = useTransition();
    const [toast, setToast] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);

    const [socialLinks, setSocialLinks] = useState<SocialLinkItem[]>(
        initialSettings.socialLinks,
    );
    const [discord, setDiscord] = useState<DiscordConfig>(
        initialSettings.discord,
    );

    function showToast(type: "success" | "error", text: string) {
        setToast({ type, text });
        setTimeout(() => setToast(null), 4000);
    }

    function handleUpdateLink(
        index: number,
        field: keyof SocialLinkItem,
        value: string | boolean,
    ) {
        setSocialLinks((prev) =>
            prev.map((item, idx) =>
                idx === index ? { ...item, [field]: value } : item,
            ),
        );
    }

    function handleAddLink() {
        setSocialLinks((prev) => [
            ...prev,
            {
                id: `social-${Date.now()}`,
                name: "New Social",
                url: "https://",
                icon: "✨",
                enabled: true,
            },
        ]);
    }

    function handleRemoveLink(index: number) {
        setSocialLinks((prev) => prev.filter((_, idx) => idx !== index));
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        startTransition(async () => {
            const res = await saveSiteSettings({
                socialLinks,
                discord,
            });
            if (res.success) {
                showToast("success", res.message);
            } else {
                showToast("error", res.message);
            }
        });
    }

    return (
        <div>
            {toast && (
                <div className={`toast ${toast.type}`}>{toast.text}</div>
            )}

            <div style={{ marginBottom: "28px" }}>
                <h2 style={{ marginBottom: "4px" }}>
                    Social Media Links &amp; Discord Chat Button
                </h2>
                <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
                    Update your footer social media URLs and configure the
                    floating Discord chat button without touching any code.
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "32px",
                }}
            >
                {/* 1. Floating Discord Button Configuration */}
                <div
                    className="admin-card"
                    style={{
                        border: "1px solid var(--border-cyan)",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: "12px",
                            marginBottom: "20px",
                        }}
                    >
                        <div>
                            <h3
                                style={{
                                    margin: "0 0 4px 0",
                                    color: "var(--cyan)",
                                }}
                            >
                                💬 Floating Discord Chat Button
                            </h3>
                            <p
                                style={{
                                    color: "var(--muted)",
                                    fontSize: "0.85rem",
                                    margin: 0,
                                }}
                            >
                                Displays a floating button in the bottom-right
                                corner of your site so clients can chat with you
                                on Discord.
                            </p>
                        </div>

                        <label
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                cursor: "pointer",
                                fontWeight: 700,
                                color: discord.enabled
                                    ? "#00f550"
                                    : "var(--muted)",
                            }}
                        >
                            <input
                                type="checkbox"
                                checked={discord.enabled}
                                onChange={(e) =>
                                    setDiscord((prev) => ({
                                        ...prev,
                                        enabled: e.target.checked,
                                    }))
                                }
                                style={{
                                    width: "18px",
                                    height: "18px",
                                    accentColor: "var(--cyan)",
                                }}
                            />
                            {discord.enabled
                                ? "Enabled on Public Site"
                                : "Hidden"}
                        </label>
                    </div>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit, minmax(240px, 1fr))",
                            gap: "20px",
                        }}
                    >
                        <div className="input-group">
                            <label className="input-label">
                                Discord Direct Link or Server Invite URL
                            </label>
                            <input
                                type="url"
                                className="input"
                                placeholder="https://discord.com/users/YOUR_USER_ID or https://discord.gg/..."
                                value={discord.url}
                                onChange={(e) =>
                                    setDiscord((prev) => ({
                                        ...prev,
                                        url: e.target.value,
                                    }))
                                }
                            />
                            <span
                                style={{
                                    fontSize: "0.75rem",
                                    color: "var(--muted)",
                                }}
                            >
                                Tip: Use{" "}
                                <code>https://discord.com/users/YOUR_ID</code>{" "}
                                for direct profile DM or a{" "}
                                <code>https://discord.gg/...</code> server link.
                            </span>
                        </div>

                        <div className="input-group">
                            <label className="input-label">
                                Discord Username / Handle
                            </label>
                            <input
                                type="text"
                                className="input"
                                placeholder="e.g. lucyart"
                                value={discord.username}
                                onChange={(e) =>
                                    setDiscord((prev) => ({
                                        ...prev,
                                        username: e.target.value,
                                    }))
                                }
                            />
                            <span
                                style={{
                                    fontSize: "0.75rem",
                                    color: "var(--muted)",
                                }}
                            >
                                Allows clients to see and copy your username
                                with one click.
                            </span>
                        </div>

                        <div className="input-group">
                            <label className="input-label">
                                Floating Button Label
                            </label>
                            <input
                                type="text"
                                className="input"
                                placeholder="Chat on Discord"
                                value={discord.buttonText}
                                onChange={(e) =>
                                    setDiscord((prev) => ({
                                        ...prev,
                                        buttonText: e.target.value,
                                    }))
                                }
                            />
                        </div>
                    </div>

                    <div
                        style={{
                            marginTop: "16px",
                            padding: "10px 14px",
                            borderRadius: "10px",
                            background: "rgba(0, 245, 255, 0.06)",
                            border: "1px solid var(--border-cyan)",
                            fontSize: "0.85rem",
                            color: "var(--muted)",
                        }}
                    >
                        🔗 <strong>Resolved Floating Button URL:</strong>{" "}
                        <code style={{ color: "var(--cyan)" }}>
                            {buildDiscordHref(discord.url, discord.username)}
                        </code>
                    </div>
                </div>

                {/* 2. Footer Social Media Icons & Links */}
                <div className="admin-card">
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: "12px",
                            marginBottom: "20px",
                        }}
                    >
                        <div>
                            <h3 style={{ margin: "0 0 4px 0" }}>
                                🌐 Social Media Icons &amp; URLs
                            </h3>
                            <p
                                style={{
                                    color: "var(--muted)",
                                    fontSize: "0.85rem",
                                    margin: 0,
                                }}
                            >
                                Customize the social networks displayed in your
                                website footer.
                            </p>
                        </div>

                        <button
                            type="button"
                            className="btn btn-outline"
                            style={{
                                padding: "8px 18px",
                                fontSize: "0.85rem",
                            }}
                            onClick={handleAddLink}
                        >
                            ➕ Add Social Network
                        </button>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "16px",
                        }}
                    >
                        {socialLinks.map((link, idx) => (
                            <div
                                key={link.id || idx}
                                style={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "90px minmax(150px, 1fr) minmax(220px, 2fr) auto auto",
                                    gap: "12px",
                                    alignItems: "center",
                                    padding: "14px",
                                    borderRadius: "12px",
                                    background: "rgba(255,255,255,0.03)",
                                    border: "1px solid var(--border)",
                                }}
                            >
                                {/* Icon Input + Preset Selector */}
                                <div className="input-group">
                                    <label className="input-label">Icon</label>
                                    <div
                                        style={{
                                            display: "flex",
                                            gap: "4px",
                                            alignItems: "center",
                                        }}
                                    >
                                        <input
                                            type="text"
                                            className="input"
                                            style={{
                                                textAlign: "center",
                                                padding: "8px",
                                                fontSize: "1.1rem",
                                            }}
                                            value={link.icon}
                                            onChange={(e) =>
                                                handleUpdateLink(
                                                    idx,
                                                    "icon",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                </div>

                                {/* Platform Name */}
                                <div className="input-group">
                                    <label className="input-label">
                                        Platform Name
                                    </label>
                                    <input
                                        type="text"
                                        className="input"
                                        placeholder="e.g. Twitter / X"
                                        value={link.name}
                                        onChange={(e) =>
                                            handleUpdateLink(
                                                idx,
                                                "name",
                                                e.target.value,
                                            )
                                        }
                                        required
                                    />
                                </div>

                                {/* Target URL */}
                                <div className="input-group">
                                    <label className="input-label">
                                        Profile URL
                                    </label>
                                    <input
                                        type="text"
                                        className="input"
                                        placeholder="https://x.com/yourhandle"
                                        value={link.url}
                                        onChange={(e) =>
                                            handleUpdateLink(
                                                idx,
                                                "url",
                                                e.target.value,
                                            )
                                        }
                                        required
                                    />
                                </div>

                                {/* Visibility Toggle */}
                                <label
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "6px",
                                        cursor: "pointer",
                                        fontSize: "0.8rem",
                                        fontWeight: 700,
                                        marginTop: "18px",
                                        color: link.enabled
                                            ? "#00f550"
                                            : "var(--muted)",
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={link.enabled}
                                        onChange={(e) =>
                                            handleUpdateLink(
                                                idx,
                                                "enabled",
                                                e.target.checked,
                                            )
                                        }
                                    />
                                    {link.enabled ? "Visible" : "Hidden"}
                                </label>

                                {/* Delete Button */}
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    style={{
                                        padding: "8px 12px",
                                        fontSize: "0.8rem",
                                        marginTop: "18px",
                                    }}
                                    onClick={() => handleRemoveLink(idx)}
                                >
                                    🗑️
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Quick Emoji Helper */}
                    <div
                        style={{
                            marginTop: "16px",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            flexWrap: "wrap",
                            fontSize: "0.8rem",
                            color: "var(--muted)",
                        }}
                    >
                        <span>Suggested icons (click to copy):</span>
                        {ICON_PRESETS.map((emoji) => (
                            <button
                                key={emoji}
                                type="button"
                                className="btn btn-ghost"
                                style={{
                                    padding: "4px 10px",
                                    fontSize: "0.95rem",
                                }}
                                onClick={() => {
                                    void navigator.clipboard?.writeText(emoji);
                                    showToast(
                                        "success",
                                        `Copied ${emoji} to clipboard!`,
                                    );
                                }}
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isPending}
                        style={{ padding: "14px 36px", fontSize: "1rem" }}
                    >
                        {isPending
                            ? "Saving Settings..."
                            : "💾 Save Socials & Discord Settings"}
                    </button>
                </div>
            </form>
        </div>
    );
}
