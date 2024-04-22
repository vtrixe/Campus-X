import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/auth'
import './globals.css'
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from '@/components/providers/theme-provider'
import { Dialogs } from '@/components/providers/dialogs'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Collaborator',
  description: 'Campus-X',
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
        <body className={inter.className}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            storageKey="stream">
                        <Dialogs />
          <Toaster />
          {children}
          </ThemeProvider>
        </body>
      </html>
    </SessionProvider>
  )
}
