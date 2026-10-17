"use client";

import React, { useState, useTransition } from "react";
import { CommissionTier, Inquiry, InquiryStatus } from "@/types";
import ImageUploader from "@/components/ImageUploader";
import {
    deleteCommissionTier,
    deleteInquiry,
    saveCommissionTier,
    updateInquiryStatus,
} from "@/app/actions/commissions";

interface AdminCommissionsClientProps {
    initialTiers: CommissionTier[];
    initialInquiries: Inquiry[];
}

export default function AdminCommissionsClient({
    initialTiers,
    initialInquiries,
}: AdminCommissionsClientProps) {
    const [isPending, startTransition] = useTransition();
    const [activeTab, setActiveTab] = useState<"inquiries" | "tiers">(
        "inquiries",
    );
    const [toast, setToast] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);

    // Tier form state
    const [editingId, setEditingId] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const [priceBase, setPriceBase] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [featuresText, setFeaturesText] = useState<string>(
        "1 Character\nSimple Background\nPersonal Use",
    );
    const [exampleImages, setExampleImages] = useState<string[]>([]);
    const [order, setOrder] = useState<string>("1");
    const [tempUploadedUrl, setTempUploadedUrl] = useState<string>("");

    function showToast(type: "success" | "error", text: string) {
        setToast({ type, text });
        setTimeout(() => setToast(null), 4000);
    }

    function resetTierForm() {
        setEditingId("");
        setTitle("");
        setPriceBase("");
        setDescription("");
        setFeaturesText("1 Character\nSimple Background\nPersonal Use");
        setExampleImages([]);
        setOrder(String(initialTiers.length + 1));
        setTempUploadedUrl("");
    }

    function handleEditTier(tier: CommissionTier) {
        setEditingId(tier.id);
        setTitle(tier.title);
        setPriceBase(String(tier.priceBase));
        setDescription(tier.description);
        setFeaturesText((tier.features || []).join("\n"));
        setExampleImages(tier.exampleImages || []);
        setOrder(String(tier.order ?? 1));
        setActiveTab("tiers");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function handleTierSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const formData = new FormData();
        if (editingId) formData.set("id", editingId);
        formData.set("title", title);
        formData.set("priceBase", priceBase);
        formData.set("description", description);
        formData.set("features", featuresText);
        formData.set("exampleImages", exampleImages.join("\n"));
        formData.set("order", order);

        startTransition(async () => {
            const res = await saveCommissionTier(formData);
            if (res.success) {
                showToast("success", res.message);
                resetTierForm();
            } else {
                showToast("error", res.message);
            }
        });
    }

    function handleDeleteTier(id: string, tierTitle: string) {
        if (!window.confirm(`Delete tier "${tierTitle}"?`)) return;
        startTransition(async () => {
            const res = await deleteCommissionTier(id);
            if (res.success) {
                showToast("success", res.message);
                if (editingId === id) resetTierForm();
            } else {
                showToast("error", res.message);
            }
        });
    }

    function handleStatusChange(id: string, status: InquiryStatus) {
        startTransition(async () => {
            const res = await updateInquiryStatus(id, status);
            if (res.success) {
                showToast("success", res.message);
            } else {
                showToast("error", res.message);
            }
        });
    }

    function handleDeleteInquiry(id: string) {
        if (!window.confirm("Delete this inquiry permanently?")) return;
        startTransition(async () => {
            const res = await deleteInquiry(id);
            if (res.success) {
                showToast("success", res.message);
            } else {
                showToast("error", res.message);
            }
        });
    }

    return (
        <div>
            {toast && (
                <div className={`toast ${toast.type}`}>{toast.text}</div>
            )}

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
                    <h2 style={{ marginBottom: "4px" }}>
                        Commissions &amp; Client Requests
                    </h2>
                    <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
                        Track incoming commission orders and manage your pricing
                        tiers &amp; examples.
                    </p>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                    <button
                        type="button"
                        className={
                            activeTab === "inquiries"
                                ? "btn btn-primary"
                                : "btn btn-ghost"
                        }
                        onClick={() => setActiveTab("inquiries")}
                    >
                        📬 Client Requests ({initialInquiries.length})
                    </button>
                    <button
                        type="button"
                        className={
                            activeTab === "tiers"
                                ? "btn btn-primary"
                                : "btn btn-ghost"
                        }
                        onClick={() => setActiveTab("tiers")}
                    >
                        💎 Pricing Tiers ({initialTiers.length})
                    </button>
                </div>
            </div>

            {activeTab === "inquiries" ? (
                <div className="admin-card">
                    <h3 style={{ marginBottom: "20px" }}>
                        Incoming Orders, Claims &amp; Messages
                    </h3>

                    {initialInquiries.length === 0 ? (
                        <p style={{ color: "var(--muted)" }}>
                            No requests received yet. When clients submit the
                            form at <code>/contact</code>, they will appear
                            here.
                        </p>
                    ) : (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "16px",
                            }}
                        >
                            {initialInquiries.map((inq) => (
                                <div
                                    key={inq.id}
                                    style={{
                                        padding: "20px",
                                        borderRadius: "14px",
                                        background: "rgba(255,255,255,0.03)",
                                        border: "1px solid var(--border)",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "12px",
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            flexWrap: "wrap",
                                            gap: "12px",
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "10px",
                                                flexWrap: "wrap",
                                            }}
                                        >
                                            <strong
                                                style={{ fontSize: "1.1rem" }}
                                            >
                                                {inq.name}
                                            </strong>
                                            <a
                                                href={`mailto:${inq.email}`}
                                                style={{
                                                    color: "var(--cyan)",
                                                    fontSize: "0.9rem",
                                                    textDecoration: "underline",
                                                }}
                                            >
                                                {inq.email}
                                            </a>
                                            <span className="tag pink">
                                                {inq.subject}
                                            </span>
                                            {inq.targetItem && (
                                                <span className="tag cyan">
                                                    Target: {inq.targetItem}
                                                </span>
                                            )}
                                        </div>

                                        <span
                                            style={{
                                                color: "var(--muted)",
                                                fontSize: "0.8rem",
                                            }}
                                        >
                                            {new Date(
                                                inq.createdAt,
                                            ).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <p
                                        style={{
                                            color: "var(--white)",
                                            fontSize: "0.95rem",
                                            whiteSpace: "pre-wrap",
                                            margin: 0,
                                        }}
                                    >
                                        {inq.message}
                                    </p>

                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            flexWrap: "wrap",
                                            gap: "10px",
                                            paddingTop: "8px",
                                            borderTop:
                                                "1px solid rgba(255,255,255,0.06)",
                                        }}
                                    >
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
                                                    fontSize: "0.8rem",
                                                    color: "var(--muted)",
                                                }}
                                            >
                                                Status:
                                            </span>
                                            {(
                                                [
                                                    "pending",
                                                    "in_progress",
                                                    "completed",
                                                    "archived",
                                                ] as InquiryStatus[]
                                            ).map((st) => (
                                                <button
                                                    key={st}
                                                    type="button"
                                                    disabled={isPending}
                                                    onClick={() =>
                                                        handleStatusChange(
                                                            inq.id,
                                                            st,
                                                        )
                                                    }
                                                    className={
                                                        inq.status === st
                                                            ? "btn btn-outline"
                                                            : "btn btn-ghost"
                                                    }
                                                    style={{
                                                        padding: "4px 12px",
                                                        fontSize: "0.75rem",
                                                    }}
                                                >
                                                    {st.replace("_", " ")}
                                                </button>
                                            ))}
                                        </div>

                                        <button
                                            type="button"
                                            className="btn btn-danger"
                                            style={{
                                                padding: "6px 12px",
                                                fontSize: "0.75rem",
                                            }}
                                            disabled={isPending}
                                            onClick={() =>
                                                handleDeleteInquiry(inq.id)
                                            }
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    {/* Create / Edit Tier Form */}
                    <div
                        className="admin-card"
                        style={{
                            marginBottom: "32px",
                            border: "1px solid var(--border-cyan)",
                        }}
                    >
                        <h3
                            style={{
                                marginBottom: "20px",
                                color: "var(--cyan)",
                            }}
                        >
                            {editingId
                                ? "✏️ Edit Commission Tier"
                                : "➕ Create Commission Tier"}
                        </h3>

                        <form
                            onSubmit={handleTierSubmit}
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(auto-fit, minmax(220px, 1fr))",
                                gap: "20px",
                            }}
                        >
                            <div className="input-group">
                                <label className="input-label">
                                    Tier Title *
                                </label>
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="e.g. Full Color Portrait"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label className="input-label">
                                    Base Price (USD) *
                                </label>
                                <input
                                    type="number"
                                    className="input"
                                    placeholder="90"
                                    value={priceBase}
                                    onChange={(e) =>
                                        setPriceBase(e.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label className="input-label">
                                    Display Order
                                </label>
                                <input
                                    type="number"
                                    className="input"
                                    value={order}
                                    onChange={(e) => setOrder(e.target.value)}
                                />
                            </div>

                            <div
                                className="input-group"
                                style={{ gridColumn: "1 / -1" }}
                            >
                                <label className="input-label">
                                    Short Description *
                                </label>
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="Fully shaded illustration with detailed eyes."
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div
                                className="input-group"
                                style={{ gridColumn: "1 / -1" }}
                            >
                                <label className="input-label">
                                    Included Features (One per line)
                                </label>
                                <textarea
                                    className="input"
                                    rows={4}
                                    value={featuresText}
                                    onChange={(e) =>
                                        setFeaturesText(e.target.value)
                                    }
                                />
                            </div>

                            {/* Upload & Manage Example Images for this Tier */}
                            <div
                                style={{
                                    gridColumn: "1 / -1",
                                    padding: "16px",
                                    borderRadius: "12px",
                                    border: "1px solid var(--border)",
                                    background: "rgba(255,255,255,0.02)",
                                }}
                            >
                                <ImageUploader
                                    folder="lucyart/commissions"
                                    label="Upload Example Commission Image for this Tier"
                                    value={tempUploadedUrl}
                                    onChange={(url) => {
                                        if (url) {
                                            setExampleImages((prev) =>
                                                prev.includes(url)
                                                    ? prev
                                                    : [...prev, url],
                                            );
                                            setTempUploadedUrl("");
                                        }
                                    }}
                                />

                                {exampleImages.length > 0 && (
                                    <div style={{ marginTop: "16px" }}>
                                        <p
                                            className="input-label"
                                            style={{ marginBottom: "8px" }}
                                        >
                                            Current Tier Examples (
                                            {exampleImages.length}):
                                        </p>
                                        <div
                                            style={{
                                                display: "flex",
                                                gap: "12px",
                                                flexWrap: "wrap",
                                            }}
                                        >
                                            {exampleImages.map((img, idx) => (
                                                <div
                                                    key={idx}
                                                    style={{
                                                        position: "relative",
                                                    }}
                                                >
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img
                                                        src={img}
                                                        alt="Tier example"
                                                        style={{
                                                            width: "80px",
                                                            height: "80px",
                                                            objectFit: "cover",
                                                            borderRadius:
                                                                "10px",
                                                            border: "1px solid var(--border-cyan)",
                                                        }}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setExampleImages(
                                                                (prev) =>
                                                                    prev.filter(
                                                                        (_, i) =>
                                                                            i !==
                                                                            idx,
                                                                    ),
                                                            )
                                                        }
                                                        style={{
                                                            position:
                                                                "absolute",
                                                            top: "-6px",
                                                            right: "-6px",
                                                            background:
                                                                "var(--pink)",
                                                            color: "#fff",
                                                            border: "none",
                                                            borderRadius: "50%",
                                                            width: "22px",
                                                            height: "22px",
                                                            cursor: "pointer",
                                                            fontSize: "0.75rem",
                                                            fontWeight: "bold",
                                                        }}
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div
                                style={{
                                    gridColumn: "1 / -1",
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    gap: "12px",
                                }}
                            >
                                {editingId && (
                                    <button
                                        type="button"
                                        className="btn btn-ghost"
                                        onClick={resetTierForm}
                                    >
                                        Cancel
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={isPending || !title || !priceBase}
                                >
                                    {isPending
                                        ? "Saving..."
                                        : editingId
                                          ? "Update Tier"
                                          : "Save Tier"}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Existing Tiers List */}
                    <div className="grid-3">
                        {initialTiers.map((tier) => (
                            <div
                                key={tier.id}
                                className="admin-card"
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "12px",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                    }}
                                >
                                    <span className="tag pink">
                                        {tier.title}
                                    </span>
                                    <strong
                                        style={{
                                            fontSize: "1.4rem",
                                            color: "var(--cyan)",
                                        }}
                                    >
                                        ${tier.priceBase} USD
                                    </strong>
                                </div>
                                <p
                                    style={{
                                        color: "var(--muted)",
                                        fontSize: "0.9rem",
                                    }}
                                >
                                    {tier.description}
                                </p>
                                <ul
                                    style={{
                                        paddingLeft: "18px",
                                        color: "var(--muted)",
                                        fontSize: "0.85rem",
                                    }}
                                >
                                    {tier.features.map((f) => (
                                        <li key={f}>{f}</li>
                                    ))}
                                </ul>

                                {tier.exampleImages.length > 0 && (
                                    <div
                                        style={{
                                            display: "flex",
                                            gap: "8px",
                                            flexWrap: "wrap",
                                        }}
                                    >
                                        {tier.exampleImages.map((img, i) => (
                                            /* eslint-disable-next-line @next/next/no-img-element */
                                            <img
                                                key={i}
                                                src={img}
                                                alt="Example"
                                                style={{
                                                    width: "48px",
                                                    height: "48px",
                                                    objectFit: "cover",
                                                    borderRadius: "6px",
                                                }}
                                            />
                                        ))}
                                    </div>
                                )}

                                <div
                                    style={{
                                        display: "flex",
                                        gap: "8px",
                                        marginTop: "auto",
                                        paddingTop: "8px",
                                    }}
                                >
                                    <button
                                        type="button"
                                        className="btn btn-outline"
                                        style={{
                                            flex: 1,
                                            justifyContent: "center",
                                            padding: "8px 12px",
                                            fontSize: "0.8rem",
                                        }}
                                        onClick={() => handleEditTier(tier)}
                                    >
                                        Edit Tier
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        style={{
                                            padding: "8px 12px",
                                            fontSize: "0.8rem",
                                        }}
                                        onClick={() =>
                                            handleDeleteTier(
                                                tier.id,
                                                tier.title,
                                            )
                                        }
                                        disabled={isPending}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
