import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — FleetHub",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-950 font-[var(--font-body)] text-neutral-100">
      {children}
    </div>
  );
}
