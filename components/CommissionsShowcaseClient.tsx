"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CommissionTier, PortfolioItem } from "@/types";

interface CommissionsShowcaseClientProps {
    tiers: CommissionTier[];
    portfolioItems: PortfolioItem[];
}

interface TierIllustration {
    imageUrl: string;
    title: string;
    category?: string;
    isCommission?: boolean;
    clientName?: string;
    description?: string;
}

export default function CommissionsShowcaseClient({
    tiers,
    portfolioItems,
}: CommissionsShowcaseClientProps) {
    const [activeModalTier, setActiveModalTier] =
        useState<CommissionTier | null>(null);
    const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);

    // Build rich illustration list for a given Commission Tier
    function getIllustrationsForTier(tier: CommissionTier): TierIllustration[] {
        const map = new Map<string, TierIllustration>();

        // 1. Portfolio items explicitly linked via commissionTierId or matching categoryMatch
        for (const item of portfolioItems) {
            const isLinked = item.commissionTierId === tier.id;
            const isCategoryMatched =
                Boolean(tier.categoryMatch) &&
                item.category.toLowerCase() ===
                    tier.categoryMatch?.toLowerCase();

            if ((isLinked || isCategoryMatched) && item.imageUrl) {
                map.set(item.imageUrl, {
                    imageUrl: item.imageUrl,
                    title: item.title,
                    category: item.category,
                    isCommission: item.isCommission,
                    clientName: item.clientName,
                    description: item.description,
                });
            }
        }

        // 2. Direct URLs in tier.exampleImages (enriched with portfolio metadata if available)
        for (const url of tier.exampleImages || []) {
            if (!url) continue;
            if (!map.has(url)) {
                const matchedPortfolio = portfolioItems.find(
                    (p) => p.imageUrl === url,
                );
                if (matchedPortfolio) {
                    map.set(url, {
                        imageUrl: url,
                        title: matchedPortfolio.title,
                        category: matchedPortfolio.category,
                        isCommission: matchedPortfolio.isCommission,
                        clientName: matchedPortfolio.clientName,
                        description: matchedPortfolio.description,
                    });
                } else {
                    map.set(url, {
                        imageUrl: url,
                        title: `${tier.title} Sample`,
                        category: tier.categoryMatch || tier.title,
                    });
                }
            }
        }

        return Array.from(map.values());
    }

    function openTierModal(tier: CommissionTier, initialIndex = 0) {
        setActiveModalTier(tier);
        setActiveSlideIndex(initialIndex);
    }

    const modalIllustrations = activeModalTier
        ? getIllustrationsForTier(activeModalTier)
        : [];
    const currentSlide =
        modalIllustrations[activeSlideIndex] || modalIllustrations[0] || null;

    return (
        <>
            {/* Tiers Grid */}
            <div className="grid-3" style={{ alignItems: "stretch" }}>
                {tiers.map((tier) => {
                    const illustrations = getIllustrationsForTier(tier);
                    const tierStatus = tier.status || "open";
                    const isClosed = tierStatus === "closed";
                    const orderHref = `/contact?subject=commission&tier=${encodeURIComponent(
                        tier.title,
                    )}`;

                    return (
                        <div
                            key={tier.id}
                            className="card holo-card"
                            style={{
                                padding: "24px",
                                display: "flex",
                                flexDirection: "column",
                                gap: "16px",
                            }}
                        >
                            {/* Header Badges */}
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    gap: "8px",
                                }}
                            >
                                <span className="tag pink">{tier.title}</span>
                                <span
                                    className={`tag ${
                                        tierStatus === "open"
                                            ? "available"
                                            : tierStatus === "waitlist"
                                              ? "pending"
                                              : "sold"
                                    }`}
                                >
                                    {tierStatus === "open"
                                        ? "Open"
                                        : tierStatus === "waitlist"
                                          ? "Waitlist"
                                          : "Closed"}
                                </span>
                            </div>

                            {/* Price Display */}
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "baseline",
                                    gap: "6px",
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: "2.5rem",
                                        fontWeight: "bold",
                                        fontFamily: "Fredoka One",
                                        color: "var(--white)",
                                    }}
                                >
                                    ${tier.priceBase}
                                </span>
                                <span style={{ color: "var(--muted)" }}>
                                    USD / Base
                                </span>
                            </div>

                            <p
                                style={{
                                    color: "var(--white)",
                                    fontSize: "0.95rem",
                                    fontWeight: 600,
                                    margin: 0,
                                }}
                            >
                                {tier.description}
                            </p>

                            <div className="separator"></div>

                            <ul
                                style={{
                                    color: "var(--muted)",
                                    fontSize: "0.9rem",
                                    paddingLeft: "18px",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "8px",
                                    margin: 0,
                                    flex: 1,
                                }}
                            >
                                {tier.features.map((f) => (
                                    <li key={f}>{f}</li>
                                ))}
                            </ul>

                            {/* Preview Thumbnails Strip */}
                            {illustrations.length > 0 && (
                                <>
                                    <div className="separator"></div>
                                    <div>
                                        <p
                                            style={{
                                                fontSize: "0.75rem",
                                                color: "var(--muted)",
                                                textTransform: "uppercase",
                                                fontWeight: 700,
                                                marginBottom: "8px",
                                            }}
                                        >
                                            Sample Illustrations (Click to
                                            Inspect):
                                        </p>
                                        <div
                                            style={{
                                                display: "flex",
                                                gap: "10px",
                                                flexWrap: "wrap",
                                            }}
                                        >
                                            {illustrations
                                                .slice(0, 4)
                                                .map((ill, idx) => (
                                                    <button
                                                        key={idx}
                                                        type="button"
                                                        onClick={() =>
                                                            openTierModal(
                                                                tier,
                                                                idx,
                                                            )
                                                        }
                                                        style={{
                                                            padding: 0,
                                                            background: "none",
                                                            border: "none",
                                                            cursor: "pointer",
                                                            position:
                                                                "relative",
                                                        }}
                                                        title={`View ${ill.title}`}
                                                    >
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img
                                                            src={ill.imageUrl}
                                                            alt={ill.title}
                                                            style={{
                                                                width: "62px",
                                                                height: "62px",
                                                                borderRadius:
                                                                    "8px",
                                                                objectFit:
                                                                    "cover",
                                                                border: "1px solid var(--border-cyan)",
                                                            }}
                                                        />
                                                    </button>
                                                ))}
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Card Action Buttons */}
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "10px",
                                    marginTop: "auto",
                                    paddingTop: "8px",
                                }}
                            >
                                <button
                                    type="button"
                                    className="btn btn-outline"
                                    style={{
                                        width: "100%",
                                        justifyContent: "center",
                                    }}
                                    onClick={() => openTierModal(tier, 0)}
                                >
                                    🖼️ View Illustrations (
                                    {illustrations.length})
                                </button>

                                {isClosed ? (
                                    <button
                                        type="button"
                                        className="btn btn-ghost"
                                        style={{
                                            width: "100%",
                                            justifyContent: "center",
                                        }}
                                        disabled
                                    >
                                        🔒 Tier Currently Closed
                                    </button>
                                ) : (
                                    <Link
                                        href={orderHref}
                                        className="btn btn-primary"
                                        style={{
                                            width: "100%",
                                            justifyContent: "center",
                                        }}
                                    >
                                        {tierStatus === "waitlist"
                                            ? "⏳ Join Waitlist for Tier"
                                            : "✨ Order this Tier"}
                                    </Link>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Interactive Tier Illustrations Modal */}
            {activeModalTier && (
                <div
                    onClick={() => setActiveModalTier(null)}
                    style={{
                        position: "fixed",
                        inset: 0,
                        zIndex: 9999,
                        background: "rgba(13, 6, 24, 0.92)",
                        backdropFilter: "blur(10px)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "20px",
                    }}
                >
                    <div
                        className="card"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            maxWidth: "920px",
                            width: "100%",
                            maxHeight: "92vh",
                            overflowY: "auto",
                            padding: "28px",
                            border: "1px solid var(--border-cyan)",
                            display: "flex",
                            flexDirection: "column",
                            gap: "20px",
                        }}
                    >
                        {/* Modal Header */}
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                flexWrap: "wrap",
                                gap: "16px",
                                borderBottom: "1px solid var(--border)",
                                paddingBottom: "16px",
                            }}
                        >
                            <div>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "12px",
                                        flexWrap: "wrap",
                                    }}
                                >
                                    <h2 style={{ margin: 0 }}>
                                        {activeModalTier.title}
                                    </h2>
                                    <span
                                        style={{
                                            fontSize: "1.3rem",
                                            fontWeight: "bold",
                                            color: "var(--cyan)",
                                        }}
                                    >
                                        ${activeModalTier.priceBase} USD
                                    </span>
                                </div>
                                <p
                                    style={{
                                        color: "var(--muted)",
                                        fontSize: "0.9rem",
                                        margin: "4px 0 0 0",
                                    }}
                                >
                                    {activeModalTier.description}
                                </p>
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    gap: "10px",
                                    alignItems: "center",
                                }}
                            >
                                {activeModalTier.status !== "closed" && (
                                    <Link
                                        href={`/contact?subject=commission&tier=${encodeURIComponent(
                                            activeModalTier.title,
                                        )}`}
                                        className="btn btn-primary"
                                        style={{
                                            padding: "8px 20px",
                                            fontSize: "0.85rem",
                                        }}
                                    >
                                        ✨ Order this Tier
                                    </Link>
                                )}
                                <button
                                    type="button"
                                    className="btn btn-ghost"
                                    onClick={() => setActiveModalTier(null)}
                                    style={{ padding: "8px 16px" }}
                                >
                                    ✕ Close
                                </button>
                            </div>
                        </div>

                        {/* Modal Body: Carousel Viewer */}
                        {modalIllustrations.length === 0 ? (
                            <div
                                style={{
                                    padding: "48px 20px",
                                    textAlign: "center",
                                    color: "var(--muted)",
                                }}
                            >
                                <p>
                                    No sample illustrations have been linked to
                                    this commission type yet.
                                </p>
                            </div>
                        ) : (
                            <>
                                <div
                                    style={{
                                        position: "relative",
                                        background: "var(--bg-deep)",
                                        borderRadius: "16px",
                                        overflow: "hidden",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        minHeight: "360px",
                                    }}
                                >
                                    {currentSlide && (
                                        /* eslint-disable-next-line @next/next/no-img-element */
                                        <img
                                            src={currentSlide.imageUrl}
                                            alt={currentSlide.title}
                                            style={{
                                                maxHeight: "58vh",
                                                width: "auto",
                                                objectFit: "contain",
                                            }}
                                        />
                                    )}

                                    {/* Prev / Next Controls */}
                                    {modalIllustrations.length > 1 && (
                                        <>
                                            <button
                                                type="button"
                                                className="btn btn-ghost"
                                                onClick={() =>
                                                    setActiveSlideIndex(
                                                        (prev) =>
                                                            (prev -
                                                                1 +
                                                                modalIllustrations.length) %
                                                            modalIllustrations.length,
                                                    )
                                                }
                                                style={{
                                                    position: "absolute",
                                                    left: "14px",
                                                    padding: "10px 16px",
                                                    background:
                                                        "rgba(13, 6, 24, 0.8)",
                                                }}
                                            >
                                                ‹ Prev
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-ghost"
                                                onClick={() =>
                                                    setActiveSlideIndex(
                                                        (prev) =>
                                                            (prev + 1) %
                                                            modalIllustrations.length,
                                                    )
                                                }
                                                style={{
                                                    position: "absolute",
                                                    right: "14px",
                                                    padding: "10px 16px",
                                                    background:
                                                        "rgba(13, 6, 24, 0.8)",
                                                }}
                                            >
                                                Next ›
                                            </button>
                                        </>
                                    )}
                                </div>

                                {/* Current Artwork Metadata */}
                                {currentSlide && (
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            flexWrap: "wrap",
                                            gap: "12px",
                                            padding: "12px 16px",
                                            borderRadius: "12px",
                                            background:
                                                "rgba(255,255,255,0.03)",
                                        }}
                                    >
                                        <div>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "8px",
                                                    flexWrap: "wrap",
                                                }}
                                            >
                                                <strong>
                                                    {currentSlide.title}
                                                </strong>
                                                {currentSlide.category && (
                                                    <span className="tag cyan">
                                                        {currentSlide.category}
                                                    </span>
                                                )}
                                                {currentSlide.isCommission && (
                                                    <span className="tag pink">
                                                        Completed Commission
                                                        {currentSlide.clientName
                                                            ? ` • for ${currentSlide.clientName}`
                                                            : ""}
                                                    </span>
                                                )}
                                            </div>
                                            {currentSlide.description && (
                                                <p
                                                    style={{
                                                        color: "var(--muted)",
                                                        fontSize: "0.85rem",
                                                        margin: "4px 0 0 0",
                                                    }}
                                                >
                                                    {currentSlide.description}
                                                </p>
                                            )}
                                        </div>

                                        <span
                                            style={{
                                                color: "var(--muted)",
                                                fontSize: "0.85rem",
                                                fontWeight: 700,
                                            }}
                                        >
                                            {activeSlideIndex + 1} /{" "}
                                            {modalIllustrations.length}
                                        </span>
                                    </div>
                                )}

                                {/* Thumbnail Selector Strip */}
                                {modalIllustrations.length > 1 && (
                                    <div
                                        style={{
                                            display: "flex",
                                            gap: "10px",
                                            overflowX: "auto",
                                            paddingBottom: "4px",
                                        }}
                                    >
                                        {modalIllustrations.map((ill, idx) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() =>
                                                    setActiveSlideIndex(idx)
                                                }
                                                style={{
                                                    padding: 0,
                                                    background: "none",
                                                    border: "none",
                                                    cursor: "pointer",
                                                    flexShrink: 0,
                                                }}
                                            >
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={ill.imageUrl}
                                                    alt={ill.title}
                                                    style={{
                                                        width: "68px",
                                                        height: "68px",
                                                        borderRadius: "10px",
                                                        objectFit: "cover",
                                                        border:
                                                            idx ===
                                                            activeSlideIndex
                                                                ? "2px solid var(--cyan)"
                                                                : "1px solid var(--border)",
                                                        opacity:
                                                            idx ===
                                                            activeSlideIndex
                                                                ? 1
                                                                : 0.5,
                                                    }}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
