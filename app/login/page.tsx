import React from "react";
import Link from "next/link";
import LoginFormClient from "@/components/LoginFormClient";

interface LoginPageProps {
    searchParams: Promise<{
        callbackUrl?: string;
    }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
    const params = await searchParams;
    const callbackUrl = params.callbackUrl || "/admin";

    return (
        <section className="section">
            <div className="container" style={{ maxWidth: "460px" }}>
                <header
                    className="section-header"
                    style={{ textAlign: "center", marginBottom: "32px" }}
                >
                    <h1
                        className="section-title gradient-text"
                        style={{ fontSize: "2.6rem" }}
                    >
                        Portal Access
                    </h1>
                    <p
                        className="section-subtitle"
                        style={{ marginBottom: 0, fontSize: "0.95rem" }}
                    >
                        Sign in to manage LucyArt or view your account.
                    </p>
                </header>

                <LoginFormClient callbackUrl={callbackUrl} />

                <div
                    style={{
                        marginTop: "24px",
                        textAlign: "center",
                        fontSize: "0.85rem",
                        color: "var(--muted)",
                    }}
                >
                    <Link
                        href="/"
                        className="nav-link"
                        style={{ color: "var(--cyan)" }}
                    >
                        ← Back to Public Gallery
                    </Link>
                </div>
            </div>
        </section>
    );
}
