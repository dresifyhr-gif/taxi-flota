import { redirect } from "next/navigation";

import { isAdminAuthed, logout } from "@/app/admin/actions";
import { AdminSidebar } from "@/components/admin/sidebar";
import { ServiceWorkerRegister } from "@/components/admin/service-worker-register";
import { getAdminSettings } from "@/lib/admin-settings";
import { countNewApplications } from "@/lib/applications";
import { countNewCallbacks } from "@/lib/callbacks";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAdminAuthed())) {
    redirect("/admin/login");
  }

  const [settings, newApplications, newCallbacks] = await Promise.all([
    getAdminSettings(),
    countNewApplications().catch(() => 0),
    countNewCallbacks().catch(() => 0),
  ]);
  const locked = settings?.is_locked ?? false;

  return (
    <div className="min-h-screen lg:flex">
      <ServiceWorkerRegister />
      <AdminSidebar
        locked={locked}
        logout={logout}
        counts={{ prijave: newApplications, pozivi: newCallbacks }}
      />
      <main className="min-w-0 flex-1 px-4 py-6 sm:px-8 lg:py-10">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
