import React from "react";
import { getSiteSettings } from "@/app/actions/settings";
import AdminSettingsClient from "@/components/AdminSettingsClient";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
    const settings = await getSiteSettings();

    return <AdminSettingsClient initialSettings={settings} />;
}
