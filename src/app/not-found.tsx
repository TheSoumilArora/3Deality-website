'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NotFound() {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    console.error(`🚨 404 — User tried to access: ${pathname}`)
    // you could also send this into your analytics/logging service here
  }, [pathname])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">Oops! Page not found.</p>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => router.push('/')}
        >
          Return to Home
        </button>
      </div>
    </div>
  )
}