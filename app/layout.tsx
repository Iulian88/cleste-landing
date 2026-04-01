import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | eSellRoyal",
    default: "eSellRoyal",
  },
  description: "Produse premium pentru tine.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ro">
      <body className="bg-white text-gray-900 antialiased">{children}</body>
    </html>
  );
}
