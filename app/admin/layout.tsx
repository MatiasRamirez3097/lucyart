import React from "react";
import Link from "next/link";
import "../globals.css"; // Aseguramos que tome los estilos globales

export const metadata = {
    title: "Admin Panel | LucyArt",
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="admin-layout">
            {/* Sidebar Lateral */}
            <aside className="admin-sidebar">
                <div style={{ padding: "0 24px", marginBottom: "40px" }}>
                    <h2
                        className="gradient-text"
                        style={{ fontSize: "1.5rem", margin: 0 }}
                    >
                        Lucy Admin
                    </h2>
                </div>

                <nav
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                        padding: "0 16px",
                    }}
                >
                    <Link
                        href="/admin"
                        className="btn btn-ghost"
                        style={{ justifyContent: "flex-start" }}
                    >
                        📊 Dashboard
                    </Link>
                    <Link
                        href="/admin/portfolio"
                        className="btn btn-ghost"
                        style={{ justifyContent: "flex-start" }}
                    >
                        🖼️ Portfolio
                    </Link>
                    <Link
                        href="/admin/adoptables"
                        className="btn btn-ghost"
                        style={{ justifyContent: "flex-start" }}
                    >
                        👾 Adoptables
                    </Link>
                    <Link
                        href="/admin/commissions"
                        className="btn btn-ghost"
                        style={{ justifyContent: "flex-start" }}
                    >
                        📝 Commissions
                    </Link>

                    <div
                        className="separator"
                        style={{ margin: "16px 0" }}
                    ></div>

                    <Link
                        href="/"
                        target="_blank"
                        className="btn btn-outline"
                        style={{ justifyContent: "flex-start" }}
                    >
                        👁️ View Live Site
                    </Link>
                    <button
                        className="btn btn-danger"
                        style={{
                            justifyContent: "flex-start",
                            marginTop: "auto",
                        }}
                    >
                        🚪 Logout
                    </button>
                </nav>
            </aside>

            {/* Contenido Principal */}
            <main className="admin-content">{children}</main>
        </div>
    );
}
