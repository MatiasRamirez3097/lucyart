import React from "react";
import Link from "next/link";
import { getCommissionTiers } from "@/app/actions/commissions";
import { getPortfolioItems } from "@/app/actions/portfolio";
import CommissionsShowcaseClient from "@/components/CommissionsShowcaseClient";

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

                {/* Interactive Commission Cards + Illustrations Modal */}
                <CommissionsShowcaseClient
                    tiers={tiers}
                    portfolioItems={portfolioItems}
                />

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
