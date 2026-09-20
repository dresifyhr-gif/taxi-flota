import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Admin — FleetHub",
  robots: { index: false, follow: false },
};

// Admin je fiksan kao aplikacija — bez pinch-zooma / dvostrukog dodira
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-root relative min-h-screen bg-[#070a08] font-[var(--font-body)] text-white">
      {/* suptilna zelena atmosfera u pozadini */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(60rem 40rem at 15% -10%, rgba(52,209,134,0.10), transparent 60%), radial-gradient(50rem 40rem at 100% 0%, rgba(52,209,134,0.06), transparent 55%)",
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
