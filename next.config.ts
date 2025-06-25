// next.config.ts
import path from 'path'
import type { NextConfig } from 'next'
import type { Configuration } from 'webpack'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },

  webpack: (config: Configuration): Configuration => {
    // 👇 ensure resolve/alias objects exist
    config.resolve = config.resolve || {}
    config.resolve.alias = {
      // spread any existing aliases (cast them so TS lets us)
      ...(config.resolve.alias as Record<string, string>),
      // add our "@" → "src" shortcut
      '@': path.resolve(__dirname, 'src'),
    }

    return config
  },

  images: { unoptimized: true },

  async rewrites() {
    return [
      // anything under /store/* goes to your Medusa backend
      {
        source: '/store/:path*',
        destination: `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/:path*`,
      },
      
      {
        source: '/store',
        destination: `/index.html`,
      },

      {
        source: '/app/:path*',
        destination: `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/app/:path*`,
      },

      {
        source: '/auth/:path*',
        destination: `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/auth/:path*`,
      },

      {
        source: '/(.*)',
        destination: `/index.html`,
      },
    ]
  },
}

export default nextConfig