import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/app/context/AuthContext'
import { CrimesProvider } from '@/app/context/CrimesContext'
import { ReportsProvider } from '@/app/context/ReportsContext'
import { CaseStudiesProvider } from '@/app/context/CaseStudiesContext'
import { NewsletterProvider } from '@/app/context/NewsletterContext'
import { CrimeReportsProvider } from '@/app/context/CrimeReportsContext'
import { NotificationsProvider } from '@/app/context/NotificationsContext'
import { OrganizationsProvider } from '@/app/context/OrganizationsContext'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'ConfideU - Secure Whistleblower Reporting Platform',
  description: 'Safely report misconduct, corruption, and fraud with complete anonymity and encrypted evidence storage',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans antialiased bg-background text-foreground`}>
        <AuthProvider>
          <CrimesProvider>
            <ReportsProvider>
              <CaseStudiesProvider>
                <NewsletterProvider>
                  <CrimeReportsProvider>
                    <NotificationsProvider>
                      <OrganizationsProvider>
                        {children}
                      </OrganizationsProvider>
                    </NotificationsProvider>
                  </CrimeReportsProvider>
                </NewsletterProvider>
              </CaseStudiesProvider>
            </ReportsProvider>
          </CrimesProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
