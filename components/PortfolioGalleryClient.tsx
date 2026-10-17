"use client";

import React, { useState } from "react";
import { PortfolioItem } from "@/types";

interface PortfolioGalleryClientProps {
    items: PortfolioItem[];
}

export default function PortfolioGalleryClient({
    items,
}: PortfolioGalleryClientProps) {
    const [activeFilter, setActiveFilter] = useState<string>("ALL");
    const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(
        null,
    );

    const uniqueCategories = Array.from(
        new Set(items.map((i) => i.category).filter(Boolean)),
    );

    const filteredItems = items.filter((item) => {
        if (activeFilter === "ALL") return true;
        if (activeFilter === "COMMISSIONS") return Boolean(item.isCommission);
        return item.category === activeFilter;
    });

    return (
        <>
            {/* Interactive Filter Tabs */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "12px",
                    marginBottom: "40px",
                    flexWrap: "wrap",
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
                    All Works ({items.length})
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
                    {items.filter((i) => i.isCommission).length})
                </button>

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

            {filteredItems.length === 0 ? (
                <div
                    className="card"
                    style={{ padding: "48px", textAlign: "center" }}
                >
                    <p style={{ color: "var(--muted)", fontSize: "1.05rem" }}>
                        No artworks found in this category yet.
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
                                {item.isCommission && (
                                    <div
                                        style={{
                                            position: "absolute",
                                            top: "12px",
                                            left: "12px",
                                        }}
                                    >
                                        <span className="tag pink">
                                            Commissioned
                                        </span>
                                    </div>
                                )}

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
            {selectedItem && (
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
                                    {selectedItem.title}
                                </h2>
                                <div
                                    style={{
                                        display: "flex",
                                        gap: "8px",
                                        marginTop: "6px",
                                        alignItems: "center",
                                    }}
                                >
                                    <span className="tag cyan">
                                        {selectedItem.category}
                                    </span>
                                    {selectedItem.isCommission && (
                                        <span className="tag pink">
                                            Completed Commission
                                            {selectedItem.clientName
                                                ? ` • ${selectedItem.clientName}`
                                                : ""}
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
                                src={selectedItem.imageUrl}
                                alt={selectedItem.title}
                                style={{
                                    maxHeight: "65vh",
                                    width: "auto",
                                    objectFit: "contain",
                                }}
                            />
                        </div>

                        {selectedItem.description && (
                            <p
                                style={{
                                    color: "var(--muted)",
                                    marginTop: "16px",
                                    marginBottom: 0,
                                }}
                            >
                                {selectedItem.description}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
