import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sondaj pentru contabili — 5 minute',
  description: 'Ajută-ne să construim un tool AI care reduce munca repetitivă a contabililor din România. Completează sondajul în 5 minute.',
  openGraph: {
    title: 'Sondaj pentru contabili — 5 minute',
    description: 'Ajută-ne să construim un tool AI pentru contabili din România. Ce te consumă cel mai mult zilnic?',
    url: 'https://esellroyal.ro/formular-contabilitate',
    siteName: 'eSellRoyal',
    locale: 'ro_RO',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Sondaj pentru contabili — 5 minute',
    description: 'Ajută-ne să construim un tool AI pentru contabili din România.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
