// app/terms/page.tsx
import React from "react";

export default function TermsPage() {
    return (
        <section className="section">
            <div className="container" style={{ maxWidth: "800px" }}>
                <header
                    className="section-header"
                    style={{ textAlign: "center" }}
                >
                    <h1 className="section-title gradient-text">
                        Terms of Service
                    </h1>
                    <p className="section-subtitle">
                        Please read these terms carefully before commissioning
                        me or purchasing an adoptable.
                    </p>
                </header>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "32px",
                    }}
                >
                    {/* General Terms */}
                    <div className="card" style={{ padding: "32px" }}>
                        <h2
                            style={{
                                color: "var(--pink)",
                                marginBottom: "16px",
                                fontSize: "1.5rem",
                            }}
                        >
                            1. General Terms
                        </h2>
                        <ul
                            style={{
                                color: "var(--muted)",
                                display: "flex",
                                flexDirection: "column",
                                gap: "12px",
                                paddingLeft: "20px",
                            }}
                        >
                            <li>
                                I reserve the right to decline any commission
                                request without needing to explain the reason.
                            </li>
                            <li>
                                Please provide clear visual references.
                                Text-only descriptions might incur an extra fee
                                for character design.
                            </li>
                            <li>
                                I will not draw: NSFW, extreme gore, mecha
                                (complex), or hateful imagery.
                            </li>
                            <li>
                                Communication will be done via email or the
                                provided social media platforms.
                            </li>
                        </ul>
                    </div>

                    {/* Payment & Refunds */}
                    <div className="card" style={{ padding: "32px" }}>
                        <h2
                            style={{
                                color: "var(--cyan)",
                                marginBottom: "16px",
                                fontSize: "1.5rem",
                            }}
                        >
                            2. Payment & Refunds
                        </h2>
                        <ul
                            style={{
                                color: "var(--muted)",
                                display: "flex",
                                flexDirection: "column",
                                gap: "12px",
                                paddingLeft: "20px",
                            }}
                        >
                            <li>
                                All payments are processed via PayPal in USD.
                            </li>
                            <li>
                                Payment must be made 100% upfront before I start
                                the sketch, or 50% upfront and 50% after the
                                sketch is approved.
                            </li>
                            <li>
                                No refunds are issued once I have started the
                                lineart/coloring phase. If you cancel during the
                                sketch phase, a 50% refund will be provided.
                            </li>
                        </ul>
                    </div>

                    {/* Process & Revisions */}
                    <div className="card" style={{ padding: "32px" }}>
                        <h2
                            style={{
                                color: "var(--purple)",
                                marginBottom: "16px",
                                fontSize: "1.5rem",
                            }}
                        >
                            3. Process & Revisions
                        </h2>
                        <ul
                            style={{
                                color: "var(--muted)",
                                display: "flex",
                                flexDirection: "column",
                                gap: "12px",
                                paddingLeft: "20px",
                            }}
                        >
                            <li>
                                Turnaround time is generally 2 to 4 weeks
                                depending on my queue and the complexity of the
                                piece.
                            </li>
                            <li>
                                I will send a WIP (Work In Progress) during the
                                sketch phase. Major changes (pose, outfit) can
                                only be made at this stage.
                            </li>
                            <li>
                                Minor color adjustments can be requested at the
                                final stage. Any major changes requested late in
                                the process will incur an extra fee.
                            </li>
                        </ul>
                    </div>

                    {/* Copyright & Usage */}
                    <div className="card" style={{ padding: "32px" }}>
                        <h2
                            style={{
                                color: "var(--yellow)",
                                marginBottom: "16px",
                                fontSize: "1.5rem",
                            }}
                        >
                            4. Copyright & Usage
                        </h2>
                        <ul
                            style={{
                                color: "var(--muted)",
                                display: "flex",
                                flexDirection: "column",
                                gap: "12px",
                                paddingLeft: "20px",
                            }}
                        >
                            <li>
                                <strong>Personal Use:</strong> You may use the
                                commissioned piece for icons, banners, or
                                personal prints. You may NOT use it for
                                merchandise, NFTs, or AI training.
                            </li>
                            <li>
                                <strong>Commercial Use:</strong> If you need the
                                art for VTuber assets, games, or merch, a
                                commercial fee (+50% to 100% of the base price)
                                will apply. Let me know upfront!
                            </li>
                            <li>
                                I retain the right to post the commissioned
                                artwork on my portfolio and social media. If you
                                need it kept private, please state so when
                                ordering.
                            </li>
                        </ul>
                    </div>

                    {/* Adoptables */}
                    <div
                        className="card"
                        style={{
                            padding: "32px",
                            border: "1px solid var(--border-cyan)",
                        }}
                    >
                        <h2
                            style={{
                                color: "var(--white)",
                                marginBottom: "16px",
                                fontSize: "1.5rem",
                            }}
                        >
                            5. Adoptables Rules
                        </h2>
                        <ul
                            style={{
                                color: "var(--muted)",
                                display: "flex",
                                flexDirection: "column",
                                gap: "12px",
                                paddingLeft: "20px",
                            }}
                        >
                            <li>
                                Once purchased, the character design belongs to
                                you. You can change their name, gender,
                                backstory, and make minor design tweaks.
                            </li>
                            <li>
                                You may resell the adoptable, but not for a
                                higher price than what you paid, unless it comes
                                with extra commissioned art.
                            </li>
                            <li>
                                Please credit <strong>LucyArt</strong> for the
                                original design when posting it for the first
                                time.
                            </li>
                            <li>
                                Commercial use rights for adoptables are
                                included unless stated otherwise on the specific
                                character&apos;s page.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
