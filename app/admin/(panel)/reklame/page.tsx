import { Download } from "lucide-react";

import { CopyButton } from "@/components/admin/copy-button";
import { Card, PageHeader } from "@/components/admin/ui";
import { adCreatives, adFormats, adImagePath } from "@/lib/ads";

export const metadata = { title: "Reklame — FleetHub admin" };

export default function ReklamePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Reklame"
        subtitle="Gotove slike i tekstovi za Instagram i Facebook. Skini sliku, kopiraj tekst i objavi."
      />

      <div className="grid gap-5 xl:grid-cols-2">
        {adCreatives.map((ad) => (
          <Card key={ad.slug} className="flex flex-col gap-5">
            <div>
              <h2 className="text-lg font-bold text-white">{ad.title}</h2>
              <p className="mt-1 text-sm text-white/55">{ad.audience}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {adFormats.map((format) => {
                const src = adImagePath(ad.slug, format.key);
                return (
                  <div key={format.key} className="flex flex-col gap-2">
                    <a
                      href={src}
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-72 items-center justify-center overflow-hidden rounded-xl border border-hairline bg-black/40 transition hover:border-hairline-strong"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        alt={`${ad.title} — ${format.label}`}
                        loading="lazy"
                        className="max-h-full max-w-full object-contain"
                      />
                    </a>
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white">{format.label}</p>
                        <p className="truncate text-xs text-white/45">{format.hint}</p>
                      </div>
                      <a
                        href={src}
                        download
                        className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-xl bg-accent px-3 text-xs font-bold text-[#04120b] transition hover:bg-accentDark"
                      >
                        <Download className="h-3.5 w-3.5" /> Skini
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40">
                  Tekst objave
                </span>
                <CopyButton value={ad.caption} label="Kopiraj tekst" />
              </div>
              <p className="whitespace-pre-line rounded-xl border border-hairline bg-white/[0.03] p-4 text-sm leading-6 text-white/75">
                {ad.caption}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
