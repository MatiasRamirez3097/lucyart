import React from "react";
import Link from "next/link";
import { getPortfolioItems } from "@/app/actions/portfolio";
import { getAdoptables } from "@/app/actions/adoptables";
import { getInquiries } from "@/app/actions/commissions";
import { isDbConfigured } from "@/lib/mongodb";
import { getCloudinaryConfig } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
    const [portfolio, adoptables, inquiries] = await Promise.all([
        getPortfolioItems(),
        getAdoptables(),
        getInquiries(),
    ]);

    const dbReady = isDbConfigured();
    const cloudinaryReady = getCloudinaryConfig().isConfigured;

    const availableAdoptables = adoptables.filter(
        (a) => a.status === "available",
    ).length;
    const completedCommissionsCount = portfolio.filter(
        (p) => p.isCommission,
    ).length;
    const pendingInquiries = inquiries.filter(
        (i) => i.status === "pending",
    ).length;

    return (
        <div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "16px",
                    marginBottom: "28px",
                }}
            >
                <div>
                    <h1 style={{ marginBottom: "6px" }}>
                        Welcome back, Lucy ✨
                    </h1>
                    <p style={{ color: "var(--muted)", fontSize: "0.95rem" }}>
                        Manage your portfolio, upload completed commissions, and
                        track orders.
                    </p>
                </div>

                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                    <Link href="/admin/portfolio" className="btn btn-primary">
                        ➕ Upload Artwork / Commission
                    </Link>
                    <Link href="/admin/adoptables" className="btn btn-outline">
                        👾 New Adoptable
                    </Link>
                    <Link href="/admin/settings" className="btn btn-ghost">
                        ⚙️ Socials &amp; Discord
                    </Link>
                </div>
            </div>

            {/* Environment Status Banner */}
            {(!dbReady || !cloudinaryReady) && (
                <div
                    className="admin-card"
                    style={{
                        marginBottom: "28px",
                        borderColor: "var(--yellow)",
                        background: "rgba(255, 233, 61, 0.06)",
                    }}
                >
                    <h3
                        style={{
                            color: "var(--yellow)",
                            fontSize: "1.05rem",
                            marginBottom: "8px",
                        }}
                    >
                        ⚙️ Environment Configuration Status
                    </h3>
                    <p
                        style={{
                            color: "var(--muted)",
                            fontSize: "0.9rem",
                            marginBottom: "12px",
                        }}
                    >
                        Configure your credentials in <code>.env.local</code>{" "}
                        (or Vercel Project Settings) to enable live database
                        persistence and direct Cloudinary uploads:
                    </p>
                    <div
                        style={{
                            display: "flex",
                            gap: "12px",
                            flexWrap: "wrap",
                        }}
                    >
                        <span
                            className={`tag ${dbReady ? "available" : "pending"}`}
                        >
                            MongoDB Atlas:{" "}
                            {dbReady ? "Connected" : "Using Demo Fallback"}
                        </span>
                        <span
                            className={`tag ${cloudinaryReady ? "available" : "pending"}`}
                        >
                            Cloudinary:{" "}
                            {cloudinaryReady ? "Configured" : "Not Configured"}
                        </span>
                    </div>
                </div>
            )}

            {/* KPI Cards */}
            <div className="grid-3" style={{ marginBottom: "40px" }}>
                <div className="admin-card">
                    <h3
                        style={{
                            color: "var(--muted)",
                            fontSize: "0.95rem",
                            marginBottom: "8px",
                        }}
                    >
                        Portfolio &amp; Done Commissions
                    </h3>
                    <p
                        style={{
                            fontSize: "2.2rem",
                            fontWeight: "bold",
                            color: "var(--purple)",
                        }}
                    >
                        {portfolio.length}
                    </p>
                    <p style={{ color: "var(--muted)", fontSize: "0.8rem" }}>
                        {completedCommissionsCount} marked as completed
                        commissions
                    </p>
                </div>

                <div className="admin-card">
                    <h3
                        style={{
                            color: "var(--muted)",
                            fontSize: "0.95rem",
                            marginBottom: "8px",
                        }}
                    >
                        Active Adoptables
                    </h3>
                    <p
                        style={{
                            fontSize: "2.2rem",
                            fontWeight: "bold",
                            color: "var(--cyan)",
                        }}
                    >
                        {availableAdoptables}{" "}
                        <span
                            style={{
                                fontSize: "1rem",
                                color: "var(--muted)",
                                fontWeight: "normal",
                            }}
                        >
                            / {adoptables.length} total
                        </span>
                    </p>
                    <p style={{ color: "var(--muted)", fontSize: "0.8rem" }}>
                        Ready to be claimed by collectors
                    </p>
                </div>

                <div className="admin-card">
                    <h3
                        style={{
                            color: "var(--muted)",
                            fontSize: "0.95rem",
                            marginBottom: "8px",
                        }}
                    >
                        Pending Inquiries &amp; Orders
                    </h3>
                    <p
                        style={{
                            fontSize: "2.2rem",
                            fontWeight: "bold",
                            color: "var(--pink)",
                        }}
                    >
                        {pendingInquiries}
                    </p>
                    <p style={{ color: "var(--muted)", fontSize: "0.8rem" }}>
                        {inquiries.length} total messages received
                    </p>
                </div>
            </div>

            {/* Recent Client Inquiries Preview */}
            <div className="admin-card">
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "20px",
                    }}
                >
                    <h3 style={{ margin: 0 }}>Recent Client Requests</h3>
                    <Link
                        href="/admin/commissions"
                        className="btn btn-ghost"
                        style={{ padding: "6px 16px", fontSize: "0.85rem" }}
                    >
                        View All Requests →
                    </Link>
                </div>

                {inquiries.length === 0 ? (
                    <p style={{ color: "var(--muted)", fontSize: "0.95rem" }}>
                        No client requests yet. Submissions from the{" "}
                        <code>/contact</code> page will appear here.
                    </p>
                ) : (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "12px",
                        }}
                    >
                        {inquiries.slice(0, 5).map((inq) => (
                            <div
                                key={inq.id}
                                style={{
                                    padding: "16px",
                                    borderRadius: "12px",
                                    background: "rgba(255,255,255,0.03)",
                                    border: "1px solid var(--border)",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    gap: "16px",
                                    flexWrap: "wrap",
                                }}
                            >
                                <div>
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "10px",
                                            marginBottom: "4px",
                                        }}
                                    >
                                        <strong>{inq.name}</strong>
                                        <span
                                            style={{
                                                color: "var(--muted)",
                                                fontSize: "0.85rem",
                                            }}
                                        >
                                            ({inq.email})
                                        </span>
                                        <span className="tag pink">
                                            {inq.subject}
                                        </span>
                                        {inq.targetItem && (
                                            <span className="tag cyan">
                                                {inq.targetItem}
                                            </span>
                                        )}
                                    </div>
                                    <p
                                        style={{
                                            color: "var(--muted)",
                                            fontSize: "0.9rem",
                                            margin: 0,
                                        }}
                                    >
                                        {inq.message}
                                    </p>
                                </div>
                                <span
                                    className={`tag ${
                                        inq.status === "completed"
                                            ? "available"
                                            : inq.status === "in_progress"
                                              ? "pending"
                                              : "pink"
                                    }`}
                                >
                                    {inq.status}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
