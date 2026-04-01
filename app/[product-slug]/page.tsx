import type { Metadata } from "next";
import { notFound } from "next/navigation";

// Product registry — extend here when adding new products
const PRODUCTS: Record<string, { title: string; description: string }> = {
  "cleste-legat": {
    title: "Clește Legat — Unealta Profesională",
    description:
      "Descoperă cleștele de legat premium — rapid, durabil, perfect pentru orice proiect.",
  },
};

interface ProductPageProps {
  params: Promise<{ "product-slug": string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { "product-slug": slug } = await params;
  const product = PRODUCTS[slug];
  if (!product) return {};
  return {
    title: product.title,
    description: product.description,
  };
}

export function generateStaticParams() {
  return Object.keys(PRODUCTS).map((slug) => ({ "product-slug": slug }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { "product-slug": slug } = await params;
  const product = PRODUCTS[slug];
  if (!product) notFound();

  // Section imports are intentionally dynamic so each product page
  // can eventually override individual sections.
  const { default: Hero } = await import(`@/sections/Hero`);
  const { default: Problem } = await import(`@/sections/Problem`);
  const { default: Demo } = await import(`@/sections/Demo`);
  const { default: Benefits } = await import(`@/sections/Benefits`);
  const { default: HowItWorks } = await import(`@/sections/HowItWorks`);
  const { default: Offer } = await import(`@/sections/Offer`);
  const { default: Reviews } = await import(`@/sections/Reviews`);
  const { default: FAQ } = await import(`@/sections/FAQ`);
  const { default: CTAFinal } = await import(`@/sections/CTAFinal`);

  return (
    <main>
      <Hero />
      <Problem />
      <Demo />
      <Benefits />
      <HowItWorks />
      <Offer />
      <Reviews />
      <FAQ />
      <CTAFinal />
    </main>
  );
}
