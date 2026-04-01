"use client";

import Image from "next/image";
import Button from "@/components/Button";

const BULLETS = [
  "Fixare rapidă în 1 secundă",
  "Nu mai rănești plantele",
  "Ideal pentru grădină și solarii",
] as const;

const TRUST = [
  { icon: "🚚", text: "Livrare 24–48h" },
  { icon: "💳", text: "Plata la livrare" },
  { icon: "🛡️", text: "Garanție 14 zile" },
] as const;

export default function Hero() {
  return (
    <header className="w-full bg-white">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-10 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">

          {/* ── Image column — first on mobile, second on desktop ── */}
          <div className="order-first md:order-last flex justify-center">
            <div className="relative w-full max-w-sm md:max-w-none rounded-2xl overflow-hidden shadow-xl ring-1 ring-gray-100">
              <Image
                src="/images/products/cleste-legat/hero.jpeg"
                alt="Aparat de legat plante folosit pe viță de vie — clește legat profesional"
                width={680}
                height={760}
                priority
                sizes="(max-width: 768px) 90vw, 50vw"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* ── Text column — second on mobile, first on desktop ── */}
          <div className="order-last md:order-first flex flex-col gap-6">

            {/* Eyebrow badge */}
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-green-50 border border-green-200 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-green-700">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Aparat profesional de legat
            </span>

            {/* Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-gray-900">
              Leagă plantele{" "}
              <span className="text-green-600">de 5 ori mai rapid</span>,{" "}
              fără durere în mâini.
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg leading-relaxed text-gray-500 max-w-lg">
              Aparat profesional pentru legarea rapidă a roșiilor, viței de vie și
              altor plante — economisești timp și obții rezultate curate, ca un
              profesionist.
            </p>

            {/* Bullet list */}
            <ul className="flex flex-col gap-2.5" aria-label="Caracteristici principale">
              {BULLETS.map((point) => (
                <li key={point} className="flex items-center gap-3 text-sm sm:text-base font-medium text-gray-800">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
                    </svg>
                  </span>
                  {point}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
              <Button
                variant="cta"
                size="lg"
                onClick={() => {
                  document.getElementById("offer")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="rounded-xl text-base font-bold tracking-wide px-8 py-4 transition-transform active:scale-[0.98]"
              >
                Vezi oferta acum →
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1 border-t border-gray-100">
              {TRUST.map(({ icon, text }) => (
                <span key={text} className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                  <span aria-hidden="true">{icon}</span>
                  {text}
                </span>
              ))}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
}

