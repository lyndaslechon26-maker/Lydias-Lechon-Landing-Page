import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: "Lydia's Lechon - 60 Years of Legendary Lechon",
  description: "Experience authentic Filipino lechon perfected over 60 years. Book events, order online, and celebrate with Lydia's Lechon - bringing rich heritage and unforgettable flavor to every celebration since 1965.",
  keywords: ['lechon', 'Filipino food', 'restaurant', 'catering', 'events', 'Manila', 'Philippines', 'Lydias Lechon'],
  authors: [{ name: "Lydia's Lechon" }],
  openGraph: {
    title: "Lydia's Lechon - 60 Years of Legendary Lechon",
    description: "Experience authentic Filipino lechon perfected over 60 years. Book events and order online.",
    type: 'website',
    locale: 'en_PH',
    siteName: "Lydia's Lechon",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
