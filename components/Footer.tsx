// components/Footer.tsx
import React from "react";

export default function Footer() {
    const socialLinks = [
        { name: "Twitter / X", url: "#", icon: "🐦" }, // Puedes usar SVGs de react-icons luego
        { name: "DeviantArt", url: "#", icon: "🎨" },
        { name: "Instagram", url: "#", icon: "📸" },
        { name: "Trello (Status)", url: "#", icon: "📋" },
    ];

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

                <div
                    style={{
                        display: "flex",
                        gap: "20px",
                        justifyContent: "center",
                        marginBottom: "24px",
                    }}
                >
                    {socialLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="nav-link" // Reutilizamos el estilo de link animado
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                            }}
                        >
                            <span>{link.icon}</span>
                            {link.name}
                        </a>
                    ))}
                </div>

                <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
                    © {new Date().getFullYear()} LucyArt. All rights reserved.
                    English speaking audience.
                </p>
            </div>
        </footer>
    );
}
