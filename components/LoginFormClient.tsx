"use client";

import React, { useActionState } from "react";
import { AuthActionState, loginAction } from "@/app/actions/auth";

interface LoginFormClientProps {
    callbackUrl?: string;
}

const initialState: AuthActionState = {
    success: false,
    message: "",
};

export default function LoginFormClient({
    callbackUrl = "/admin",
}: LoginFormClientProps) {
    const [state, formAction, isPending] = useActionState(
        loginAction,
        initialState,
    );

    return (
        <form
            action={formAction}
            className="card holo-card"
            style={{
                padding: "40px",
                display: "flex",
                flexDirection: "column",
                gap: "24px",
                border: "1px solid var(--border-cyan)",
            }}
        >
            <input type="hidden" name="callbackUrl" value={callbackUrl} />

            {state.message && (
                <div
                    style={{
                        padding: "14px 18px",
                        borderRadius: "12px",
                        fontWeight: 700,
                        fontSize: "0.9rem",
                        background: "rgba(255, 60, 60, 0.15)",
                        border: "1px solid rgba(255, 60, 60, 0.4)",
                        color: "#ff6b6b",
                    }}
                >
                    ⚠️ {state.message}
                </div>
            )}

            <div className="input-group">
                <label className="input-label" htmlFor="email">
                    Email Address
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    className="input"
                    placeholder="admin@lucyart.com"
                    autoComplete="email"
                    required
                />
            </div>

            <div className="input-group">
                <label className="input-label" htmlFor="password">
                    Password
                </label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    className="input"
                    placeholder="••••••••••••"
                    autoComplete="current-password"
                    required
                />
            </div>

            <button
                type="submit"
                className="btn btn-primary"
                style={{
                    width: "100%",
                    justifyContent: "center",
                    marginTop: "8px",
                }}
                disabled={isPending}
            >
                {isPending ? "Signing in..." : "🔐 Sign In"}
            </button>
        </form>
    );
}
