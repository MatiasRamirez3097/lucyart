"use client";

import React, { useRef, useState } from "react";

interface ImageUploaderProps {
    folder?: "lucyart/portfolio" | "lucyart/commissions" | "lucyart/adoptables";
    value: string;
    publicId?: string;
    onChange: (imageUrl: string, publicId?: string) => void;
    label?: string;
    helperText?: string;
    urlInputName?: string;
    publicIdInputName?: string;
}

export default function ImageUploader({
    folder = "lucyart/portfolio",
    value,
    publicId = "",
    onChange,
    label = "Artwork Image (Cloudinary Upload or Direct URL)",
    helperText = "Supports PNG, JPG, WEBP up to 20MB. Uploaded directly to Cloudinary.",
    urlInputName = "imageUrl",
    publicIdInputName = "publicId",
}: ImageUploaderProps) {
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    async function handleFileUpload(file: File) {
        if (!file.type.startsWith("image/")) {
            setError("Please select a valid image file (PNG, JPG, WEBP, GIF).");
            return;
        }

        setError(null);
        setUploading(true);

        try {
            // 1. Request signed upload parameters from our Next.js API
            const signRes = await fetch("/api/cloudinary/sign", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ folder }),
            });

            const signData = await signRes.json();
            if (!signRes.ok) {
                throw new Error(
                    signData.error ||
                        "Could not get Cloudinary signature. Verify your .env.local variables.",
                );
            }

            // 2. Upload file directly from browser to Cloudinary (bypasses Vercel 4.5MB limit)
            const formData = new FormData();
            formData.append("file", file);
            formData.append("api_key", signData.apiKey);
            formData.append("timestamp", String(signData.timestamp));
            formData.append("signature", signData.signature);
            formData.append("folder", signData.folder);

            const uploadRes = await fetch(
                `https://api.cloudinary.com/v1_1/${signData.cloudName}/image/upload`,
                {
                    method: "POST",
                    body: formData,
                },
            );

            const uploadData = await uploadRes.json();
            if (!uploadRes.ok) {
                throw new Error(
                    uploadData?.error?.message ||
                        "Failed to upload image to Cloudinary.",
                );
            }

            onChange(uploadData.secure_url, uploadData.public_id);
        } catch (err) {
            const msg =
                err instanceof Error ? err.message : "Upload failed";
            setError(msg);
        } finally {
            setUploading(false);
        }
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            void handleFileUpload(file);
        }
    }

    function handleDrop(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            void handleFileUpload(file);
        }
    }

    return (
        <div className="input-group">
            <label className="input-label">{label}</label>

            {/* Hidden inputs for FormData Server Actions */}
            <input type="hidden" name={urlInputName} value={value} />
            <input type="hidden" name={publicIdInputName} value={publicId} />

            <div
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                    border: `2px dashed ${
                        dragOver
                            ? "var(--cyan)"
                            : value
                              ? "rgba(0, 245, 80, 0.4)"
                              : "var(--border)"
                    }`,
                    borderRadius: "16px",
                    padding: "24px",
                    textAlign: "center",
                    cursor: uploading ? "wait" : "pointer",
                    background: dragOver
                        ? "rgba(0, 245, 255, 0.06)"
                        : "rgba(255, 255, 255, 0.02)",
                    transition: "all 0.2s ease",
                }}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                />

                {uploading ? (
                    <div style={{ padding: "20px 0" }}>
                        <p
                            style={{
                                color: "var(--cyan)",
                                fontWeight: 700,
                                marginBottom: "8px",
                            }}
                        >
                            ✨ Uploading artwork to Cloudinary...
                        </p>
                        <p style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
                            Please wait while high-resolution image is processed.
                        </p>
                    </div>
                ) : value ? (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "12px",
                        }}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={value}
                            alt="Uploaded artwork preview"
                            style={{
                                maxHeight: "220px",
                                borderRadius: "12px",
                                objectFit: "contain",
                                border: "1px solid var(--border-cyan)",
                            }}
                        />
                        <div style={{ display: "flex", gap: "10px" }}>
                            <span className="tag available">
                                Image Ready
                            </span>
                            <button
                                type="button"
                                className="btn btn-ghost"
                                style={{
                                    padding: "4px 12px",
                                    fontSize: "0.75rem",
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onChange("", "");
                                }}
                            >
                                Remove / Replace
                            </button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <p
                            style={{
                                fontWeight: 700,
                                color: "var(--white)",
                                marginBottom: "4px",
                            }}
                        >
                            📤 Click or drag &amp; drop an illustration here
                        </p>
                        <p style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
                            {helperText}
                        </p>
                    </div>
                )}
            </div>

            {/* Fallback / Direct URL input */}
            <div style={{ marginTop: "8px" }}>
                <input
                    type="url"
                    className="input"
                    placeholder="Or paste a direct image URL (https://res.cloudinary.com/...)"
                    value={value}
                    onChange={(e) => onChange(e.target.value, publicId)}
                />
            </div>

            {error && (
                <p
                    style={{
                        color: "#ff6b6b",
                        fontSize: "0.85rem",
                        marginTop: "4px",
                        fontWeight: 600,
                    }}
                >
                    ⚠️ {error}
                </p>
            )}
        </div>
    );
}
