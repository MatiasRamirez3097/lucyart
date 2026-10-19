"use client";

import React from "react";
import { useNsfw } from "@/components/NsfwProvider";

interface NsfwToggleProps {
    nsfwCount?: number;
    label?: string;
}

export default function NsfwToggle({
    nsfwCount,
    label = "Show NSFW (18+)",
}: NsfwToggleProps) {
    const { showNsfw, toggleNsfw } = useNsfw();

    return (
        <button
            type="button"
            onClick={toggleNsfw}
            aria-pressed={showNsfw}
            title={
                showNsfw
                    ? "NSFW (18+) content is currently visible. Click to hide."
                    : "Click to enable NSFW (18+) content (requires 18+ age confirmation)."
            }
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                padding: "8px 16px",
                borderRadius: "999px",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: "0.85rem",
                transition: "all 0.25s ease",
                background: showNsfw
                    ? "rgba(255, 45, 120, 0.18)"
                    : "rgba(255, 255, 255, 0.04)",
                border: showNsfw
                    ? "1px solid var(--pink)"
                    : "1px solid var(--border)",
                color: showNsfw ? "var(--white)" : "var(--muted)",
                boxShadow: showNsfw
                    ? "0 0 18px rgba(255, 45, 120, 0.35)"
                    : "none",
            }}
        >
            {/* Visual Checkbox / Switch indicator */}
            <span
                style={{
                    width: "34px",
                    height: "18px",
                    borderRadius: "999px",
                    background: showNsfw
                        ? "var(--pink)"
                        : "rgba(255, 255, 255, 0.15)",
                    position: "relative",
                    display: "inline-block",
                    transition: "background 0.25s ease",
                    flexShrink: 0,
                }}
            >
                <span
                    style={{
                        position: "absolute",
                        top: "2px",
                        left: showNsfw ? "18px" : "2px",
                        width: "14px",
                        height: "14px",
                        borderRadius: "50%",
                        background: "#fff",
                        transition: "left 0.2s ease",
                    }}
                />
            </span>

            <span>
                🔞 {label}
                {typeof nsfwCount === "number" && nsfwCount > 0
                    ? ` (${nsfwCount})`
                    : ""}
            </span>
        </button>
    );
}
