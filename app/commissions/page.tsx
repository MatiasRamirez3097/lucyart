import React from "react";
import Link from "next/link";
import { getCommissionTiers } from "@/app/actions/commissions";
import { getPortfolioItems } from "@/app/actions/portfolio";

export const dynamic = "force-dynamic";

export default async function CommissionsPage() {
    const [tiers, portfolioItems] = await Promise.all([
        getCommissionTiers(),
        getPortfolioItems(),
    ]);

    const completedCommissions = portfolioItems.filter((item) =>
        Boolean(item.isCommission),
    );

    return (
        <section className="section">
            <div className="container">
                <header
                    className="section-header"
                    style={{ textAlign: "center" }}
                >
                    <h1 className="section-title gradient-text">
                        Commission Info
                    </h1>
                    <p className="section-subtitle">
                        Pricing, options, and examples of completed custom
                        digital art.
                    </p>
                </header>

                {/* TOS Reminder */}
                <div
                    className="card"
                    style={{
                        padding: "20px",
                        marginBottom: "40px",
                        borderColor: "var(--cyan)",
                        background: "rgba(0, 245, 255, 0.05)",
                    }}
                >
                    <p
                        style={{
                            textAlign: "center",
                            color: "var(--cyan)",
                            fontWeight: "bold",
                            margin: 0,
                        }}
                    >
                        Before ordering, please read my{" "}
                        <Link
                            href="/terms"
                            style={{ textDecoration: "underline" }}
                        >
                            Terms of Service
                        </Link>
                        . By commissioning me, you agree to these terms.
                    </p>
                </div>

                {/* Tiers Grid */}
                <div className="grid-3" style={{ alignItems: "start" }}>
                    {tiers.map((tier) => {
                        const linkedCommissionImages = completedCommissions
                            .filter((item) => item.commissionTierId === tier.id)
                            .map((item) => item.imageUrl);

                        const allExamples = Array.from(
                            new Set([
                                ...(tier.exampleImages || []),
                                ...linkedCommissionImages,
                            ]),
                        ).filter(Boolean);

                        const orderHref = `/contact?subject=commission&tier=${encodeURIComponent(
                            tier.title,
                        )}`;

                        return (
                            <div
                                key={tier.id}
                                className="card"
                                style={{
                                    padding: "24px",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "16px",
                                }}
                            >
                                <span className="tag pink">{tier.title}</span>

                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "baseline",
                                        gap: "4px",
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
                                    }}
                                >
                                    {tier.features.map((f) => (
                                        <li key={f}>{f}</li>
                                    ))}
                                </ul>

                                {allExamples.length > 0 && (
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
                                                Tier Examples:
                                            </p>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    gap: "10px",
                                                    flexWrap: "wrap",
                                                }}
                                            >
                                                {allExamples.map((img, i) => (
                                                    <a
                                                        key={i}
                                                        href={img}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img
                                                            src={img}
                                                            alt={`${tier.title} example`}
                                                            style={{
                                                                width: "64px",
                                                                height: "64px",
                                                                borderRadius:
                                                                    "8px",
                                                                objectFit:
                                                                    "cover",
                                                                border: "1px solid var(--border)",
                                                            }}
                                                        />
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}

                                <Link
                                    href={orderHref}
                                    className="btn btn-primary"
                                    style={{
                                        marginTop: "16px",
                                        width: "100%",
                                        justifyContent: "center",
                                    }}
                                >
                                    Order this Tier
                                </Link>
                            </div>
                        );
                    })}
                </div>

                {/* Recent Completed Commissions Showcase */}
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
                                    Real examples of finished commissions
                                    delivered to clients.
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
                                                    justifyContent:
                                                        "space-between",
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
            </div>
        </section>
    );
}
