'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, ChevronDown, ChevronUp } from 'lucide-react'
import { getSiteInfo } from '@/lib/services/dataService'
import { getImageWithFallback } from '@/lib/utils/imageUtils'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isNavExpanded, setIsNavExpanded] = useState(false)
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [headerLogoUrl, setHeaderLogoUrl] = useState('')

  useEffect(() => {
    const fetchHeaderLogoUrl = async () => {
      try {
        const siteInfo = await getSiteInfo()
        // DB에서 헤더 로고 URL이 있으면 사용, 없으면 defaultHeaderLogoUrl 사용
        const logoUrl = getImageWithFallback(siteInfo.headerLogoUrl, siteInfo.defaultHeaderLogoUrl)
        setHeaderLogoUrl(logoUrl)
      } catch (error) {
        console.error('Failed to fetch header logo URL:', error)
        // DB 조회 실패시에도 빈 상태로 유지 (로딩 상태)
        setHeaderLogoUrl('')
      }
    }

    fetchHeaderLogoUrl()
  }, [])

  const navigation = [
    { 
      name: '센터소개', 
      href: '/about',
      submenu: [
        { name: '센터장 소개', href: '/about/director' },
        { name: '센터 발자취', href: '/about/history' },
        { name: '자문위원', href: '/about/advisors' },
        { name: '센터 둘러보기', href: '/about/center-tour' },
        { name: '오시는길', href: '/about/location' },
      ]
    },
    { 
      name: '프로그램', 
      href: '/programs',
      submenu: [
        { name: '치료 프로그램', href: '/programs/therapy' },
        { name: '상담 프로그램', href: '/programs/counseling' },
        { name: '방과후 프로그램', href: '/programs/afterschool' },
        { name: '장애인 스포츠 프로그램', href: '/programs/sports' },
        { name: '성인 주간활동 프로그램', href: '/programs/adult-day' },
      ]
    },
    { 
      name: '전문가 소개', 
      href: '/team',
      submenu: [
        { name: '치료·상담사', href: '/team/therapists' },
        { name: '주간·방과후 교사', href: '/team/teachers' },
      ]
    },
    { 
      name: '커뮤니티', 
      href: '/community',
      submenu: [
        { name: '공지사항', href: '/community/news' },
        { name: 'SNS', href: '/community/sns' },
      ]
    },
    { 
      name: '문의', 
      href: '/contact',
      submenu: [
        { name: '1 : 1 문의', href: '/contact/inquiry' },
      ]
    },
  ]

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-16 pt-2 md:pt-4">
        <div className="relative flex items-center h-14 sm:h-16 md:h-20 lg:h-24 xl:h-28">
          {/* 로고 - 왼쪽 고정 */}
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            {headerLogoUrl ? (
              <img 
                src={headerLogoUrl} 
                alt="위즈포레 로고" 
                className="h-6 sm:h-8 md:h-12 lg:h-16 xl:h-20 w-auto object-contain"
              />
            ) : (
              <div className="h-6 sm:h-8 md:h-12 lg:h-16 xl:h-20 w-20 sm:w-24 md:w-28 lg:w-32 bg-gray-200 animate-pulse rounded"></div>
            )}
          </Link>

          {/* 데스크톱 네비게이션 - 절대적 중앙 배치 */}
          <nav 
            className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2"
            onMouseEnter={() => setIsNavExpanded(true)}
            onMouseLeave={() => setIsNavExpanded(false)}
          >
            <ul className="flex space-x-3 lg:space-x-6 xl:space-x-8">
              {navigation.map((item) => (
                <li key={item.name} className="relative">
                  <div
                    className="block py-3 lg:py-4 text-sm lg:text-base xl:text-lg text-wizfore-text-primary hover:text-wizfore-text-brand font-semibold transition-colors border-b-2 border-transparent hover:border-wizfore-warm-brown cursor-default whitespace-nowrap"
                  >
                    {item.name}
                  </div>
                </li>
              ))}
            </ul>
          </nav>

          {/* 모바일 메뉴 버튼 - 오른쪽 */}
          <button
            className="lg:hidden ml-auto p-2 rounded-md hover:bg-gray-100 transition-colors"
            onClick={() => {
              setIsMenuOpen(!isMenuOpen)
              if (isMenuOpen) {
                setExpandedCategory(null)
              }
            }}
            aria-label="메뉴 토글"
          >
            {isMenuOpen ? <X size={20} className="sm:w-6 sm:h-6" /> : <Menu size={20} className="sm:w-6 sm:h-6" />}
          </button>
        </div>

        {/* 데스크톱 서브메뉴 드롭다운 - 오버레이 형태 */}
        <div 
          className={`hidden lg:block absolute top-full left-0 right-0 z-40 bg-white shadow-lg border-gray-200 transition-all duration-300 overflow-hidden ${
            isNavExpanded 
              ? 'max-h-64 opacity-100 pt-3 pb-6' 
              : 'max-h-0 opacity-0 pt-0 pb-0'
          }`}
          onMouseEnter={() => setIsNavExpanded(true)}
          onMouseLeave={() => setIsNavExpanded(false)}
        >
          <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-16">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-0 justify-items-center">
              {navigation.map((item) => (
                <div key={item.name} className="space-y-1 min-w-0">
                  <h3 className="font-semibold text-wizfore-text-primary text-sm lg:text-base border-b border-wizfore-warm-brown pb-1 lg:pb-2 truncate">
                    {item.name}
                  </h3>
                  {item.submenu && (
                    <ul className="space-y-1 lg:space-y-2">
                      {item.submenu.map((subItem) => (
                        <li key={subItem.name}>
                          <Link
                            href={subItem.href}
                            className="text-xs lg:text-sm xl:text-base text-wizfore-text-secondary hover:text-wizfore-text-brand transition-colors block py-0.5 lg:py-1 truncate"
                            onClick={() => {
                              setIsMenuOpen(false)
                              setIsNavExpanded(false)
                            }}
                          >
                            {subItem.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 모바일 네비게이션 메뉴 */}
        <nav 
          className={`${isMenuOpen ? 'block' : 'hidden'} lg:hidden border-t border-gray-200 transition-all duration-300 bg-white`}
        >
          {/* 모바일 메인 네비게이션 - 상위 카테고리만 */}
          <ul className="flex flex-col py-2 sm:py-4 space-y-1 sm:space-y-2">
            {navigation.map((item) => (
              <li key={item.name} className="relative">
                <button
                  onClick={() => {
                    if (expandedCategory === item.name) {
                      setExpandedCategory(null)
                    } else {
                      setExpandedCategory(item.name)
                    }
                  }}
                  className="w-full flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-wizfore-text-primary hover:text-wizfore-text-brand hover:bg-gray-50 font-medium transition-colors text-left rounded-md mx-2"
                >
                  <span>{item.name}</span>
                  {item.submenu && (
                    expandedCategory === item.name ? 
                      <ChevronUp size={18} className="sm:w-5 sm:h-5" /> : 
                      <ChevronDown size={18} className="sm:w-5 sm:h-5" />
                  )}
                </button>
                
                {/* 하위 메뉴 - 선택된 카테고리만 표시 */}
                {expandedCategory === item.name && item.submenu && (
                  <ul className="bg-gray-50 border-t border-gray-200 mx-2 rounded-b-md overflow-hidden">
                    {item.submenu.map((subItem) => (
                      <li key={subItem.name}>
                        <Link
                          href={subItem.href}
                          className="block px-6 sm:px-8 py-2 text-xs sm:text-sm text-wizfore-text-secondary hover:text-wizfore-text-brand hover:bg-gray-100 transition-colors border-l-2 border-transparent hover:border-wizfore-coral-primary"
                          onClick={() => {
                            setIsMenuOpen(false)
                            setExpandedCategory(null)
                          }}
                        >
                          {subItem.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header
