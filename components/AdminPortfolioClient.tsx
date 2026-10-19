"use client";

import React, { useState, useTransition } from "react";
import { CommissionTier, PortfolioItem } from "@/types";
import ImageUploader from "@/components/ImageUploader";
import {
    deletePortfolioItem,
    savePortfolioItem,
    togglePortfolioNsfw,
} from "@/app/actions/portfolio";

interface AdminPortfolioClientProps {
    initialItems: PortfolioItem[];
    commissionTiers: CommissionTier[];
}

const CATEGORIES = [
    "Full Body",
    "Half Body",
    "Bust",
    "Chibi",
    "Scene",
    "Reference Sheet",
];

export default function AdminPortfolioClient({
    initialItems,
    commissionTiers,
}: AdminPortfolioClientProps) {
    const [isPending, startTransition] = useTransition();
    const [toast, setToast] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);

    // Filter state for table/gallery
    const [filter, setFilter] = useState<string>("ALL");

    // Form state
    const [editingId, setEditingId] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const [category, setCategory] = useState<string>("Full Body");
    const [imageUrl, setImageUrl] = useState<string>("");
    const [publicId, setPublicId] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [isCommission, setIsCommission] = useState<boolean>(false);
    const [clientName, setClientName] = useState<string>("");
    const [commissionTierId, setCommissionTierId] = useState<string>("");
    const [featured, setFeatured] = useState<boolean>(false);
    const [isNsfw, setIsNsfw] = useState<boolean>(false);

    function showToast(type: "success" | "error", text: string) {
        setToast({ type, text });
        setTimeout(() => setToast(null), 4000);
    }

    function resetForm() {
        setEditingId("");
        setTitle("");
        setCategory("Full Body");
        setImageUrl("");
        setPublicId("");
        setDescription("");
        setIsCommission(false);
        setClientName("");
        setCommissionTierId("");
        setFeatured(false);
        setIsNsfw(false);
    }

    function handleEdit(item: PortfolioItem) {
        setEditingId(item.id);
        setTitle(item.title);
        setCategory(item.category || "Full Body");
        setImageUrl(item.imageUrl);
        setPublicId(item.publicId || "");
        setDescription(item.description || "");
        setIsCommission(Boolean(item.isCommission));
        setClientName(item.clientName || "");
        setCommissionTierId(item.commissionTierId || "");
        setFeatured(Boolean(item.featured));
        setIsNsfw(Boolean(item.isNsfw));
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const formData = new FormData();
        if (editingId) formData.set("id", editingId);
        formData.set("title", title);
        formData.set("category", category);
        formData.set("imageUrl", imageUrl);
        formData.set("publicId", publicId);
        formData.set("description", description);
        formData.set("isCommission", String(isCommission));
        formData.set("clientName", clientName);
        formData.set("commissionTierId", commissionTierId);
        formData.set("featured", String(featured));
        formData.set("isNsfw", String(isNsfw));

        startTransition(async () => {
            const res = await savePortfolioItem(formData);
            if (res.success) {
                showToast("success", res.message);
                resetForm();
            } else {
                showToast("error", res.message);
            }
        });
    }

    function handleQuickToggleNsfw(item: PortfolioItem) {
        startTransition(async () => {
            const res = await togglePortfolioNsfw(item.id, !item.isNsfw);
            if (res.success) {
                showToast("success", res.message);
            } else {
                showToast("error", res.message);
            }
        });
    }

    function handleDelete(id: string, itemTitle: string) {
        if (!window.confirm(`Delete "${itemTitle}" from portfolio?`)) return;

        startTransition(async () => {
            const res = await deletePortfolioItem(id);
            if (res.success) {
                showToast("success", res.message);
                if (editingId === id) resetForm();
            } else {
                showToast("error", res.message);
            }
        });
    }

    const filteredItems = initialItems.filter((item) => {
        if (filter === "ALL") return true;
        if (filter === "COMMISSIONS") return Boolean(item.isCommission);
        if (filter === "NSFW") return Boolean(item.isNsfw);
        return item.category === filter;
    });

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
                    marginBottom: "32px",
                }}
            >
                <div>
                    <h2 style={{ marginBottom: "4px" }}>
                        Portfolio &amp; Completed Commissions
                    </h2>
                    <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
                        Upload illustrations via Cloudinary. Mark finished client
                        work to showcase in both Portfolio and Commission Tiers.
                    </p>
                </div>

                {editingId && (
                    <button
                        type="button"
                        className="btn btn-outline"
                        onClick={resetForm}
                    >
                        ➕ Switch to Create New
                    </button>
                )}
            </div>

            {/* Upload / Edit Form */}
            <div
                className="admin-card"
                style={{
                    marginBottom: "40px",
                    border: "1px solid var(--border-cyan)",
                }}
            >
                <h3 style={{ marginBottom: "20px", color: "var(--cyan)" }}>
                    {editingId
                        ? "✏️ Edit Artwork / Commission"
                        : "📤 Upload New Artwork or Completed Commission"}
                </h3>

                <form
                    onSubmit={handleSubmit}
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(260px, 1fr))",
                        gap: "20px",
                    }}
                >
                    <div className="input-group">
                        <label className="input-label">Artwork Title *</label>
                        <input
                            type="text"
                            className="input"
                            placeholder="e.g. Neon Valkyrie Full Body"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">Category *</label>
                        <select
                            className="input"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            {CATEGORIES.map((cat) => (
                                <option
                                    key={cat}
                                    value={cat}
                                    style={{ background: "var(--bg-card)" }}
                                >
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Completed Commission Toggle Box */}
                    <div
                        style={{
                            gridColumn: "1 / -1",
                            padding: "16px 20px",
                            borderRadius: "12px",
                            background: isCommission
                                ? "rgba(255, 45, 120, 0.08)"
                                : "rgba(255, 255, 255, 0.03)",
                            border: `1px solid ${
                                isCommission
                                    ? "rgba(255, 45, 120, 0.4)"
                                    : "var(--border)"
                            }`,
                            display: "flex",
                            flexDirection: "column",
                            gap: "16px",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                gap: "24px",
                                flexWrap: "wrap",
                                alignItems: "center",
                            }}
                        >
                            <label
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    cursor: "pointer",
                                    fontWeight: 700,
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={isCommission}
                                    onChange={(e) =>
                                        setIsCommission(e.target.checked)
                                    }
                                    style={{
                                        width: "18px",
                                        height: "18px",
                                        accentColor: "var(--pink)",
                                    }}
                                />
                                🎨 This artwork is a Completed Client Commission
                            </label>

                            <label
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    cursor: "pointer",
                                    fontWeight: 700,
                                    color: "var(--yellow)",
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={featured}
                                    onChange={(e) =>
                                        setFeatured(e.target.checked)
                                    }
                                    style={{
                                        width: "18px",
                                        height: "18px",
                                        accentColor: "var(--yellow)",
                                    }}
                                />
                                ⭐ Feature on Home / Top of Gallery
                            </label>

                            <label
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    cursor: "pointer",
                                    fontWeight: 700,
                                    color: "var(--pink-light)",
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={isNsfw}
                                    onChange={(e) =>
                                        setIsNsfw(e.target.checked)
                                    }
                                    style={{
                                        width: "18px",
                                        height: "18px",
                                        accentColor: "var(--pink)",
                                    }}
                                />
                                🔞 NSFW / 18+ Content (Hidden unless visitor
                                enables +18)
                            </label>
                        </div>

                        {isCommission && (
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "repeat(auto-fit, minmax(240px, 1fr))",
                                    gap: "16px",
                                }}
                            >
                                <div className="input-group">
                                    <label className="input-label">
                                        Client Name / Handle (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        className="input"
                                        placeholder="e.g. @StarVT or Anonymous"
                                        value={clientName}
                                        onChange={(e) =>
                                            setClientName(e.target.value)
                                        }
                                    />
                                </div>

                                <div className="input-group">
                                    <label className="input-label">
                                        Also Add as Example to Commission Tier
                                    </label>
                                    <select
                                        className="input"
                                        value={commissionTierId}
                                        onChange={(e) =>
                                            setCommissionTierId(e.target.value)
                                        }
                                    >
                                        <option
                                            value=""
                                            style={{
                                                background: "var(--bg-card)",
                                            }}
                                        >
                                            -- Do not link to a specific tier --
                                        </option>
                                        {commissionTiers.map((tier) => (
                                            <option
                                                key={tier.id}
                                                value={tier.id}
                                                style={{
                                                    background:
                                                        "var(--bg-card)",
                                                }}
                                            >
                                                {tier.title} ($
                                                {tier.priceBase} USD)
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Cloudinary Image Uploader */}
                    <div style={{ gridColumn: "1 / -1" }}>
                        <ImageUploader
                            folder={
                                isCommission
                                    ? "lucyart/commissions"
                                    : "lucyart/portfolio"
                            }
                            value={imageUrl}
                            publicId={publicId}
                            onChange={(url, pid) => {
                                setImageUrl(url);
                                setPublicId(pid || "");
                            }}
                        />
                    </div>

                    <div
                        className="input-group"
                        style={{ gridColumn: "1 / -1" }}
                    >
                        <label className="input-label">
                            Short Description / Notes (Optional)
                        </label>
                        <textarea
                            className="input"
                            rows={3}
                            placeholder="Details about the piece, shading style, or background..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
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
                                onClick={resetForm}
                            >
                                Cancel
                            </button>
                        )}
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isPending || !title || !imageUrl}
                        >
                            {isPending
                                ? "Saving..."
                                : editingId
                                  ? "Update Artwork"
                                  : "Publish to Portfolio"}
                        </button>
                    </div>
                </form>
            </div>

            {/* Filter Bar */}
            <div
                style={{
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap",
                    marginBottom: "24px",
                }}
            >
                <button
                    type="button"
                    className={
                        filter === "ALL" ? "btn btn-primary" : "btn btn-ghost"
                    }
                    style={{ padding: "8px 18px", fontSize: "0.85rem" }}
                    onClick={() => setFilter("ALL")}
                >
                    All ({initialItems.length})
                </button>
                <button
                    type="button"
                    className={
                        filter === "COMMISSIONS"
                            ? "btn btn-primary"
                            : "btn btn-ghost"
                    }
                    style={{ padding: "8px 18px", fontSize: "0.85rem" }}
                    onClick={() => setFilter("COMMISSIONS")}
                >
                    ✨ Completed Commissions (
                    {initialItems.filter((i) => i.isCommission).length})
                </button>
                <button
                    type="button"
                    className={
                        filter === "NSFW" ? "btn btn-primary" : "btn btn-ghost"
                    }
                    style={{ padding: "8px 18px", fontSize: "0.85rem" }}
                    onClick={() => setFilter("NSFW")}
                >
                    🔞 NSFW 18+ ({initialItems.filter((i) => i.isNsfw).length})
                </button>
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        type="button"
                        className={
                            filter === cat ? "btn btn-outline" : "btn btn-ghost"
                        }
                        style={{ padding: "8px 16px", fontSize: "0.8rem" }}
                        onClick={() => setFilter(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Uploaded Artworks Grid */}
            <div className="grid-3">
                {filteredItems.map((item) => (
                    <div
                        key={item.id}
                        className="admin-card"
                        style={{
                            padding: "16px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "12px",
                            border: item.isNsfw
                                ? "1px solid rgba(255, 45, 120, 0.45)"
                                : undefined,
                        }}
                    >
                        <div
                            style={{
                                position: "relative",
                                aspectRatio: "4/4",
                                borderRadius: "12px",
                                overflow: "hidden",
                                background: "var(--bg-deep)",
                            }}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={item.imageUrl}
                                alt={item.title}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                }}
                            />
                            <div
                                style={{
                                    position: "absolute",
                                    top: "10px",
                                    left: "10px",
                                    right: "10px",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    gap: "6px",
                                    flexWrap: "wrap",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        gap: "6px",
                                        flexWrap: "wrap",
                                    }}
                                >
                                    <span className="tag cyan">
                                        {item.category}
                                    </span>
                                    {item.isCommission && (
                                        <span className="tag pink">
                                            Commission
                                        </span>
                                    )}
                                    {item.featured && (
                                        <span className="tag pending">
                                            ★ Featured
                                        </span>
                                    )}
                                </div>
                                {item.isNsfw && (
                                    <span className="tag sold">🔞 18+</span>
                                )}
                            </div>
                        </div>

                        <div>
                            <h3 style={{ fontSize: "1.1rem", margin: 0 }}>
                                {item.title}
                            </h3>
                            {item.isCommission && item.clientName && (
                                <p
                                    style={{
                                        color: "var(--pink-light)",
                                        fontSize: "0.8rem",
                                        fontWeight: 700,
                                        marginTop: "2px",
                                    }}
                                >
                                    Client: {item.clientName}
                                </p>
                            )}
                            {item.description && (
                                <p
                                    style={{
                                        color: "var(--muted)",
                                        fontSize: "0.85rem",
                                        marginTop: "6px",
                                    }}
                                >
                                    {item.description}
                                </p>
                            )}
                        </div>

                        <div
                            style={{
                                display: "flex",
                                gap: "8px",
                                marginTop: "auto",
                                paddingTop: "8px",
                                flexWrap: "wrap",
                            }}
                        >
                            <button
                                type="button"
                                className={
                                    item.isNsfw
                                        ? "btn btn-primary"
                                        : "btn btn-ghost"
                                }
                                style={{
                                    padding: "8px 12px",
                                    fontSize: "0.75rem",
                                }}
                                onClick={() => handleQuickToggleNsfw(item)}
                                disabled={isPending}
                                title="Click to toggle between SFW and NSFW (18+)"
                            >
                                {item.isNsfw ? "🔞 NSFW (18+)" : "🛡️ SFW"}
                            </button>
                            <button
                                type="button"
                                className="btn btn-outline"
                                style={{
                                    flex: 1,
                                    justifyContent: "center",
                                    padding: "8px 12px",
                                    fontSize: "0.8rem",
                                }}
                                onClick={() => handleEdit(item)}
                            >
                                Edit
                            </button>
                            <button
                                type="button"
                                className="btn btn-danger"
                                style={{
                                    padding: "8px 14px",
                                    fontSize: "0.8rem",
                                }}
                                onClick={() =>
                                    handleDelete(item.id, item.title)
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
    );
}
