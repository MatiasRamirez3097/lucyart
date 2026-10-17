import React from "react";
import { getAdoptables } from "@/app/actions/adoptables";
import AdminAdoptablesClient from "@/components/AdminAdoptablesClient";

export const dynamic = "force-dynamic";

export default async function AdminAdoptablesPage() {
    const adoptables = await getAdoptables();

    return <AdminAdoptablesClient initialAdoptables={adoptables} />;
}
