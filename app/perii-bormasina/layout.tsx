import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://esellroyal.ro"),
  title: "Perii rotative pentru bormașină — Curățare rapidă și eficientă",
  description:
    "Curăță murdăria imposibilă în 10 secunde. Set 4 perii rotative compatibile cu orice bormașină. Plată la livrare. Garanție 12 luni.",
  openGraph: {
    title: "Perii rotative pentru bormașină — Curățare profesională",
    description: "Curăță murdăria imposibilă în 10 secunde. Transformă bormașina ta într-o unealtă profesională de curățat.",
    images: ["/images/perii-bormasina/67b87abbbf6ef_main_f00dbc6fcc_67b87abbbf797_171b1500.avif"],
    locale: "ro_RO",
    type: "website",
  },
};

export default function PeriiBormasinaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
