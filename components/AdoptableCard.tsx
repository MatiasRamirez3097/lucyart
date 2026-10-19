import React from "react";
import Link from "next/link";
import { Adoptable } from "@/types";

interface AdoptableCardProps {
    adoptable: Adoptable;
}

export default function AdoptableCard({ adoptable }: AdoptableCardProps) {
    const claimHref = `/contact?subject=adoptable&item=${encodeURIComponent(
        adoptable.title,
    )}`;

    return (
        <div
            className="card holo-card"
            style={{
                padding: "20px",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <div
                style={{
                    position: "relative",
                    height: "240px",
                    background: "var(--bg-deep)",
                    borderRadius: "12px",
                    marginBottom: "16px",
                    backgroundImage: adoptable.imageUrl
                        ? `url(${adoptable.imageUrl})`
                        : undefined,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {adoptable.isNsfw && (
                    <span
                        className="tag sold"
                        style={{
                            position: "absolute",
                            top: "10px",
                            right: "10px",
                            background: "rgba(255, 45, 120, 0.9)",
                            color: "#fff",
                        }}
                    >
                        🔞 18+
                    </span>
                )}
                {!adoptable.imageUrl && (
                    <span style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
                        Character Preview
                    </span>
                )}
            </div>

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "12px",
                }}
            >
                <h3 style={{ fontSize: "1.2rem", margin: 0 }}>
                    {adoptable.title}
                </h3>
                <span className={`tag ${adoptable.status}`}>
                    {adoptable.status}
                </span>
            </div>

            <p
                style={{
                    color: "var(--muted)",
                    fontSize: "0.9rem",
                    marginBottom: "16px",
                    flex: 1,
                }}
            >
                {adoptable.description}
            </p>

            {adoptable.owner && adoptable.status === "sold" && (
                <p
                    style={{
                        color: "var(--pink-light)",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        marginBottom: "12px",
                    }}
                >
                    Adopted by {adoptable.owner}
                </p>
            )}

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "auto",
                }}
            >
                <span style={{ fontWeight: "bold", color: "var(--cyan)" }}>
                    ${adoptable.price} USD
                </span>

                {adoptable.status === "available" ? (
                    <Link
                        href={claimHref}
                        className="btn btn-outline"
                        style={{ padding: "8px 18px", fontSize: "0.85rem" }}
                    >
                        Claim
                    </Link>
                ) : (
                    <button
                        type="button"
                        className="btn btn-outline"
                        style={{ padding: "8px 16px", fontSize: "0.8rem" }}
                        disabled
                    >
                        Unavailable
                    </button>
                )}
            </div>
        </div>
    );
}
