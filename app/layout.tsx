import './globals.css'
import type { Metadata } from 'next'
import { Noto_Sans_Georgian } from 'next/font/google'

const font = Noto_Sans_Georgian({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Collaborator',
  description: 'Organization based Collaboration and Chat',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={font.className}>{children}</body>
    </html>
  )
}
