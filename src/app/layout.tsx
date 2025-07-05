import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '위즈포레 사회서비스센터',
  description: '아동 발달 지원을 위한 전문적인 치료 및 상담 서비스를 제공하는 위즈포레 사회서비스센터입니다.',
  keywords: ['위즈포레', '사회서비스센터', '언어치료', '인지치료', '아동발달', '심리상담'],
  authors: [{ name: '위즈포레 사회서비스센터' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: '위즈포레 사회서비스센터',
    description: '아동 발달 지원을 위한 전문적인 치료 및 상담 서비스',
    type: 'website',
    locale: 'ko_KR',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
