import React from "react";
import Link from "next/link";
import AdoptableCard from "@/components/AdoptableCard";
import { getAdoptables } from "@/app/actions/adoptables";
import { getPortfolioItems } from "@/app/actions/portfolio";

export const dynamic = "force-dynamic";

export default async function Home() {
    const [adoptables, portfolioItems] = await Promise.all([
        getAdoptables(),
        getPortfolioItems(),
    ]);

    const featuredArtworks = portfolioItems.filter((item) => item.featured);
    const showcaseArtworks =
        featuredArtworks.length > 0
            ? featuredArtworks.slice(0, 4)
            : portfolioItems.slice(0, 4);

    return (
        <section className="section">
            <div className="container">
                {/* Hero Section */}
                <div
                    className="section-header"
                    style={{ textAlign: "center", padding: "60px 0" }}
                >
                    <h1
                        className="section-title gradient-text"
                        style={{ fontSize: "4rem" }}
                    >
                        Vibrant Digital Art
                    </h1>
                    <p
                        className="section-subtitle"
                        style={{
                            maxWidth: "600px",
                            margin: "0 auto 32px auto",
                        }}
                    >
                        Welcome to my creative universe. I specialize in
                        anime-influenced, colorful illustrations, custom
                        commissions, and unique adoptable characters.
                    </p>

                    <div
                        style={{
                            display: "flex",
                            gap: "16px",
                            justifyContent: "center",
                        }}
                    >
                        <Link href="/commissions" className="btn btn-primary">
                            Commission Info
                        </Link>
                        <Link href="/portfolio" className="btn btn-ghost">
                            View Portfolio
                        </Link>
                    </div>
                </div>

                {/* Featured Portfolio & Completed Commissions Preview */}
                {showcaseArtworks.length > 0 && (
                    <>
                        <div
                            className="separator"
                            style={{ margin: "60px 0" }}
                        ></div>

                        <div>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    flexWrap: "wrap",
                                    gap: "16px",
                                    marginBottom: "24px",
                                }}
                            >
                                <h2 style={{ margin: 0 }}>
                                    Featured Art &amp; Commissions
                                </h2>
                                <Link
                                    href="/portfolio"
                                    className="btn btn-outline"
                                    style={{
                                        padding: "8px 18px",
                                        fontSize: "0.85rem",
                                    }}
                                >
                                    Explore Full Gallery →
                                </Link>
                            </div>

                            <div className="grid-4">
                                {showcaseArtworks.map((item) => (
                                    <Link
                                        key={item.id}
                                        href="/portfolio"
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
                                                src={item.imageUrl}
                                                alt={item.title}
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    objectFit: "cover",
                                                }}
                                            />
                                            {item.isCommission && (
                                                <div
                                                    style={{
                                                        position: "absolute",
                                                        top: "10px",
                                                        left: "10px",
                                                    }}
                                                >
                                                    <span className="tag pink">
                                                        Commissioned
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
                                                        "linear-gradient(to top, rgba(13,6,24,0.92), transparent)",
                                                }}
                                            >
                                                <h3
                                                    style={{
                                                        fontSize: "1rem",
                                                        margin: "0 0 4px 0",
                                                    }}
                                                >
                                                    {item.title}
                                                </h3>
                                                <span
                                                    className="tag cyan"
                                                    style={{
                                                        fontSize: "0.6rem",
                                                    }}
                                                >
                                                    {item.category}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                <div className="separator" style={{ margin: "60px 0" }}></div>

                {/* Featured Adoptables Preview */}
                <div>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: "16px",
                            marginBottom: "24px",
                        }}
                    >
                        <h2 style={{ margin: 0 }}>Latest Adoptables</h2>
                        <Link
                            href="/adoptables"
                            className="btn btn-ghost"
                            style={{ padding: "8px 18px", fontSize: "0.85rem" }}
                        >
                            View All Adoptables →
                        </Link>
                    </div>
                    <div className="grid-3">
                        {adoptables.slice(0, 3).map((item) => (
                            <AdoptableCard key={item.id} adoptable={item} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
