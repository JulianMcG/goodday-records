import type { Metadata } from 'next'
import { Inter, Instrument_Sans } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })
const instrumentSans = Instrument_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Good Day Records - Create Album Pages',
  description: 'Create beautiful album pages with custom subdomains. Upload covers, add streaming links, and share your music.',
  metadataBase: new URL('https://gooddayrecords.xyz'),
  keywords: 'music, albums, streaming, spotify, apple music, good day records',
  authors: [{ name: 'Good Day Records' }],
  openGraph: {
    title: 'Good Day Records - Create Album Pages',
    description: 'Create beautiful album pages with custom subdomains. Upload covers, add streaming links, and share your music.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Good Day Records - Create Album Pages',
    description: 'Create beautiful album pages with custom subdomains. Upload covers, add streaming links, and share your music.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster 
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1e293b',
              color: '#f8fafc',
            },
          }}
        />
      </body>
    </html>
  )
} 