/** Suptilne zelene "aurora" mrlje koje polako plutaju — rade i na tamnoj i svijetloj temi. */
export function AuroraGlow({
  className = "",
  intensity = "normal",
}: {
  className?: string;
  intensity?: "soft" | "normal";
}) {
  const a = intensity === "soft" ? "bg-accent/10" : "bg-accent/20";
  const b = intensity === "soft" ? "bg-accent/[0.07]" : "bg-accent/15";
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <div
        className={`absolute -left-24 -top-10 h-72 w-72 rounded-full ${a} blur-3xl`}
        style={{ animation: "glow-drift 15s ease-in-out infinite" }}
      />
      <div
        className={`absolute -right-16 bottom-0 h-80 w-80 rounded-full ${b} blur-3xl`}
        style={{ animation: "glow-drift 19s ease-in-out infinite reverse" }}
      />
    </div>
  );
}

/** Tanka zelena linija koja "skenira" s lijeva na desno — suptilan razdjelnik. */
export function ScanLine({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none relative h-px w-full overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/25 to-transparent" />
      <div
        className="absolute top-0 h-px w-1/3 bg-gradient-to-r from-transparent via-accent to-transparent"
        style={{ animation: "scan-x 5s linear infinite" }}
      />
    </div>
  );
}
