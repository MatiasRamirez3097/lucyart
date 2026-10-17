import React from "react";
import ContactFormClient from "@/components/ContactFormClient";

interface ContactPageProps {
    searchParams: Promise<{
        subject?: string;
        tier?: string;
        item?: string;
    }>;
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
    const params = await searchParams;
    const defaultSubject = params.subject || "";
    const defaultTarget = params.tier || params.item || "";

    return (
        <section className="section">
            <div className="container" style={{ maxWidth: "600px" }}>
                <header
                    className="section-header"
                    style={{ textAlign: "center" }}
                >
                    <h1 className="section-title gradient-text">Contact Me</h1>
                    <p className="section-subtitle">
                        Inquiries, commission requests, or adoptable claims!
                    </p>
                </header>

                <ContactFormClient
                    key={`${defaultSubject}-${defaultTarget}`}
                    defaultSubject={defaultSubject}
                    defaultTarget={defaultTarget}
                />

                <div
                    style={{
                        marginTop: "40px",
                        textAlign: "center",
                        color: "var(--muted)",
                    }}
                >
                    <p>
                        You can also DM me on my social media links (see
                        footer).
                    </p>
                </div>
            </div>
        </section>
    );
}
