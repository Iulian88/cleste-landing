import type { Metadata } from "next";

const BASE_URL = "https://esellroyal.ro";
const PAGE_URL = `${BASE_URL}/perii-bormasina`;
const OG_IMAGE = "/images/perii-bormasina/67b87abbbf6ef_3_b0dc79ec2a_67b87abc6a368_ab146775.jpg";

const TITLE = "Perii rotative pentru bormașină – Curățare rapidă fără efort";
const DESCRIPTION =
  "Curăță murdăria imposibilă în 10 secunde. Set 4 perii rotative compatibile cu orice bormașină. Plată la livrare.";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: PAGE_URL,
    siteName: "esellroyal.ro",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Perii rotative pentru bormașină – înainte și după curățare",
      },
    ],
    locale: "ro_RO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
};

export default function PeriiBormasinaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
