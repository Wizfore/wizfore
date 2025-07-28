import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { getSiteInfo } from '@/lib/services/dataService'

const inter = Inter({ subsets: ['latin'] })

export async function generateMetadata(): Promise<Metadata> {
  let siteInfo
  try {
    siteInfo = await getSiteInfo()
  } catch (error) {
    console.error('Failed to fetch site info for metadata:', error)
    // DB 조회 실패 시 기본값 사용
    siteInfo = {
      name: '위즈포레',
      enName: 'Wizfore',
      faviconUrl: '',
      defaultFaviconUrl: '/icons/favicon.png'
    }
  }

  const faviconUrl = (siteInfo.faviconUrl && siteInfo.faviconUrl.trim() !== '') 
    ? siteInfo.faviconUrl 
    : siteInfo.defaultFaviconUrl

  return {
    title: `${siteInfo.enName} - ${siteInfo.name}`,
    description: '아동 발달 지원을 위한 전문적인 치료 및 상담 서비스를 제공하는 위즈포레 사회서비스센터입니다.',
    keywords: ['위즈포레', '사회서비스센터', '언어치료', '인지치료', '아동발달', '심리상담'],
    authors: [{ name: `${siteInfo.name} 사회서비스센터` }],
    viewport: 'width=device-width, initial-scale=1',
    robots: 'index, follow',
    icons: {
      icon: faviconUrl,
      shortcut: faviconUrl,
      apple: faviconUrl,
    },
    openGraph: {
      title: `${siteInfo.enName} - ${siteInfo.name} 사회서비스센터`,
      description: '아동 발달 지원을 위한 전문적인 치료 및 상담 서비스를 제공하는 위즈포레 사회서비스센터입니다.',
      type: 'website',
      locale: 'ko_KR',
    },
  }
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
