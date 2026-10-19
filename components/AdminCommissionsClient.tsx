"use client";

import React, { useState, useTransition } from "react";
import {
    CommissionTier,
    CommissionTierStatus,
    Inquiry,
    InquiryStatus,
    PortfolioItem,
} from "@/types";
import ImageUploader from "@/components/ImageUploader";
import {
    deleteCommissionTier,
    deleteInquiry,
    saveCommissionTier,
    updateCommissionTierQuick,
    updateInquiryStatus,
} from "@/app/actions/commissions";

interface AdminCommissionsClientProps {
    initialTiers: CommissionTier[];
    initialInquiries: Inquiry[];
    portfolioItems: PortfolioItem[];
}

const CATEGORIES = [
    "Full Body",
    "Half Body",
    "Bust",
    "Chibi",
    "Scene",
    "Reference Sheet",
];

export default function AdminCommissionsClient({
    initialTiers,
    initialInquiries,
    portfolioItems,
}: AdminCommissionsClientProps) {
    const [isPending, startTransition] = useTransition();
    const [activeTab, setActiveTab] = useState<"tiers" | "inquiries">("tiers");
    const [toast, setToast] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);

    // Quick inline price state per tier ID
    const [inlinePrices, setInlinePrices] = useState<Record<string, string>>(
        () =>
            Object.fromEntries(
                initialTiers.map((t) => [t.id, String(t.priceBase)]),
            ),
    );

    // Tier form state
    const [editingId, setEditingId] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const [priceBase, setPriceBase] = useState<string>("");
    const [status, setStatus] = useState<CommissionTierStatus>("open");
    const [categoryMatch, setCategoryMatch] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [featuresText, setFeaturesText] = useState<string>(
        "1 Character\nSimple Background\nPersonal Use",
    );
    const [exampleImages, setExampleImages] = useState<string[]>([]);
    const [order, setOrder] = useState<string>(
        String(initialTiers.length + 1),
    );
    const [tempUploadedUrl, setTempUploadedUrl] = useState<string>("");

    function showToast(type: "success" | "error", text: string) {
        setToast({ type, text });
        setTimeout(() => setToast(null), 4000);
    }

    function resetTierForm() {
        setEditingId("");
        setTitle("");
        setPriceBase("");
        setStatus("open");
        setCategoryMatch("");
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
        setStatus(tier.status || "open");
        setCategoryMatch(tier.categoryMatch || "");
        setDescription(tier.description);
        setFeaturesText((tier.features || []).join("\n"));
        setExampleImages(tier.exampleImages || []);
        setOrder(String(tier.order ?? 1));
        setActiveTab("tiers");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function togglePortfolioImageInExamples(url: string) {
        setExampleImages((prev) =>
            prev.includes(url)
                ? prev.filter((item) => item !== url)
                : [...prev, url],
        );
    }

    function handleTierSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const formData = new FormData();
        if (editingId) formData.set("id", editingId);
        formData.set("title", title);
        formData.set("priceBase", priceBase);
        formData.set("status", status);
        formData.set("categoryMatch", categoryMatch);
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

    function handleQuickUpdate(
        tierId: string,
        updates: { priceBase?: number; status?: CommissionTierStatus },
    ) {
        startTransition(async () => {
            const res = await updateCommissionTierQuick(tierId, updates);
            if (res.success) {
                showToast("success", res.message);
            } else {
                showToast("error", res.message);
            }
        });
    }

    function handleDeleteTier(id: string, tierTitle: string) {
        if (!window.confirm(`Delete commission type "${tierTitle}"?`)) return;
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

    function handleStatusChange(id: string, inqStatus: InquiryStatus) {
        startTransition(async () => {
            const res = await updateInquiryStatus(id, inqStatus);
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
                        Commission Types, Prices &amp; Requests
                    </h2>
                    <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
                        Customize your commission types, edit prices &amp;
                        availability, link example illustrations, and manage
                        orders.
                    </p>
                </div>

                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    <button
                        type="button"
                        className={
                            activeTab === "tiers"
                                ? "btn btn-primary"
                                : "btn btn-ghost"
                        }
                        onClick={() => setActiveTab("tiers")}
                    >
                        💎 Commission Types &amp; Prices ({initialTiers.length})
                    </button>
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
                </div>
            </div>

            {activeTab === "tiers" ? (
                <div>
                    {/* Existing Tiers with Quick Price & Status Controls */}
                    <div style={{ marginBottom: "36px" }}>
                        <h3 style={{ marginBottom: "16px" }}>
                            Active Commission Types (Quick Price &amp; Status
                            Edit)
                        </h3>
                        <div className="grid-3">
                            {initialTiers.map((tier) => {
                                const currentPriceInput =
                                    inlinePrices[tier.id] ??
                                    String(tier.priceBase);

                                return (
                                    <div
                                        key={tier.id}
                                        className="admin-card"
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "14px",
                                            border:
                                                editingId === tier.id
                                                    ? "2px solid var(--cyan)"
                                                    : undefined,
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent:
                                                    "space-between",
                                                alignItems: "center",
                                                gap: "8px",
                                            }}
                                        >
                                            <span className="tag pink">
                                                {tier.title}
                                            </span>
                                            <span
                                                className={`tag ${
                                                    tier.status === "open"
                                                        ? "available"
                                                        : tier.status ===
                                                            "waitlist"
                                                          ? "pending"
                                                          : "sold"
                                                }`}
                                            >
                                                {tier.status || "open"}
                                            </span>
                                        </div>

                                        {/* Quick Inline Price Editor */}
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "8px",
                                                background:
                                                    "rgba(255,255,255,0.03)",
                                                padding: "10px 12px",
                                                borderRadius: "12px",
                                                border: "1px solid var(--border)",
                                            }}
                                        >
                                            <span
                                                style={{
                                                    fontWeight: 800,
                                                    color: "var(--cyan)",
                                                }}
                                            >
                                                $
                                            </span>
                                            <input
                                                type="number"
                                                className="input"
                                                style={{
                                                    padding: "6px 10px",
                                                    fontSize: "1.1rem",
                                                    fontWeight: "bold",
                                                }}
                                                value={currentPriceInput}
                                                onChange={(e) =>
                                                    setInlinePrices((prev) => ({
                                                        ...prev,
                                                        [tier.id]:
                                                            e.target.value,
                                                    }))
                                                }
                                            />
                                            <span
                                                style={{
                                                    fontSize: "0.8rem",
                                                    color: "var(--muted)",
                                                }}
                                            >
                                                USD
                                            </span>
                                            {Number(currentPriceInput) !==
                                                tier.priceBase && (
                                                <button
                                                    type="button"
                                                    className="btn btn-primary"
                                                    style={{
                                                        padding: "6px 12px",
                                                        fontSize: "0.75rem",
                                                    }}
                                                    disabled={isPending}
                                                    onClick={() =>
                                                        handleQuickUpdate(
                                                            tier.id,
                                                            {
                                                                priceBase:
                                                                    Number(
                                                                        currentPriceInput,
                                                                    ),
                                                            },
                                                        )
                                                    }
                                                >
                                                    Save
                                                </button>
                                            )}
                                        </div>

                                        {/* Quick Availability Toggle */}
                                        <div
                                            style={{
                                                display: "flex",
                                                gap: "6px",
                                                alignItems: "center",
                                                flexWrap: "wrap",
                                            }}
                                        >
                                            <span
                                                style={{
                                                    fontSize: "0.75rem",
                                                    color: "var(--muted)",
                                                }}
                                            >
                                                Availability:
                                            </span>
                                            {(
                                                [
                                                    "open",
                                                    "waitlist",
                                                    "closed",
                                                ] as CommissionTierStatus[]
                                            ).map((st) => (
                                                <button
                                                    key={st}
                                                    type="button"
                                                    disabled={isPending}
                                                    onClick={() =>
                                                        handleQuickUpdate(
                                                            tier.id,
                                                            { status: st },
                                                        )
                                                    }
                                                    className={`tag ${
                                                        st === "open"
                                                            ? "available"
                                                            : st === "waitlist"
                                                              ? "pending"
                                                              : "sold"
                                                    }`}
                                                    style={{
                                                        cursor: "pointer",
                                                        opacity:
                                                            (tier.status ||
                                                                "open") === st
                                                                ? 1
                                                                : 0.35,
                                                    }}
                                                >
                                                    {st}
                                                </button>
                                            ))}
                                        </div>

                                        <p
                                            style={{
                                                color: "var(--muted)",
                                                fontSize: "0.9rem",
                                                margin: 0,
                                            }}
                                        >
                                            {tier.description}
                                        </p>

                                        {tier.categoryMatch && (
                                            <div
                                                style={{
                                                    fontSize: "0.8rem",
                                                    color: "var(--cyan)",
                                                }}
                                            >
                                                Auto-includes category:{" "}
                                                <strong>
                                                    {tier.categoryMatch}
                                                </strong>
                                            </div>
                                        )}

                                        <ul
                                            style={{
                                                paddingLeft: "18px",
                                                color: "var(--muted)",
                                                fontSize: "0.85rem",
                                                margin: 0,
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
                                                {tier.exampleImages.map(
                                                    (img, i) => (
                                                        /* eslint-disable-next-line @next/next/no-img-element */
                                                        <img
                                                            key={i}
                                                            src={img}
                                                            alt="Example"
                                                            style={{
                                                                width: "48px",
                                                                height: "48px",
                                                                objectFit:
                                                                    "cover",
                                                                borderRadius:
                                                                    "6px",
                                                                border: "1px solid var(--border)",
                                                            }}
                                                        />
                                                    ),
                                                )}
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
                                                onClick={() =>
                                                    handleEditTier(tier)
                                                }
                                            >
                                                ✏️ Full Edit &amp; Examples
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
                                );
                            })}
                        </div>
                    </div>

                    {/* Full Create / Edit Commission Type Form */}
                    <div
                        className="admin-card"
                        style={{
                            border: "1px solid var(--border-cyan)",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "20px",
                                flexWrap: "wrap",
                                gap: "12px",
                            }}
                        >
                            <h3 style={{ margin: 0, color: "var(--cyan)" }}>
                                {editingId
                                    ? `✏️ Editing Commission Type: ${title}`
                                    : "➕ Create New Commission Type"}
                            </h3>
                            {editingId && (
                                <button
                                    type="button"
                                    className="btn btn-ghost"
                                    style={{
                                        padding: "6px 14px",
                                        fontSize: "0.8rem",
                                    }}
                                    onClick={resetTierForm}
                                >
                                    Switch to Create New
                                </button>
                            )}
                        </div>

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
                                    Commission Type Title *
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
                                    Availability Status
                                </label>
                                <select
                                    className="input"
                                    value={status}
                                    onChange={(e) =>
                                        setStatus(
                                            e.target
                                                .value as CommissionTierStatus,
                                        )
                                    }
                                >
                                    <option
                                        value="open"
                                        style={{
                                            background: "var(--bg-card)",
                                        }}
                                    >
                                        Open (Accepting Orders)
                                    </option>
                                    <option
                                        value="waitlist"
                                        style={{
                                            background: "var(--bg-card)",
                                        }}
                                    >
                                        Waitlist Only
                                    </option>
                                    <option
                                        value="closed"
                                        style={{
                                            background: "var(--bg-card)",
                                        }}
                                    >
                                        Closed
                                    </option>
                                </select>
                            </div>

                            <div className="input-group">
                                <label className="input-label">
                                    Auto-Match Portfolio Category (Optional)
                                </label>
                                <select
                                    className="input"
                                    value={categoryMatch}
                                    onChange={(e) =>
                                        setCategoryMatch(e.target.value)
                                    }
                                >
                                    <option
                                        value=""
                                        style={{
                                            background: "var(--bg-card)",
                                        }}
                                    >
                                        -- Manual / Linked Only --
                                    </option>
                                    {CATEGORIES.map((cat) => (
                                        <option
                                            key={cat}
                                            value={cat}
                                            style={{
                                                background: "var(--bg-card)",
                                            }}
                                        >
                                            {cat}
                                        </option>
                                    ))}
                                </select>
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

                            {/* Visual Picker from Existing Portfolio Works */}
                            {portfolioItems.length > 0 && (
                                <div
                                    style={{
                                        gridColumn: "1 / -1",
                                        padding: "16px",
                                        borderRadius: "12px",
                                        border: "1px solid var(--border)",
                                        background: "rgba(255,255,255,0.02)",
                                    }}
                                >
                                    <label
                                        className="input-label"
                                        style={{
                                            display: "block",
                                            marginBottom: "8px",
                                        }}
                                    >
                                        🖼️ Select Illustrations from Your
                                        Portfolio to Show in this Tier&apos;s
                                        Modal (Click to Toggle):
                                    </label>
                                    <div
                                        style={{
                                            display: "flex",
                                            gap: "12px",
                                            flexWrap: "wrap",
                                            maxHeight: "220px",
                                            overflowY: "auto",
                                            padding: "4px",
                                        }}
                                    >
                                        {portfolioItems.map((work) => {
                                            const isSelected =
                                                exampleImages.includes(
                                                    work.imageUrl,
                                                );
                                            return (
                                                <div
                                                    key={work.id}
                                                    onClick={() =>
                                                        togglePortfolioImageInExamples(
                                                            work.imageUrl,
                                                        )
                                                    }
                                                    style={{
                                                        position: "relative",
                                                        width: "90px",
                                                        cursor: "pointer",
                                                        borderRadius: "10px",
                                                        overflow: "hidden",
                                                        border: isSelected
                                                            ? "2px solid var(--cyan)"
                                                            : "1px solid var(--border)",
                                                        opacity: isSelected
                                                            ? 1
                                                            : 0.6,
                                                        transition:
                                                            "all 0.2s ease",
                                                    }}
                                                >
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img
                                                        src={work.imageUrl}
                                                        alt={work.title}
                                                        style={{
                                                            width: "90px",
                                                            height: "90px",
                                                            objectFit: "cover",
                                                        }}
                                                    />
                                                    <div
                                                        style={{
                                                            fontSize: "0.65rem",
                                                            padding: "4px",
                                                            whiteSpace:
                                                                "nowrap",
                                                            overflow: "hidden",
                                                            textOverflow:
                                                                "ellipsis",
                                                            background:
                                                                "rgba(13,6,24,0.9)",
                                                        }}
                                                    >
                                                        {isSelected ? "✅ " : ""}
                                                        {work.title}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

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
                                    label="Or Upload a New Illustration Directly for this Tier"
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
                                            Selected Tier Illustrations (
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
                                          ? "Save Changes to Commission Type"
                                          : "Create Commission Type"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : (
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
            )}
        </div>
    );
}
