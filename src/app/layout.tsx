import type { Viewport } from 'next'
import { type ReactNode } from 'react'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
