"use client";

import React, { useState, useTransition } from "react";
import { DiscordConfig, SiteSettings, SocialLinkItem } from "@/types";
import { saveSiteSettings } from "@/app/actions/settings";
import { buildDiscordHref } from "@/components/DiscordFloatingButton";
import SocialIcon, {
    resolveSocialPresetKey,
    SOCIAL_LOGO_PRESETS,
} from "@/components/SocialIcon";

interface AdminSettingsClientProps {
    initialSettings: SiteSettings;
}

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
                icon: "globe",
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
                    Social Media SVG Logos &amp; Discord Chat Button
                </h2>
                <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
                    Select official SVG logos (or paste custom{" "}
                    <code>&lt;svg&gt;</code> code) for your social networks and
                    configure the floating Discord chat button.
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
                                Discord Base URL or Server Invite
                            </label>
                            <input
                                type="url"
                                className="input"
                                placeholder="https://discord.com/users or https://discord.gg"
                                value={discord.url}
                                onChange={(e) =>
                                    setDiscord((prev) => ({
                                        ...prev,
                                        url: e.target.value,
                                    }))
                                }
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">
                                Discord Username / User ID
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

                {/* 2. Footer Social Media SVG Logos & Links */}
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
                                🌐 Social Media SVG Logos &amp; URLs
                            </h3>
                            <p
                                style={{
                                    color: "var(--muted)",
                                    fontSize: "0.85rem",
                                    margin: 0,
                                }}
                            >
                                Choose an official brand SVG logo from the list
                                or select <strong>Custom &lt;svg&gt; Code</strong>{" "}
                                to paste your own vector icon.
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
                        {socialLinks.map((link, idx) => {
                            const isRawSvg = link.icon
                                .trim()
                                .startsWith("<svg");
                            const resolvedPreset = isRawSvg
                                ? "custom"
                                : resolveSocialPresetKey(link.icon, link.name);

                            return (
                                <div
                                    key={link.id || idx}
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "12px",
                                        padding: "16px",
                                        borderRadius: "12px",
                                        background: "rgba(255,255,255,0.03)",
                                        border: "1px solid var(--border)",
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns:
                                                "52px minmax(160px, 1fr) minmax(150px, 1fr) minmax(220px, 2fr) auto auto",
                                            gap: "12px",
                                            alignItems: "center",
                                        }}
                                    >
                                        {/* Live SVG Logo Preview */}
                                        <div
                                            title="Live SVG Preview"
                                            style={{
                                                width: "44px",
                                                height: "44px",
                                                borderRadius: "10px",
                                                background: "var(--bg-deep)",
                                                border: "1px solid var(--border-cyan)",
                                                color: "var(--cyan)",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                marginTop: "18px",
                                            }}
                                        >
                                            <SocialIcon
                                                icon={link.icon}
                                                name={link.name}
                                                size={22}
                                            />
                                        </div>

                                        {/* SVG Logo Preset Selector */}
                                        <div className="input-group">
                                            <label className="input-label">
                                                SVG Logo
                                            </label>
                                            <select
                                                className="input"
                                                value={resolvedPreset}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    if (val === "custom") {
                                                        handleUpdateLink(
                                                            idx,
                                                            "icon",
                                                            '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>',
                                                        );
                                                    } else {
                                                        handleUpdateLink(
                                                            idx,
                                                            "icon",
                                                            val,
                                                        );
                                                    }
                                                }}
                                            >
                                                {SOCIAL_LOGO_PRESETS.map(
                                                    (preset) => (
                                                        <option
                                                            key={preset.key}
                                                            value={preset.key}
                                                            style={{
                                                                background:
                                                                    "var(--bg-card)",
                                                            }}
                                                        >
                                                            {preset.label}
                                                        </option>
                                                    ),
                                                )}
                                            </select>
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
                                            {link.enabled
                                                ? "Visible"
                                                : "Hidden"}
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
                                            onClick={() =>
                                                handleRemoveLink(idx)
                                            }
                                        >
                                            🗑️
                                        </button>
                                    </div>

                                    {/* Raw <svg> Code Editor when Custom SVG is selected */}
                                    {resolvedPreset === "custom" && (
                                        <div className="input-group">
                                            <label className="input-label">
                                                Custom <code>&lt;svg&gt;</code>{" "}
                                                Markup
                                            </label>
                                            <textarea
                                                className="input"
                                                rows={2}
                                                style={{
                                                    fontFamily: "monospace",
                                                    fontSize: "0.8rem",
                                                    minHeight: "64px",
                                                }}
                                                placeholder='<svg viewBox="0 0 24 24" fill="currentColor">...</svg>'
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
                                    )}
                                </div>
                            );
                        })}
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
