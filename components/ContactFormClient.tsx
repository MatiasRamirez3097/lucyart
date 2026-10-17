"use client";

import React, { useActionState, useState } from "react";
import {
    ContactActionState,
    submitContactForm,
} from "@/app/actions/contact";

interface ContactFormClientProps {
    defaultSubject?: string;
    defaultTarget?: string;
}

const initialState: ContactActionState = {
    success: false,
    message: "",
};

export default function ContactFormClient({
    defaultSubject = "",
    defaultTarget = "",
}: ContactFormClientProps) {
    const [state, formAction, isPending] = useActionState(
        submitContactForm,
        initialState,
    );
    const [subject, setSubject] = useState<string>(defaultSubject);
    const [targetItem, setTargetItem] = useState<string>(defaultTarget);

    return (
        <form
            action={formAction}
            className="card"
            style={{
                padding: "40px",
                display: "flex",
                flexDirection: "column",
                gap: "24px",
            }}
        >
            {state.message && (
                <div
                    style={{
                        padding: "16px 20px",
                        borderRadius: "12px",
                        fontWeight: 700,
                        fontSize: "0.9rem",
                        background: state.success
                            ? "rgba(0, 200, 100, 0.15)"
                            : "rgba(255, 60, 60, 0.15)",
                        border: `1px solid ${
                            state.success
                                ? "rgba(0, 200, 100, 0.4)"
                                : "rgba(255, 60, 60, 0.4)"
                        }`,
                        color: state.success ? "#00d464" : "#ff6b6b",
                    }}
                >
                    {state.success ? "✅ " : "⚠️ "}
                    {state.message}
                </div>
            )}

            <div
                className="grid-3"
                style={{ gridTemplateColumns: "1fr 1fr", gap: "20px" }}
            >
                <div className="input-group">
                    <label className="input-label" htmlFor="name">
                        Your Name / Alias *
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        className="input"
                        placeholder="Lucy Fan / @YourHandle"
                        required
                    />
                </div>
                <div className="input-group">
                    <label className="input-label" htmlFor="email">
                        Email Address *
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className="input"
                        placeholder="your@email.com"
                        required
                    />
                </div>
            </div>

            <div className="input-group">
                <label className="input-label" htmlFor="subject">
                    Subject *
                </label>
                <select
                    id="subject"
                    name="subject"
                    className="input"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                >
                    <option
                        value=""
                        disabled
                        style={{ background: "var(--bg-card)" }}
                    >
                        Select an option
                    </option>
                    <option
                        value="commission"
                        style={{ background: "var(--bg-card)" }}
                    >
                        Commission Request
                    </option>
                    <option
                        value="adoptable"
                        style={{ background: "var(--bg-card)" }}
                    >
                        Adoptable Claim
                    </option>
                    <option
                        value="collaboration"
                        style={{ background: "var(--bg-card)" }}
                    >
                        Collaboration
                    </option>
                    <option
                        value="other"
                        style={{ background: "var(--bg-card)" }}
                    >
                        Other Inquiry
                    </option>
                </select>
            </div>

            {(subject === "commission" ||
                subject === "adoptable" ||
                targetItem) && (
                <div className="input-group">
                    <label className="input-label" htmlFor="targetItem">
                        {subject === "adoptable"
                            ? "Adoptable Character Name"
                            : "Selected Commission Tier / Type"}
                    </label>
                    <input
                        type="text"
                        id="targetItem"
                        name="targetItem"
                        className="input"
                        placeholder={
                            subject === "adoptable"
                                ? "e.g. Starlight Mage"
                                : "e.g. Full Color Portrait"
                        }
                        value={targetItem}
                        onChange={(e) => setTargetItem(e.target.value)}
                    />
                </div>
            )}

            <div className="input-group">
                <label className="input-label" htmlFor="message">
                    Message / Details *
                </label>
                <textarea
                    id="message"
                    name="message"
                    className="input"
                    placeholder="Please provide details about your request, pose ideas, character reference links (Google Drive, Toyhouse, Imgur)..."
                    required
                ></textarea>
                <p
                    style={{
                        fontSize: "0.8rem",
                        color: "var(--muted)",
                        marginTop: "4px",
                    }}
                >
                    If requesting a commission, please include character
                    reference links and whether it is for personal or commercial
                    use.
                </p>
            </div>

            <div style={{ textAlign: "center", marginTop: "16px" }}>
                <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ padding: "12px 60px" }}
                    disabled={isPending}
                >
                    {isPending ? "Sending..." : "Send Message"}
                </button>
            </div>
        </form>
    );
}
