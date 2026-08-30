import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Cairo } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/app/context/AuthContext' // عدل المسار حسب مكان الملف عندك

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
})

export const metadata: Metadata = {
  title: 'لقيناهو - نبحث معاً.. لنجدهم',
  description:
    'منصة سودانية تساعد في البحث عن الأشخاص المفقودين والعثور عليهم',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0b1329',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} dark`} style={{ colorScheme: 'dark' }}>
      <body className="font-sans antialiased bg-background text-foreground min-h-screen">
        <AuthProvider>
          {children}
        </AuthProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}