import React from 'react'
import './styles.css'

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav className="bg-gray-800 text-white p-4">
          <div className="container mx-auto">
            <ul className="flex gap-4">
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/posts">Blog Posts</a>
              </li>
            </ul>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  )
}
