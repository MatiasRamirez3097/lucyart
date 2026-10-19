import React from "react";
import { getCommissionTiers, getInquiries } from "@/app/actions/commissions";
import { getPortfolioItems } from "@/app/actions/portfolio";
import AdminCommissionsClient from "@/components/AdminCommissionsClient";

export const dynamic = "force-dynamic";

export default async function AdminCommissionsPage() {
    const [tiers, inquiries, portfolioItems] = await Promise.all([
        getCommissionTiers(),
        getInquiries(),
        getPortfolioItems(),
    ]);

    return (
        <AdminCommissionsClient
            initialTiers={tiers}
            initialInquiries={inquiries}
            portfolioItems={portfolioItems}
        />
    );
}
