import Link from "next/link";
import React from "react";

export default function Navbar() {
    return (
        <header
            style={{ padding: "20px", borderBottom: "1px solid var(--border)" }}
        >
            <div
                className="container"
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Link href="/">
                    <h2
                        className="gradient-text"
                        style={{ margin: 0, fontSize: "1.8rem" }}
                    >
                        LucyArt
                    </h2>
                </Link>

                <nav style={{ display: "flex", gap: "24px" }}>
                    <Link href="/portfolio" className="nav-link">
                        Portfolio
                    </Link>
                    <Link href="/commissions" className="nav-link">
                        Commissions
                    </Link>
                    <Link href="/adoptables" className="nav-link">
                        Adoptables
                    </Link>
                    <Link href="/terms" className="nav-link">
                        T.O.S
                    </Link>
                </nav>

                <Link href="/contact" className="btn btn-outline">
                    Contact Me
                </Link>
            </div>
        </header>
    );
}
