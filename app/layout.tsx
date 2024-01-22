import './globals.css'
import type { Metadata } from 'next'
import { Noto_Sans_Georgian } from 'next/font/google'
import { db } from '@/lib/db'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from "@/components/ui/sonner";
import { auth } from '@/auth'
const font = Noto_Sans_Georgian({ subsets: ['latin'] })


export const metadata: Metadata = {
  title: 'Collaborator',
  description: 'Organization based Collaboration and Chat',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
    <html lang="en">
      <body className={font.className}>
        <Toaster />
        {children}
      </body>
    </html>
  </SessionProvider>
  )
}
