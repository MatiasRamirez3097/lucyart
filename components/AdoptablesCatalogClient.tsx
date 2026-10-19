"use client";

import React, { useState } from "react";
import { Adoptable, AdoptableStatus } from "@/types";
import AdoptableCard from "@/components/AdoptableCard";
import { useNsfw } from "@/components/NsfwProvider";
import NsfwToggle from "@/components/NsfwToggle";

interface AdoptablesCatalogClientProps {
    adoptables: Adoptable[];
}

export default function AdoptablesCatalogClient({
    adoptables,
}: AdoptablesCatalogClientProps) {
    const { showNsfw } = useNsfw();
    const [filter, setFilter] = useState<"ALL" | AdoptableStatus>("ALL");

    const nsfwCount = adoptables.filter((a) => Boolean(a.isNsfw)).length;
    const visibleAdoptables = adoptables.filter((item) =>
        showNsfw ? true : !item.isNsfw,
    );

    const filtered = visibleAdoptables.filter((item) =>
        filter === "ALL" ? true : item.status === filter,
    );

    return (
        <>
            {/* Interactive Filter Bar + NSFW Toggle */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "16px",
                    marginBottom: "40px",
                    flexWrap: "wrap",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        gap: "12px",
                        flexWrap: "wrap",
                    }}
                >
                    {(
                        [
                            {
                                key: "ALL",
                                label: `All (${visibleAdoptables.length})`,
                            },
                            {
                                key: "available",
                                label: `Available (${
                                    visibleAdoptables.filter(
                                        (a) => a.status === "available",
                                    ).length
                                })`,
                            },
                            {
                                key: "pending",
                                label: `Pending (${
                                    visibleAdoptables.filter(
                                        (a) => a.status === "pending",
                                    ).length
                                })`,
                            },
                            {
                                key: "sold",
                                label: `Sold (${
                                    visibleAdoptables.filter(
                                        (a) => a.status === "sold",
                                    ).length
                                })`,
                            },
                        ] as const
                    ).map((tab) => (
                        <button
                            key={tab.key}
                            type="button"
                            onClick={() => setFilter(tab.key)}
                            className={
                                filter === tab.key
                                    ? "btn btn-outline"
                                    : "btn btn-ghost"
                            }
                            style={
                                filter === tab.key
                                    ? { background: "rgba(0, 245, 255, 0.1)" }
                                    : undefined
                            }
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <NsfwToggle
                    nsfwCount={nsfwCount}
                    label="Show NSFW (18+)"
                />
            </div>

            {filtered.length === 0 ? (
                <div
                    className="card"
                    style={{ padding: "48px", textAlign: "center" }}
                >
                    <p style={{ color: "var(--muted)", fontSize: "1.05rem" }}>
                        No adoptables match the selected status filter.
                        {!showNsfw && nsfwCount > 0
                            ? ` (${nsfwCount} NSFW 18+ adoptable${nsfwCount > 1 ? "s are" : " is"} hidden — enable the 🔞 switch above to view.)`
                            : ""}
                    </p>
                </div>
            ) : (
                <div className="grid-3">
                    {filtered.map((item) => (
                        <AdoptableCard key={item.id} adoptable={item} />
                    ))}
                </div>
            )}
        </>
    );
}
