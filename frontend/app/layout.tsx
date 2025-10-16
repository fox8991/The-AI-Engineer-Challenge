import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'OpenAI Chat Interface',
  description: 'A minimal chat interface for OpenAI models',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

