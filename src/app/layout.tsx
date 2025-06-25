import type { Metadata } from 'next'
 
export const metadata: Metadata = {
  title: '3Deality',
  description: 'Turning 3D Imagination into Reality',
  applicationName: '3Deality',
  keywords: ['3D', 'Imagination', 'Reality', '3Deality'],
  creator: 'Soumil Arora',
  icons: {
    icon: '/public/favicon.png',
    apple: '/public/favicon.png',
    other: [{rel: 'icon', url: '/favicon.png',},],
    },
    openGraph: {
    title: '3Deality',
    description: 'Turning 3D Imagination into Reality',
    url: 'https://3deality.in',
    siteName: '3Deality',
    locale: 'en_US',
    type: 'website',
  },
}

 export default function RootLayout(
    {
  children,
}: {
  children: React.ReactNode
})

{
  return (
    <html lang="en">
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  )
}