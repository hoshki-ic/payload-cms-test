import React from 'react'
import { fileURLToPath } from 'url'
import Link from 'next/link'
import config from '@/payload.config'
import './styles.css'

export default async function HomePage() {
  const payloadConfig = await config

  const fileURL = `vscode://file/${fileURLToPath(import.meta.url)}`

  return (
    <div className="home">
      <div className="content">
        <p>Checkout the posts below</p>
        <div className="posts">
          <Link href="/posts">Posts</Link>
        </div>
        <div className="links">
          <Link
            className="admin"
            href={payloadConfig.routes.admin}
            rel="noopener noreferrer"
            target="_blank"
          >
            Go to admin panel
          </Link>
          <Link
            className="docs"
            href="https://payloadcms.com/docs"
            rel="noopener noreferrer"
            target="_blank"
          >
            Documentation
          </Link>
        </div>
      </div>
      <div className="footer">
        <p>Update this page by editing</p>
        <Link className="codeLink" href={fileURL}>
          <code>app/(frontend)/page.tsx</code>
        </Link>
      </div>
    </div>
  )
}
