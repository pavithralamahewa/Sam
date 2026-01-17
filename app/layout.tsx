import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Precious AI COO - Intelligent Business Operating System',
  description: 'World-class AI Chief Operating Officer that monitors, optimizes, and drives revenue for your agency',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
