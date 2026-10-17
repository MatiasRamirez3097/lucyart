import React from "react";
import { getPortfolioItems } from "@/app/actions/portfolio";
import PortfolioGalleryClient from "@/components/PortfolioGalleryClient";

export const dynamic = "force-dynamic";

export default async function PortfolioPage() {
    const portfolioItems = await getPortfolioItems();

    return (
        <section className="section">
            <div className="container">
                <header
                    className="section-header"
                    style={{ textAlign: "center" }}
                >
                    <h1 className="section-title gradient-text">
                        Art Portfolio &amp; Commissions
                    </h1>
                    <p className="section-subtitle">
                        A collection of my original digital illustrations and
                        completed client commissions.
                    </p>
                </header>

                <PortfolioGalleryClient items={portfolioItems} />
            </div>
        </section>
    );
}
