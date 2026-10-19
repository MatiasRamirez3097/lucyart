// --- Authentication & Users (RBAC) ---
export type UserRole = "admin" | "client";

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatarUrl?: string;
    isActive: boolean;
    createdAt?: string;
}

export interface SessionUser {
    userId: string;
    name: string;
    email: string;
    role: UserRole;
    expiresAt: number;
}

// --- Adoptables ---
export type AdoptableStatus = "available" | "pending" | "sold";

export interface Adoptable {
    id: string;
    title: string;
    price: number;
    status: AdoptableStatus;
    description: string;
    imageUrl: string;
    publicId?: string;
    owner?: string;
    createdAt?: string;
}

// --- Portfolio & Completed Commissions ---
export type PortfolioCategory =
    | "Full Body"
    | "Half Body"
    | "Bust"
    | "Chibi"
    | "Scene"
    | "Reference Sheet";

export interface PortfolioItem {
    id: string;
    title: string;
    category: string;
    imageUrl: string;
    publicId?: string;
    description?: string;
    isCommission?: boolean;
    clientName?: string;
    commissionTierId?: string;
    featured?: boolean;
    createdAt?: string;
}

// --- Commissions ---
export type CommissionTierStatus = "open" | "waitlist" | "closed";

export interface CommissionTier {
    id: string;
    title: string;
    priceBase: number;
    status: CommissionTierStatus;
    categoryMatch?: string;
    description: string;
    features: string[];
    exampleImages: string[];
    order?: number;
}

// --- Contact Inquiries & Commission Orders ---
export type InquirySubject =
    | "commission"
    | "adoptable"
    | "collaboration"
    | "other";

export type InquiryStatus =
    | "pending"
    | "in_progress"
    | "completed"
    | "archived";

export interface Inquiry {
    id: string;
    userId?: string; // Optional link to registered client User
    name: string;
    email: string;
    subject: InquirySubject;
    targetItem?: string;
    message: string;
    status: InquiryStatus;
    createdAt: string;
}
