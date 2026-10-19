"use client";

import React, { useState } from "react";
import { PortfolioItem } from "@/types";
import { useNsfw } from "@/components/NsfwProvider";
import NsfwToggle from "@/components/NsfwToggle";

interface PortfolioGalleryClientProps {
    items: PortfolioItem[];
}

export default function PortfolioGalleryClient({
    items,
}: PortfolioGalleryClientProps) {
    const { showNsfw } = useNsfw();
    const [activeFilter, setActiveFilter] = useState<string>("ALL");
    const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(
        null,
    );

    const nsfwCount = items.filter((i) => Boolean(i.isNsfw)).length;

    // First filter by NSFW visibility setting
    const visibleItems = items.filter((item) =>
        showNsfw ? true : !item.isNsfw,
    );

    const uniqueCategories = Array.from(
        new Set(visibleItems.map((i) => i.category).filter(Boolean)),
    );

    const filteredItems = visibleItems.filter((item) => {
        if (activeFilter === "ALL") return true;
        if (activeFilter === "COMMISSIONS") return Boolean(item.isCommission);
        if (activeFilter === "NSFW_ONLY") return Boolean(item.isNsfw);
        return item.category === activeFilter;
    });

    const activeSelectedItem =
        selectedItem && (!selectedItem.isNsfw || showNsfw)
            ? selectedItem
            : null;

    return (
        <>
            {/* Interactive Filter Tabs + NSFW (18+) Switch */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "16px",
                    marginBottom: "36px",
                    flexWrap: "wrap",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        gap: "10px",
                        flexWrap: "wrap",
                        alignItems: "center",
                    }}
                >
                    <button
                        type="button"
                        onClick={() => setActiveFilter("ALL")}
                        className={
                            activeFilter === "ALL"
                                ? "btn btn-outline"
                                : "btn btn-ghost"
                        }
                        style={
                            activeFilter === "ALL"
                                ? { background: "rgba(0, 245, 255, 0.1)" }
                                : undefined
                        }
                    >
                        All Works ({visibleItems.length})
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveFilter("COMMISSIONS")}
                        className={
                            activeFilter === "COMMISSIONS"
                                ? "btn btn-primary"
                                : "btn btn-ghost"
                        }
                    >
                        ✨ Completed Commissions (
                        {visibleItems.filter((i) => i.isCommission).length})
                    </button>

                    {showNsfw && nsfwCount > 0 && (
                        <button
                            type="button"
                            onClick={() => setActiveFilter("NSFW_ONLY")}
                            className={
                                activeFilter === "NSFW_ONLY"
                                    ? "btn btn-primary"
                                    : "btn btn-ghost"
                            }
                        >
                            🔞 18+ Works ({nsfwCount})
                        </button>
                    )}

                    {uniqueCategories.map((cat) => (
                        <button
                            key={cat}
                            type="button"
                            onClick={() => setActiveFilter(cat)}
                            className={
                                activeFilter === cat
                                    ? "btn btn-outline"
                                    : "btn btn-ghost"
                            }
                            style={
                                activeFilter === cat
                                    ? { background: "rgba(0, 245, 255, 0.1)" }
                                    : undefined
                            }
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Global 18+ NSFW Toggle */}
                <NsfwToggle
                    nsfwCount={nsfwCount}
                    label="Show NSFW (18+)"
                />
            </div>

            {filteredItems.length === 0 ? (
                <div
                    className="card"
                    style={{ padding: "48px", textAlign: "center" }}
                >
                    <p style={{ color: "var(--muted)", fontSize: "1.05rem" }}>
                        No artworks found in this category yet.
                        {!showNsfw && nsfwCount > 0
                            ? ` (${nsfwCount} NSFW 18+ artwork${nsfwCount > 1 ? "s are" : " is"} currently hidden — enable the 🔞 switch above to view.)`
                            : ""}
                    </p>
                </div>
            ) : (
                <div className="grid-4">
                    {filteredItems.map((item) => (
                        <div
                            key={item.id}
                            className="card holo-card"
                            onClick={() => setSelectedItem(item)}
                            style={{
                                overflow: "hidden",
                                cursor: "pointer",
                            }}
                        >
                            <div
                                style={{
                                    position: "relative",
                                    aspectRatio: "3/4",
                                    overflow: "hidden",
                                    background: "var(--bg-deep)",
                                }}
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={item.imageUrl}
                                    alt={item.title}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        transition: "transform 0.5s ease",
                                    }}
                                />

                                {/* Top Badges */}
                                <div
                                    style={{
                                        position: "absolute",
                                        top: "12px",
                                        left: "12px",
                                        right: "12px",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "flex-start",
                                        gap: "6px",
                                        pointerEvents: "none",
                                    }}
                                >
                                    <div>
                                        {item.isCommission && (
                                            <span className="tag pink">
                                                Commissioned
                                            </span>
                                        )}
                                    </div>
                                    {item.isNsfw && (
                                        <span
                                            className="tag sold"
                                            style={{
                                                background:
                                                    "rgba(255, 45, 120, 0.9)",
                                                color: "#fff",
                                                border: "1px solid #fff",
                                            }}
                                        >
                                            🔞 18+
                                        </span>
                                    )}
                                </div>

                                {/* Bottom Info Overlay */}
                                <div
                                    style={{
                                        position: "absolute",
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        padding: "16px",
                                        background:
                                            "linear-gradient(to top, rgba(13,6,24,0.95), transparent)",
                                    }}
                                >
                                    <h3
                                        style={{
                                            fontSize: "1.05rem",
                                            margin: "0 0 6px 0",
                                        }}
                                    >
                                        {item.title}
                                    </h3>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            gap: "8px",
                                        }}
                                    >
                                        <span
                                            className="tag cyan"
                                            style={{ fontSize: "0.65rem" }}
                                        >
                                            {item.category}
                                        </span>
                                        {item.isCommission &&
                                            item.clientName && (
                                                <span
                                                    style={{
                                                        fontSize: "0.75rem",
                                                        color: "var(--pink-light)",
                                                        fontWeight: 700,
                                                    }}
                                                >
                                                    for {item.clientName}
                                                </span>
                                            )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* High-Res Lightbox Modal */}
            {activeSelectedItem && (
                <div
                    onClick={() => setSelectedItem(null)}
                    style={{
                        position: "fixed",
                        inset: 0,
                        zIndex: 9999,
                        background: "rgba(13, 6, 24, 0.9)",
                        backdropFilter: "blur(8px)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "24px",
                    }}
                >
                    <div
                        className="card"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            maxWidth: "850px",
                            width: "100%",
                            maxHeight: "90vh",
                            overflowY: "auto",
                            padding: "24px",
                            border: "1px solid var(--border-cyan)",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "16px",
                            }}
                        >
                            <div>
                                <h2 style={{ margin: 0 }}>
                                    {activeSelectedItem.title}
                                </h2>
                                <div
                                    style={{
                                        display: "flex",
                                        gap: "8px",
                                        marginTop: "6px",
                                        alignItems: "center",
                                        flexWrap: "wrap",
                                    }}
                                >
                                    <span className="tag cyan">
                                        {activeSelectedItem.category}
                                    </span>
                                    {activeSelectedItem.isCommission && (
                                        <span className="tag pink">
                                            Completed Commission
                                            {activeSelectedItem.clientName
                                                ? ` • ${activeSelectedItem.clientName}`
                                                : ""}
                                        </span>
                                    )}
                                    {activeSelectedItem.isNsfw && (
                                        <span className="tag sold">
                                            🔞 NSFW (18+)
                                        </span>
                                    )}
                                </div>
                            </div>

                            <button
                                type="button"
                                className="btn btn-ghost"
                                onClick={() => setSelectedItem(null)}
                                style={{ padding: "8px 16px" }}
                            >
                                ✕ Close
                            </button>
                        </div>

                        <div
                            style={{
                                background: "var(--bg-deep)",
                                borderRadius: "12px",
                                overflow: "hidden",
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={activeSelectedItem.imageUrl}
                                alt={activeSelectedItem.title}
                                style={{
                                    maxHeight: "65vh",
                                    width: "auto",
                                    objectFit: "contain",
                                }}
                            />
                        </div>

                        {activeSelectedItem.description && (
                            <p
                                style={{
                                    color: "var(--muted)",
                                    marginTop: "16px",
                                    marginBottom: 0,
                                }}
                            >
                                {activeSelectedItem.description}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
