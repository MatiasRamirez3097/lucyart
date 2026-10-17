import React from "react";
import { getPortfolioItems } from "@/app/actions/portfolio";
import { getCommissionTiers } from "@/app/actions/commissions";
import AdminPortfolioClient from "@/components/AdminPortfolioClient";

export const dynamic = "force-dynamic";

export default async function AdminPortfolioPage() {
    const [items, tiers] = await Promise.all([
        getPortfolioItems(),
        getCommissionTiers(),
    ]);

    return (
        <AdminPortfolioClient initialItems={items} commissionTiers={tiers} />
    );
}
