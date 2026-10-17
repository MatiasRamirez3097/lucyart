import React from "react";
import Link from "next/link";
import { getAdoptables } from "@/app/actions/adoptables";
import AdoptablesCatalogClient from "@/components/AdoptablesCatalogClient";

export const dynamic = "force-dynamic";

export default async function AdoptablesPage() {
    const adoptables = await getAdoptables();

    return (
        <section className="section">
            <div className="container">
                <header
                    className="section-header"
                    style={{ textAlign: "center" }}
                >
                    <h1 className="section-title gradient-text">Adoptables</h1>
                    <p className="section-subtitle">
                        Unique, ready-to-use character designs. Once you buy
                        them, they are yours!
                    </p>
                </header>

                <AdoptablesCatalogClient adoptables={adoptables} />

                {/* Información extra de TOS para adoptables */}
                <div
                    className="card"
                    style={{
                        marginTop: "60px",
                        padding: "30px",
                        textAlign: "center",
                    }}
                >
                    <h3 style={{ marginBottom: "16px", color: "var(--pink)" }}>
                        How to Claim?
                    </h3>
                    <p
                        style={{
                            color: "var(--muted)",
                            maxWidth: "700px",
                            margin: "0 auto",
                        }}
                    >
                        To claim an available adoptable, click the{" "}
                        <strong>&ldquo;Claim&rdquo;</strong> button to send me a
                        direct request through the contact form, or DM me on my
                        social media. Payments are processed via PayPal. Please
                        read the{" "}
                        <Link
                            href="/terms"
                            style={{
                                color: "var(--cyan)",
                                textDecoration: "underline",
                            }}
                        >
                            Terms of Service
                        </Link>{" "}
                        regarding commercial use for adoptables.
                    </p>
                </div>
            </div>
        </section>
    );
}
