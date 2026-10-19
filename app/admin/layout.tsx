import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import "../globals.css";
import { getSession } from "@/lib/auth";
import { logoutAction } from "@/app/actions/auth";

export const metadata = {
    title: "Admin Panel | LucyArt",
};

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();

    if (!session || session.role !== "admin") {
        redirect("/login");
    }

    return (
        <div className="admin-layout">
            {/* Sidebar Lateral */}
            <aside className="admin-sidebar">
                <div style={{ padding: "0 24px", marginBottom: "28px" }}>
                    <h2
                        className="gradient-text"
                        style={{ fontSize: "1.5rem", margin: "0 0 8px 0" }}
                    >
                        Lucy Admin
                    </h2>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            flexWrap: "wrap",
                        }}
                    >
                        <span
                            style={{
                                fontSize: "0.85rem",
                                color: "var(--white)",
                                fontWeight: 700,
                            }}
                        >
                            {session.name}
                        </span>
                        <span className="tag available">
                            {session.role}
                        </span>
                    </div>
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

                    <form action={logoutAction} style={{ width: "100%" }}>
                        <button
                            type="submit"
                            className="btn btn-danger"
                            style={{
                                width: "100%",
                                justifyContent: "flex-start",
                            }}
                        >
                            🚪 Logout
                        </button>
                    </form>
                </nav>
            </aside>

            {/* Contenido Principal */}
            <main className="admin-content">{children}</main>
        </div>
    );
}
