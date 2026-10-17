"use client";

import React, { useState } from "react";
import { Adoptable, AdoptableStatus } from "@/types";
import AdoptableCard from "@/components/AdoptableCard";

interface AdoptablesCatalogClientProps {
    adoptables: Adoptable[];
}

export default function AdoptablesCatalogClient({
    adoptables,
}: AdoptablesCatalogClientProps) {
    const [filter, setFilter] = useState<"ALL" | AdoptableStatus>("ALL");

    const filtered = adoptables.filter((item) =>
        filter === "ALL" ? true : item.status === filter,
    );

    return (
        <>
            {/* Interactive Filter Bar */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "12px",
                    marginBottom: "40px",
                    flexWrap: "wrap",
                }}
            >
                {(
                    [
                        { key: "ALL", label: `All (${adoptables.length})` },
                        {
                            key: "available",
                            label: `Available (${
                                adoptables.filter(
                                    (a) => a.status === "available",
                                ).length
                            })`,
                        },
                        {
                            key: "pending",
                            label: `Pending (${
                                adoptables.filter((a) => a.status === "pending")
                                    .length
                            })`,
                        },
                        {
                            key: "sold",
                            label: `Sold (${
                                adoptables.filter((a) => a.status === "sold")
                                    .length
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

            {filtered.length === 0 ? (
                <div
                    className="card"
                    style={{ padding: "48px", textAlign: "center" }}
                >
                    <p style={{ color: "var(--muted)", fontSize: "1.05rem" }}>
                        No adoptables match the selected status filter.
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
