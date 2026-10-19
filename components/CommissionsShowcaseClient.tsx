"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CommissionTier, PortfolioItem } from "@/types";
import { useNsfw } from "@/components/NsfwProvider";
import NsfwToggle from "@/components/NsfwToggle";

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
    isNsfw?: boolean;
}

export default function CommissionsShowcaseClient({
    tiers,
    portfolioItems,
}: CommissionsShowcaseClientProps) {
    const { showNsfw } = useNsfw();
    const [activeModalTier, setActiveModalTier] =
        useState<CommissionTier | null>(null);
    const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);

    // Filter tiers: hide exclusive NSFW tiers unless showNsfw is enabled
    const visibleTiers = tiers.filter((tier) =>
        showNsfw ? true : !tier.isNsfw,
    );

    const hiddenNsfwTiersCount = tiers.filter((t) => Boolean(t.isNsfw)).length;
    const nsfwSampleWorksCount = portfolioItems.filter((p) =>
        Boolean(p.isNsfw),
    ).length;

    // Build rich illustration list for a given Commission Tier, respecting NSFW filter
    function getIllustrationsForTier(tier: CommissionTier): TierIllustration[] {
        const map = new Map<string, TierIllustration>();

        // 1. Portfolio items explicitly linked via commissionTierId or matching categoryMatch
        for (const item of portfolioItems) {
            if (item.isNsfw && !showNsfw) continue;

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
                    isNsfw: Boolean(item.isNsfw),
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
                    if (matchedPortfolio.isNsfw && !showNsfw) continue;
                    map.set(url, {
                        imageUrl: url,
                        title: matchedPortfolio.title,
                        category: matchedPortfolio.category,
                        isCommission: matchedPortfolio.isCommission,
                        clientName: matchedPortfolio.clientName,
                        description: matchedPortfolio.description,
                        isNsfw: Boolean(matchedPortfolio.isNsfw),
                    });
                } else {
                    if (tier.isNsfw && !showNsfw) continue;
                    map.set(url, {
                        imageUrl: url,
                        title: `${tier.title} Sample`,
                        category: tier.categoryMatch || tier.title,
                        isNsfw: Boolean(tier.isNsfw),
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

    const effectiveModalTier =
        activeModalTier && (!activeModalTier.isNsfw || showNsfw)
            ? activeModalTier
            : null;

    const modalIllustrations = effectiveModalTier
        ? getIllustrationsForTier(effectiveModalTier)
        : [];
    const currentSlide =
        modalIllustrations[activeSlideIndex] || modalIllustrations[0] || null;

    const completedCommissions = portfolioItems.filter(
        (item) => Boolean(item.isCommission) && (showNsfw ? true : !item.isNsfw),
    );

    return (
        <>
            {/* Top Bar with 18+ NSFW Control */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "12px",
                    marginBottom: "28px",
                }}
            >
                <div style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
                    {!showNsfw && hiddenNsfwTiersCount > 0 ? (
                        <span>
                            🔞{" "}
                            <strong>
                                {hiddenNsfwTiersCount} exclusive NSFW (18+)
                                commission tier
                                {hiddenNsfwTiersCount > 1 ? "s" : ""}
                            </strong>{" "}
                            and 18+ sample illustrations are currently hidden.
                        </span>
                    ) : (
                        <span>
                            Select a commission tier below to inspect finished
                            examples or place an order.
                        </span>
                    )}
                </div>

                <NsfwToggle
                    nsfwCount={hiddenNsfwTiersCount + nsfwSampleWorksCount}
                    label="Show NSFW (18+) Options & Examples"
                />
            </div>

            {/* Tiers Grid */}
            <div className="grid-3" style={{ alignItems: "stretch" }}>
                {visibleTiers.map((tier) => {
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
                                border: tier.isNsfw
                                    ? "1px solid rgba(255, 45, 120, 0.55)"
                                    : undefined,
                            }}
                        >
                            {/* Header Badges */}
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    gap: "8px",
                                    flexWrap: "wrap",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        gap: "6px",
                                        alignItems: "center",
                                        flexWrap: "wrap",
                                    }}
                                >
                                    <span className="tag pink">
                                        {tier.title}
                                    </span>
                                    {tier.isNsfw && (
                                        <span className="tag sold">
                                            🔞 18+ Exclusive
                                        </span>
                                    )}
                                </div>
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

                            {/* NSFW Availability Notice on Pricing Card */}
                            <div>
                                {tier.isNsfw ? (
                                    <span
                                        style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: "6px",
                                            fontSize: "0.75rem",
                                            fontWeight: 700,
                                            padding: "4px 10px",
                                            borderRadius: "999px",
                                            background:
                                                "rgba(255, 45, 120, 0.16)",
                                            color: "var(--pink-light)",
                                            border: "1px solid rgba(255, 45, 120, 0.4)",
                                        }}
                                    >
                                        🔞 Adult (18+) Commission Tier
                                    </span>
                                ) : tier.nsfwAvailable ? (
                                    <span
                                        style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: "6px",
                                            fontSize: "0.75rem",
                                            fontWeight: 700,
                                            padding: "4px 10px",
                                            borderRadius: "999px",
                                            background:
                                                "rgba(255, 45, 120, 0.12)",
                                            color: "var(--pink-light)",
                                            border: "1px solid rgba(255, 45, 120, 0.3)",
                                        }}
                                    >
                                        🔞 NSFW (18+) Version Available
                                    </span>
                                ) : (
                                    <span
                                        style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: "6px",
                                            fontSize: "0.75rem",
                                            fontWeight: 700,
                                            padding: "4px 10px",
                                            borderRadius: "999px",
                                            background:
                                                "rgba(0, 245, 255, 0.08)",
                                            color: "var(--cyan)",
                                            border: "1px solid rgba(0, 245, 255, 0.25)",
                                        }}
                                    >
                                        🛡️ SFW Only (All Ages)
                                    </span>
                                )}
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
                                                                border: ill.isNsfw
                                                                    ? "1px solid var(--pink)"
                                                                    : "1px solid var(--border-cyan)",
                                                            }}
                                                        />
                                                        {ill.isNsfw && (
                                                            <span
                                                                style={{
                                                                    position:
                                                                        "absolute",
                                                                    top: "2px",
                                                                    right: "2px",
                                                                    background:
                                                                        "rgba(255,45,120,0.9)",
                                                                    color: "#fff",
                                                                    fontSize:
                                                                        "0.55rem",
                                                                    fontWeight: 800,
                                                                    padding:
                                                                        "1px 4px",
                                                                    borderRadius:
                                                                        "4px",
                                                                }}
                                                            >
                                                                18+
                                                            </span>
                                                        )}
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

            {/* Recently Completed Commissions Showcase (Filtered by NSFW state) */}
            {completedCommissions.length > 0 && (
                <div style={{ marginTop: "80px" }}>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: "16px",
                            marginBottom: "28px",
                        }}
                    >
                        <div>
                            <h2 style={{ marginBottom: "4px" }}>
                                ✨ Recently Completed Commissions
                            </h2>
                            <p
                                style={{
                                    color: "var(--muted)",
                                    fontSize: "0.95rem",
                                }}
                            >
                                Real examples of finished commissions delivered
                                to clients.
                            </p>
                        </div>
                        <Link href="/portfolio" className="btn btn-outline">
                            View Full Portfolio →
                        </Link>
                    </div>

                    <div className="grid-4">
                        {completedCommissions.slice(0, 4).map((work) => (
                            <div
                                key={work.id}
                                className="card holo-card"
                                style={{ overflow: "hidden" }}
                            >
                                <div
                                    style={{
                                        position: "relative",
                                        aspectRatio: "3/4",
                                        background: "var(--bg-deep)",
                                    }}
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={work.imageUrl}
                                        alt={work.title}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                        }}
                                    />
                                    {work.isNsfw && (
                                        <div
                                            style={{
                                                position: "absolute",
                                                top: "10px",
                                                right: "10px",
                                            }}
                                        >
                                            <span className="tag sold">
                                                🔞 18+
                                            </span>
                                        </div>
                                    )}
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
                                                fontSize: "1rem",
                                                margin: "0 0 4px 0",
                                            }}
                                        >
                                            {work.title}
                                        </h3>
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                            }}
                                        >
                                            <span
                                                className="tag cyan"
                                                style={{
                                                    fontSize: "0.65rem",
                                                }}
                                            >
                                                {work.category}
                                            </span>
                                            {work.clientName && (
                                                <span
                                                    style={{
                                                        fontSize: "0.75rem",
                                                        color: "var(--pink-light)",
                                                        fontWeight: 700,
                                                    }}
                                                >
                                                    for {work.clientName}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Interactive Tier Illustrations Modal */}
            {effectiveModalTier && (
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
                                        {effectiveModalTier.title}
                                    </h2>
                                    <span
                                        style={{
                                            fontSize: "1.3rem",
                                            fontWeight: "bold",
                                            color: "var(--cyan)",
                                        }}
                                    >
                                        ${effectiveModalTier.priceBase} USD
                                    </span>
                                    {(effectiveModalTier.isNsfw ||
                                        effectiveModalTier.nsfwAvailable) && (
                                        <span className="tag pink">
                                            🔞 NSFW (18+) Available
                                        </span>
                                    )}
                                </div>
                                <p
                                    style={{
                                        color: "var(--muted)",
                                        fontSize: "0.9rem",
                                        margin: "4px 0 0 0",
                                    }}
                                >
                                    {effectiveModalTier.description}
                                </p>
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    gap: "10px",
                                    alignItems: "center",
                                }}
                            >
                                {effectiveModalTier.status !== "closed" && (
                                    <Link
                                        href={`/contact?subject=commission&tier=${encodeURIComponent(
                                            effectiveModalTier.title,
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
                                    {!showNsfw && nsfwSampleWorksCount > 0
                                        ? " (Enable the 🔞 Show NSFW switch to view 18+ examples if applicable.)"
                                        : ""}
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
                                                {currentSlide.isNsfw && (
                                                    <span className="tag sold">
                                                        🔞 NSFW (18+)
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
                                                    position: "relative",
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
