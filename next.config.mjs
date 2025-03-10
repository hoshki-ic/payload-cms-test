import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'payload-cms-test.vercel.app',
      },
    ],
  },
}

export default withPayload(nextConfig)
