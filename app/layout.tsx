import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: {
    template: "%s | eSellRoyal",
    default: "eSellRoyal",
  },
  description: "Aparat de legat plante — profesional, rapid, durabil.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
