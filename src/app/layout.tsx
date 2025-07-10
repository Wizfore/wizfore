import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { getSiteInfo } from '@/lib/services/dataService'
import { defaultSiteData } from '@/lib/data/defaultSiteData'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export async function generateMetadata(): Promise<Metadata> {
  let siteName = defaultSiteData.siteInfo.name // 기본값: "위즈포레"
  let faviconUrl = '/icons/logo.png' // 기본 파비콘
  
  try {
    const siteInfo = await getSiteInfo()
    siteName = siteInfo.name || siteName
    // DB에서 파비콘 URL이 있고 빈 문자열이 아니면 사용, 그렇지 않으면 기본값 사용
    faviconUrl = (siteInfo.faviconUrl && siteInfo.faviconUrl.trim() !== '') 
      ? siteInfo.faviconUrl 
      : '/icons/logo.png'
  } catch (error) {
    console.error('Failed to fetch site info for metadata:', error)
    // 기본값 사용
  }

  return {
    title: siteName,
    description: `아동 발달 지원을 위한 전문적인 치료 및 상담 서비스를 제공하는 ${siteName}입니다.`,
    keywords: [siteName, '사회서비스센터', '언어치료', '인지치료', '아동발달', '심리상담'],
    authors: [{ name: siteName }],
    viewport: 'width=device-width, initial-scale=1',
    robots: 'index, follow',
    icons: {
      icon: faviconUrl,
      shortcut: faviconUrl,
      apple: faviconUrl,
    },
    openGraph: {
      title: siteName,
      description: '아동 발달 지원을 위한 전문적인 치료 및 상담 서비스',
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
