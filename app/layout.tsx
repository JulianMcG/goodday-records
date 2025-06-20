import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Good Day Records - Album Sharing Platform',
  description: 'Share your favorite albums with custom subdomains. Upload album covers, artist names, and streaming links.',
  keywords: 'music, albums, streaming, spotify, apple music, good day records',
  authors: [{ name: 'Good Day Records' }],
  openGraph: {
    title: 'Good Day Records - Album Sharing Platform',
    description: 'Share your favorite albums with custom subdomains',
    type: 'website',
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