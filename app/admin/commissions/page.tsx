import React from "react";
import { getCommissionTiers, getInquiries } from "@/app/actions/commissions";
import AdminCommissionsClient from "@/components/AdminCommissionsClient";

export const dynamic = "force-dynamic";

export default async function AdminCommissionsPage() {
    const [tiers, inquiries] = await Promise.all([
        getCommissionTiers(),
        getInquiries(),
    ]);

    return (
        <AdminCommissionsClient
            initialTiers={tiers}
            initialInquiries={inquiries}
        />
    );
}
