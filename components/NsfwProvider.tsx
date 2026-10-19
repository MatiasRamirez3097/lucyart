"use client";

import React, {
    createContext,
    useCallback,
    useContext,
    useState,
    useSyncExternalStore,
} from "react";

const STORAGE_KEY = "lucyart_nsfw_pref_v1";
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

interface StoredNsfwPref {
    showNsfw: boolean;
    verified18Plus: boolean;
    expiresAt: number;
}

const DEFAULT_SNAPSHOT = JSON.stringify({
    showNsfw: false,
    verified18Plus: false,
    expiresAt: 0,
});

const listeners = new Set<() => void>();

function emitChange() {
    for (const listener of listeners) {
        listener();
    }
}

function subscribe(callback: () => void): () => void {
    listeners.add(callback);
    const handleStorage = (e: StorageEvent) => {
        if (e.key === STORAGE_KEY) {
            callback();
        }
    };
    if (typeof window !== "undefined") {
        window.addEventListener("storage", handleStorage);
    }
    return () => {
        listeners.delete(callback);
        if (typeof window !== "undefined") {
            window.removeEventListener("storage", handleStorage);
        }
    };
}

function getSnapshot(): string {
    if (typeof window === "undefined") {
        return DEFAULT_SNAPSHOT;
    }
    try {
        return window.localStorage.getItem(STORAGE_KEY) || DEFAULT_SNAPSHOT;
    } catch {
        return DEFAULT_SNAPSHOT;
    }
}

function getServerSnapshot(): string {
    return DEFAULT_SNAPSHOT;
}

function parseValidPref(raw: string): StoredNsfwPref {
    try {
        const parsed = JSON.parse(raw) as Partial<StoredNsfwPref>;
        const now = Date.now();
        if (
            typeof parsed.expiresAt === "number" &&
            parsed.expiresAt > now &&
            parsed.verified18Plus === true
        ) {
            return {
                showNsfw: Boolean(parsed.showNsfw),
                verified18Plus: true,
                expiresAt: parsed.expiresAt,
            };
        }
    } catch {
        // Ignore malformed JSON
    }
    return {
        showNsfw: false,
        verified18Plus: false,
        expiresAt: 0,
    };
}

function writePref(pref: StoredNsfwPref) {
    if (typeof window === "undefined") return;
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(pref));
        emitChange();
    } catch {
        // Ignore storage quota errors
    }
}

interface NsfwContextValue {
    showNsfw: boolean;
    verified18Plus: boolean;
    toggleNsfw: () => void;
    setShowNsfw: (next: boolean) => void;
}

const NsfwContext = createContext<NsfwContextValue>({
    showNsfw: false,
    verified18Plus: false,
    toggleNsfw: () => {},
    setShowNsfw: () => {},
});

export function useNsfw(): NsfwContextValue {
    return useContext(NsfwContext);
}

export default function NsfwProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const rawSnapshot = useSyncExternalStore(
        subscribe,
        getSnapshot,
        getServerSnapshot,
    );
    const pref = parseValidPref(rawSnapshot);
    const [isAgeModalOpen, setIsAgeModalOpen] = useState<boolean>(false);

    const setShowNsfw = useCallback(
        (next: boolean) => {
            if (!next) {
                // Turning OFF NSFW keeps the 18+ verification valid until its original expiry
                writePref({
                    showNsfw: false,
                    verified18Plus: pref.verified18Plus,
                    expiresAt:
                        pref.verified18Plus && pref.expiresAt > Date.now()
                            ? pref.expiresAt
                            : 0,
                });
                return;
            }

            // Turning ON NSFW: check if already verified within the last 7 days
            if (pref.verified18Plus && pref.expiresAt > Date.now()) {
                writePref({
                    showNsfw: true,
                    verified18Plus: true,
                    expiresAt: Date.now() + SEVEN_DAYS_MS,
                });
            } else {
                // Prompt 18+ confirmation modal
                setIsAgeModalOpen(true);
            }
        },
        [pref.expiresAt, pref.verified18Plus],
    );

    const toggleNsfw = useCallback(() => {
        setShowNsfw(!pref.showNsfw);
    }, [pref.showNsfw, setShowNsfw]);

    function handleConfirmAge() {
        writePref({
            showNsfw: true,
            verified18Plus: true,
            expiresAt: Date.now() + SEVEN_DAYS_MS,
        });
        setIsAgeModalOpen(false);
    }

    function handleCancelAge() {
        setIsAgeModalOpen(false);
    }

    return (
        <NsfwContext.Provider
            value={{
                showNsfw: pref.showNsfw,
                verified18Plus: pref.verified18Plus,
                toggleNsfw,
                setShowNsfw,
            }}
        >
            {children}

            {/* Global 18+ Age Verification Modal */}
            {isAgeModalOpen && (
                <div
                    onClick={handleCancelAge}
                    style={{
                        position: "fixed",
                        inset: 0,
                        zIndex: 10000,
                        background: "rgba(13, 6, 24, 0.92)",
                        backdropFilter: "blur(10px)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "20px",
                    }}
                >
                    <div
                        className="card"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            maxWidth: "480px",
                            width: "100%",
                            padding: "32px 28px",
                            border: "2px solid var(--pink)",
                            boxShadow: "0 0 36px rgba(255, 45, 120, 0.35)",
                            textAlign: "center",
                            display: "flex",
                            flexDirection: "column",
                            gap: "18px",
                        }}
                    >
                        <div
                            style={{
                                width: "64px",
                                height: "64px",
                                borderRadius: "50%",
                                background: "rgba(255, 45, 120, 0.15)",
                                border: "2px solid var(--pink)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "1.8rem",
                                margin: "0 auto",
                            }}
                        >
                            🔞
                        </div>

                        <div>
                            <span
                                className="tag pink"
                                style={{ marginBottom: "10px" }}
                            >
                                18+ Age Verification Required
                            </span>
                            <h2
                                style={{
                                    margin: "8px 0 0 0",
                                    fontSize: "1.6rem",
                                }}
                            >
                                Are you 18 years or older?
                            </h2>
                        </div>

                        <p
                            style={{
                                color: "var(--muted)",
                                fontSize: "0.95rem",
                                lineHeight: 1.6,
                                margin: 0,
                            }}
                        >
                            You are enabling <strong>NSFW (18+)</strong> content.
                            These artworks and commission options may contain
                            mature or explicit themes intended strictly for
                            adults.
                        </p>

                        <p
                            style={{
                                color: "var(--cyan)",
                                fontSize: "0.8rem",
                                margin: 0,
                            }}
                        >
                            Your selection will be remembered for 7 days so you
                            can browse seamlessly.
                        </p>

                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "10px",
                                marginTop: "6px",
                            }}
                        >
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleConfirmAge}
                                style={{
                                    width: "100%",
                                    justifyContent: "center",
                                    padding: "12px 20px",
                                    fontSize: "0.95rem",
                                }}
                            >
                                🔞 Yes, I am 18 or older — Show NSFW
                            </button>
                            <button
                                type="button"
                                className="btn btn-ghost"
                                onClick={handleCancelAge}
                                style={{
                                    width: "100%",
                                    justifyContent: "center",
                                    padding: "10px 20px",
                                }}
                            >
                                No, keep NSFW hidden
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </NsfwContext.Provider>
    );
}
