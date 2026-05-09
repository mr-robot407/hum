import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '../lib/auth-context'

export const metadata: Metadata = {
  title: 'HUM — Kashmir\'s Creator Economy Platform',
  description: 'Future-proofing Kashmir businesses through verified local creators. AI-matched campaigns, real ROI.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
