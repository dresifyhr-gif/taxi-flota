import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — FleetHub",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f5f6f8] font-[var(--font-body)] text-neutral-900">
      {children}
    </div>
  );
}
