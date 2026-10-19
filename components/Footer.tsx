import React from "react";
import { SocialLinkItem } from "@/types";
import SocialIcon from "@/components/SocialIcon";

interface FooterProps {
    socialLinks?: SocialLinkItem[];
}

export default function Footer({ socialLinks = [] }: FooterProps) {
    const visibleLinks = socialLinks.filter((link) => link.enabled);

    return (
        <footer
            style={{
                borderTop: "1px solid var(--border)",
                padding: "40px 0",
                marginTop: "60px",
                background: "var(--bg-card2)",
            }}
        >
            <div className="container" style={{ textAlign: "center" }}>
                <h3
                    className="gradient-text"
                    style={{ fontSize: "1.5rem", marginBottom: "16px" }}
                >
                    LucyArt
                </h3>

                {visibleLinks.length > 0 && (
                    <div
                        style={{
                            display: "flex",
                            gap: "24px",
                            justifyContent: "center",
                            flexWrap: "wrap",
                            marginBottom: "24px",
                        }}
                    >
                        {visibleLinks.map((link) => (
                            <a
                                key={link.id || link.name}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="nav-link"
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "8px",
                                }}
                            >
                                <SocialIcon
                                    icon={link.icon}
                                    name={link.name}
                                    size={18}
                                />
                                <span>{link.name}</span>
                            </a>
                        ))}
                    </div>
                )}

                <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
                    © {new Date().getFullYear()} LucyArt. All rights reserved.
                    English speaking audience.
                </p>
            </div>
        </footer>
    );
}
