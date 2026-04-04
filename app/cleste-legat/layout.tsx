import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://esellroyal.ro"),
  title: "Clește profesional de legat plante — Livrare în România",
  description:
    "Leagă vita de vie, roșii și orice plantă de 10× mai repede. O singură apăsare: bandă + capsă. Plată la livrare. Garanție 12 luni.",
  openGraph: {
    title: "Clește profesional de legat plante",
    description: "Leagă vita de vie de 10× mai repede. Plată la livrare. Garanție 12 luni.",
    images: ["/images/tapener-hero.jpeg"],
    locale: "ro_RO",
    type: "website",
  },
};

export default function ClesteLegLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
