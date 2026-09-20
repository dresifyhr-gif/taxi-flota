"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="hr">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#070a08",
          color: "#fff",
          fontFamily: "system-ui, sans-serif",
          padding: "24px",
        }}
      >
        <div style={{ maxWidth: 520, textAlign: "center" }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 8px" }}>Nešto je puklo</h2>
          <p style={{ color: "rgba(255,255,255,0.6)", margin: "0 0 16px", fontSize: 14 }}>
            Pošalji ovu poruku podršci pa ćemo odmah riješiti:
          </p>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              textAlign: "left",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 12,
              padding: "12px 14px",
              fontSize: 13,
              color: "#a6ffd8",
            }}
          >
            {error?.message || "Nepoznata greška"}
            {error?.digest ? `\n\ndigest: ${error.digest}` : ""}
          </pre>
          <button
            onClick={reset}
            style={{
              marginTop: 16,
              background: "#34d186",
              color: "#04120b",
              border: "none",
              borderRadius: 12,
              padding: "10px 18px",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Pokušaj ponovno
          </button>
        </div>
      </body>
    </html>
  );
}
