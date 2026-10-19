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

                {/* Interactive Commission Cards + Illustrations Modal + Completed Commissions */}
                <CommissionsShowcaseClient
                    tiers={tiers}
                    portfolioItems={portfolioItems}
                />
            </div>
        </section>
    );
}
