"use client";

import { useRef, useState } from "react";

/** Smanji sliku u pregledniku (max stranica ~1600px, JPEG) da upload stane u limit. */
async function compressImage(file: File, maxDim = 1600, quality = 0.82): Promise<File> {
  if (!file.type.startsWith("image/")) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
    const w = Math.max(1, Math.round(bitmap.width * scale));
    const h = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, w, h);
    bitmap.close?.();
    const blob: Blob | null = await new Promise((res) =>
      canvas.toBlob((b) => res(b), "image/jpeg", quality),
    );
    if (!blob || blob.size >= file.size) return blob ? new File([blob], rename(file.name), { type: "image/jpeg" }) : file;
    return new File([blob], rename(file.name), { type: "image/jpeg" });
  } catch {
    return file; // ako kompresija ne uspije, šalji original
  }
}

function rename(name: string) {
  return name.replace(/\.[^.]+$/, "") + ".jpg";
}

export function ImageUploadField({ className }: { className?: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<"idle" | "working" | "done">("idle");
  const [count, setCount] = useState(0);

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) {
      setCount(0);
      setStatus("idle");
      return;
    }
    setStatus("working");
    const compressed = await Promise.all(files.map((f) => compressImage(f)));
    const dt = new DataTransfer();
    compressed.forEach((f) => dt.items.add(f));
    if (inputRef.current) inputRef.current.files = dt.files;
    setCount(compressed.length);
    setStatus("done");
  }

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        name="image"
        type="file"
        accept="image/*"
        multiple
        onChange={onChange}
        className={className}
      />
      {status === "working" ? (
        <p className="text-xs font-medium text-accent">Obrađujem slike… pričekaj sekundu.</p>
      ) : null}
      {status === "done" ? (
        <p className="text-xs text-white/50">
          {count} {count === 1 ? "slika spremna" : "slika spremno"} (smanjeno za brži upload).
        </p>
      ) : null}
    </div>
  );
}
