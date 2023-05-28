"use client";

import './globals.css'
import { SessionProvider } from "next-auth/react"
import Header from './header'

export default function RootLayout({ children, session }) {
  return (
    <html lang="en" className='h-full scroll-smooth antialiased'>
      <body className="flex h-full flex-col">
        <SessionProvider session={session}>
          <Header />
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
