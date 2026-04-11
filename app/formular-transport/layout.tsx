import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sondaj pentru dispeceri transport — 5 minute',
  description: 'Ajută-ne să construim un asistent AI pentru dispeceri și firme de transport din România. CMR, e-Transport, facturare — ce automatizăm primul?',
  openGraph: {
    title: 'Sondaj pentru dispeceri transport — 5 minute',
    description: 'Construim un asistent AI pentru transport România. Ce îți mănâncă cel mai mult timp zilnic — CMR, e-Transport sau altceva?',
    url: 'https://esellroyal.ro/formular-transport',
    siteName: 'eSellRoyal',
    locale: 'ro_RO',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Sondaj pentru dispeceri transport — 5 minute',
    description: 'Asistent AI pentru firme de transport din România.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
