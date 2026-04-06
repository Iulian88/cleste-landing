"use client";

import { useEffect } from "react";

function firePixel(...args: unknown[]) {
  if (typeof window === "undefined") return;
  const tryFire = (retries = 0) => {
    if (typeof (window as unknown as { fbq?: unknown }).fbq === "function") {
      (window as unknown as { fbq: (...a: unknown[]) => void }).fbq(...args);
    } else if (retries < 20) {
      setTimeout(() => tryFire(retries + 1), 100);
    }
  };
  tryFire();
}

export default function Confirmare() {
  useEffect(() => {
    const raw = sessionStorage.getItem("fbPurchase");
    if (raw) {
      try {
        const data = JSON.parse(raw) as { product?: string; value: number; currency: string; contents: unknown[] };
        firePixel("track", "Purchase", {
          content_name: data.product ?? "esellroyal",
          value: data.value,
          currency: data.currency,
          contents: data.contents,
          content_type: "product",
        });
        console.log("FB: Purchase", data.value, data.contents);
      } catch {}
      sessionStorage.removeItem("fbPurchase");
    }
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f7f2",
        fontFamily: "'DM Sans', sans-serif",
        padding: "2rem 1.5rem",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "20px",
          padding: "3rem 2.5rem",
          maxWidth: "480px",
          width: "100%",
          textAlign: "center",
          boxShadow: "0 4px 32px rgba(45,90,39,0.1)",
          border: "1px solid #e0e5d5",
        }}
      >
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🌿</div>

        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.6rem",
            color: "#2d5a27",
            marginBottom: "0.75rem",
          }}
        >
          Comanda a fost trimisă!
        </h1>

        <p style={{ color: "#666", fontSize: "1rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
          Te vom contacta telefonic în cel mai scurt timp pentru confirmarea comenzii.
        </p>

        <div
          style={{
            background: "#f0f7ee",
            borderRadius: "12px",
            padding: "1rem 1.25rem",
            fontSize: "0.875rem",
            color: "#2d5a27",
            lineHeight: 1.7,
          }}
        >
          <div>✓ Plată la livrare — nu plătești nimic acum</div>
          <div>✓ Livrare estimată în 3–5 zile lucrătoare</div>
          <div>✓ Garanție 12 luni</div>
        </div>
      </div>
    </main>
  );
}
