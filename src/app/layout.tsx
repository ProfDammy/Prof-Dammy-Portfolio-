
import type { Metadata } from 'next'
import './globals.css'
import { CustomizerProvider } from '@/context/CustomizerContext'

export const metadata: Metadata = {
  title: 'Damilola Oluwagbamila | Portfolio',
  description: 'Official portfolio of Damilola Oluwagbamila.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="font-sans antialiased">
        <CustomizerProvider>
          {children}
        </CustomizerProvider>
      </body>
    </html>
  )
}
