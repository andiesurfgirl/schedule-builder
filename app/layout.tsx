import { Inter } from 'next/font/google'
import './globals.css'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../lib/auth'
import AuthProvider from './providers/AuthProvider'
import { Inconsolata } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })
const inconsolata = Inconsolata({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inconsolata',
})

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en" className={inconsolata.variable}>
      <body className={inter.className}>
        <AuthProvider session={session}>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}

