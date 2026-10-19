"use client";

import React, { useState, useTransition } from "react";
import { Adoptable, AdoptableStatus } from "@/types";
import ImageUploader from "@/components/ImageUploader";
import {
    deleteAdoptable,
    saveAdoptable,
    toggleAdoptableNsfw,
    updateAdoptableStatus,
} from "@/app/actions/adoptables";

interface AdminAdoptablesClientProps {
    initialAdoptables: Adoptable[];
}

export default function AdminAdoptablesClient({
    initialAdoptables,
}: AdminAdoptablesClientProps) {
    const [isPending, startTransition] = useTransition();
    const [toast, setToast] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);

    const [editingId, setEditingId] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const [price, setPrice] = useState<string>("");
    const [status, setStatus] = useState<AdoptableStatus>("available");
    const [description, setDescription] = useState<string>("");
    const [imageUrl, setImageUrl] = useState<string>("");
    const [publicId, setPublicId] = useState<string>("");
    const [owner, setOwner] = useState<string>("");
    const [isNsfw, setIsNsfw] = useState<boolean>(false);

    function showToast(type: "success" | "error", text: string) {
        setToast({ type, text });
        setTimeout(() => setToast(null), 4000);
    }

    function resetForm() {
        setEditingId("");
        setTitle("");
        setPrice("");
        setStatus("available");
        setDescription("");
        setImageUrl("");
        setPublicId("");
        setOwner("");
        setIsNsfw(false);
    }

    function handleEdit(item: Adoptable) {
        setEditingId(item.id);
        setTitle(item.title);
        setPrice(String(item.price));
        setStatus(item.status);
        setDescription(item.description);
        setImageUrl(item.imageUrl);
        setPublicId(item.publicId || "");
        setOwner(item.owner || "");
        setIsNsfw(Boolean(item.isNsfw));
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const formData = new FormData();
        if (editingId) formData.set("id", editingId);
        formData.set("title", title);
        formData.set("price", price);
        formData.set("status", status);
        formData.set("description", description);
        formData.set("imageUrl", imageUrl);
        formData.set("publicId", publicId);
        formData.set("owner", owner);
        formData.set("isNsfw", String(isNsfw));

        startTransition(async () => {
            const res = await saveAdoptable(formData);
            if (res.success) {
                showToast("success", res.message);
                resetForm();
            } else {
                showToast("error", res.message);
            }
        });
    }

    function handleQuickStatusChange(id: string, nextStatus: AdoptableStatus) {
        startTransition(async () => {
            const res = await updateAdoptableStatus(id, nextStatus);
            if (res.success) {
                showToast("success", res.message);
            } else {
                showToast("error", res.message);
            }
        });
    }

    function handleQuickNsfwToggle(item: Adoptable) {
        startTransition(async () => {
            const res = await toggleAdoptableNsfw(item.id, !item.isNsfw);
            if (res.success) {
                showToast("success", res.message);
            } else {
                showToast("error", res.message);
            }
        });
    }

    function handleDelete(id: string, itemTitle: string) {
        if (!window.confirm(`Delete adoptable "${itemTitle}"?`)) return;

        startTransition(async () => {
            const res = await deleteAdoptable(id);
            if (res.success) {
                showToast("success", res.message);
                if (editingId === id) resetForm();
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
                    marginBottom: "32px",
                }}
            >
                <div>
                    <h2 style={{ marginBottom: "4px" }}>Manage Adoptables</h2>
                    <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
                        Upload original character sheets via Cloudinary and
                        update availability status in real time.
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

            {/* Create / Edit Form */}
            <div
                className="admin-card"
                style={{
                    marginBottom: "40px",
                    border: "1px solid var(--border-cyan)",
                }}
            >
                <h3 style={{ marginBottom: "24px", color: "var(--cyan)" }}>
                    {editingId
                        ? "✏️ Edit Adoptable Character"
                        : "➕ Create New Adoptable"}
                </h3>

                <form
                    onSubmit={handleSubmit}
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(220px, 1fr))",
                        gap: "20px",
                    }}
                >
                    <div className="input-group">
                        <label className="input-label">Character Title *</label>
                        <input
                            type="text"
                            className="input"
                            placeholder="e.g. Starlight Mage"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">Price (USD) *</label>
                        <input
                            type="number"
                            className="input"
                            placeholder="85"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">Status</label>
                        <select
                            className="input"
                            value={status}
                            onChange={(e) =>
                                setStatus(e.target.value as AdoptableStatus)
                            }
                        >
                            <option
                                value="available"
                                style={{ background: "var(--bg-card)" }}
                            >
                                Available
                            </option>
                            <option
                                value="pending"
                                style={{ background: "var(--bg-card)" }}
                            >
                                Pending / On Hold
                            </option>
                            <option
                                value="sold"
                                style={{ background: "var(--bg-card)" }}
                            >
                                Sold
                            </option>
                        </select>
                    </div>

                    <div className="input-group">
                        <label className="input-label">
                            Owner / Buyer (Optional)
                        </label>
                        <input
                            type="text"
                            className="input"
                            placeholder="e.g. @User123"
                            value={owner}
                            onChange={(e) => setOwner(e.target.value)}
                        />
                    </div>

                    <div
                        style={{
                            gridColumn: "1 / -1",
                            padding: "14px 18px",
                            borderRadius: "12px",
                            background: isNsfw
                                ? "rgba(255, 45, 120, 0.08)"
                                : "rgba(255, 255, 255, 0.03)",
                            border: `1px solid ${
                                isNsfw
                                    ? "rgba(255, 45, 120, 0.4)"
                                    : "var(--border)"
                            }`,
                        }}
                    >
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
                                onChange={(e) => setIsNsfw(e.target.checked)}
                                style={{
                                    width: "18px",
                                    height: "18px",
                                    accentColor: "var(--pink)",
                                }}
                            />
                            🔞 NSFW / 18+ Character Design (Hidden unless
                            visitor enables +18)
                        </label>
                    </div>

                    <div style={{ gridColumn: "1 / -1" }}>
                        <ImageUploader
                            folder="lucyart/adoptables"
                            label="Adoptable Character Sheet Image *"
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
                        <label className="input-label">Description *</label>
                        <textarea
                            className="input"
                            placeholder="Includes full character sheet, high-res PNG, and commercial rights..."
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>

                    <div
                        style={{
                            gridColumn: "1 / -1",
                            display: "flex",
                            gap: "12px",
                            justifyContent: "flex-end",
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
                            disabled={
                                isPending || !title || !price || !imageUrl
                            }
                        >
                            {isPending
                                ? "Saving..."
                                : editingId
                                  ? "Update Adoptable"
                                  : "Save Adoptable"}
                        </button>
                    </div>
                </form>
            </div>

            {/* Adoptables Table */}
            <div className="admin-card">
                <div style={{ overflowX: "auto" }}>
                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            textAlign: "left",
                        }}
                    >
                        <thead>
                            <tr
                                style={{
                                    borderBottom: "1px solid var(--border)",
                                    color: "var(--muted)",
                                }}
                            >
                                <th style={{ padding: "16px 8px" }}>Image</th>
                                <th style={{ padding: "16px 8px" }}>Title</th>
                                <th style={{ padding: "16px 8px" }}>Price</th>
                                <th style={{ padding: "16px 8px" }}>
                                    Quick Status
                                </th>
                                <th
                                    style={{
                                        padding: "16px 8px",
                                        textAlign: "right",
                                    }}
                                >
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {initialAdoptables.map((item) => (
                                <tr
                                    key={item.id}
                                    style={{
                                        borderBottom:
                                            "1px solid rgba(255,255,255,0.05)",
                                    }}
                                >
                                    <td style={{ padding: "12px 8px" }}>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={
                                                item.imageUrl ||
                                                "https://via.placeholder.com/150"
                                            }
                                            alt={item.title}
                                            style={{
                                                width: "54px",
                                                height: "54px",
                                                borderRadius: "8px",
                                                objectFit: "cover",
                                            }}
                                        />
                                    </td>
                                    <td style={{ padding: "12px 8px" }}>
                                        <div
                                            style={{
                                                fontWeight: "bold",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "8px",
                                            }}
                                        >
                                            <span>{item.title}</span>
                                            {item.isNsfw && (
                                                <span className="tag sold">
                                                    🔞 18+
                                                </span>
                                            )}
                                        </div>
                                        {item.owner && (
                                            <div
                                                style={{
                                                    fontSize: "0.75rem",
                                                    color: "var(--muted)",
                                                }}
                                            >
                                                Owner: {item.owner}
                                            </div>
                                        )}
                                    </td>
                                    <td
                                        style={{
                                            padding: "12px 8px",
                                            color: "var(--cyan)",
                                            fontWeight: 700,
                                        }}
                                    >
                                        ${item.price} USD
                                    </td>
                                    <td style={{ padding: "12px 8px" }}>
                                        <div
                                            style={{
                                                display: "flex",
                                                gap: "6px",
                                                flexWrap: "wrap",
                                            }}
                                        >
                                            {(
                                                [
                                                    "available",
                                                    "pending",
                                                    "sold",
                                                ] as AdoptableStatus[]
                                            ).map((st) => (
                                                <button
                                                    key={st}
                                                    type="button"
                                                    disabled={isPending}
                                                    onClick={() =>
                                                        handleQuickStatusChange(
                                                            item.id,
                                                            st,
                                                        )
                                                    }
                                                    className={`tag ${
                                                        item.status === st
                                                            ? st
                                                            : ""
                                                    }`}
                                                    style={{
                                                        cursor: "pointer",
                                                        opacity:
                                                            item.status === st
                                                                ? 1
                                                                : 0.4,
                                                    }}
                                                >
                                                    {st}
                                                </button>
                                            ))}
                                        </div>
                                    </td>
                                    <td
                                        style={{
                                            padding: "12px 8px",
                                            textAlign: "right",
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                gap: "8px",
                                                justifyContent: "flex-end",
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
                                                    padding: "6px 10px",
                                                    fontSize: "0.75rem",
                                                }}
                                                disabled={isPending}
                                                onClick={() =>
                                                    handleQuickNsfwToggle(item)
                                                }
                                            >
                                                {item.isNsfw
                                                    ? "🔞 18+"
                                                    : "🛡️ SFW"}
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-outline"
                                                style={{
                                                    padding: "6px 12px",
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
                                                    padding: "6px 12px",
                                                    fontSize: "0.8rem",
                                                }}
                                                disabled={isPending}
                                                onClick={() =>
                                                    handleDelete(
                                                        item.id,
                                                        item.title,
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
