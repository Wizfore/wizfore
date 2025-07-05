'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Building2, 
  BookOpen, 
  Users, 
  MessageSquare, 
  Settings,
  HelpCircle,
  LogOut,
  BarChart3,
  Database,
  Home,
  Upload
} from 'lucide-react'

const menuItems = [
  {
    title: '대시보드',
    href: '/admin/dashboard',
    icon: LayoutDashboard
  },
  {
    title: '홈페이지 관리',
    href: '/admin/home',
    icon: Home,
    subItems: [
      { title: '히어로 섹션', href: '/admin/home/hero' },
      { title: '프로그램 미리보기', href: '/admin/home/program-preview' },
      { title: '전문가 하이라이트', href: '/admin/home/expert-highlight' },
      { title: '센터 소식', href: '/admin/home/news' },
      { title: '문의 버튼 설정', href: '/admin/home/contact-button' }
    ]
  },
  {
    title: '센터 소개 관리',
    href: '/admin/about',
    icon: Building2,
    subItems: [
      { title: '센터장 소개', href: '/admin/about/director' },
      { title: '센터 발자취', href: '/admin/about/history' },
      { title: '전문 자문위원', href: '/admin/about/advisors' },
      { title: '시설 둘러보기', href: '/admin/about/facilities' },
      { title: '오시는 길', href: '/admin/about/directions' }
    ]
  },
  {
    title: '프로그램 관리',
    href: '/admin/programs',
    icon: BookOpen,
    subItems: [
      { title: '치료 프로그램', href: '/admin/programs/individual' },
      { title: '상담 서비스', href: '/admin/programs/evaluation' },
      { title: '방과후 프로그램', href: '/admin/programs/afterschool' },
      { title: '특수 스포츠 프로그램', href: '/admin/programs/sports' },
      { title: '성인 주간활동', href: '/admin/programs/adult-activities' }
    ]
  },
  {
    title: '전문가 소개 관리',
    href: '/admin/team',
    icon: Users,
    subItems: [
      { title: '치료·상담사', href: '/admin/team/therapists' },
      { title: '주간·방과후 교사', href: '/admin/team/teachers' },
      { title: '직원 현황', href: '/admin/team/staff-status' }
    ]
  },
  {
    title: '커뮤니티 관리',
    href: '/admin/community',
    icon: MessageSquare,
    subItems: [
      { title: '센터 소식(공지사항)', href: '/admin/community/news' },
      { title: 'SNS 소식', href: '/admin/community/sns' },
      { title: '이벤트 관리', href: '/admin/community/events' }
    ]
  },
  {
    title: '1:1 문의 관리',
    href: '/admin/contact',
    icon: HelpCircle,
    subItems: [
      { title: '상담 예약 관리', href: '/admin/contact/reservations' },
      { title: '문의 관리', href: '/admin/contact/inquiries' },
      { title: '문의 통계', href: '/admin/contact/statistics' }
    ]
  },
  {
    title: '사이트 설정',
    href: '/admin/settings',
    icon: Settings,
    subItems: [
      { title: '기관 기본정보', href: '/admin/settings/organization' },
      { title: 'SEO 설정', href: '/admin/settings/seo' },
      { title: '관리자 계정', href: '/admin/settings/accounts' },
      { title: '백업 관리', href: '/admin/settings/backup' }
    ]
  },
  {
    title: '통계 및 분석',
    href: '/admin/analytics',
    icon: BarChart3,
    subItems: [
      { title: '방문자 통계', href: '/admin/analytics/visitors' },
      { title: '프로그램 신청 현황', href: '/admin/analytics/programs' },
      { title: '문의 분석', href: '/admin/analytics/inquiries' }
    ]
  },
  {
    title: '기본 데이터 추가',
    href: '/admin/default-data',
    icon: Upload
  },
  {
    title: '개발자 도구',
    href: '/admin/dev-tools',
    icon: Database
  }
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 z-50">
      {/* 로고 영역 */}
      <div className="p-6 border-b border-gray-200">
        <Link href="/admin/dashboard" className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">위즈포레</h1>
            <p className="text-xs text-gray-500">관리자 페이지</p>
          </div>
        </Link>
      </div>

      {/* 메뉴 영역 */}
      <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-200px)]">
        {menuItems.map((item) => (
          <div key={item.href}>
            <Link
              href={item.href}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === item.href
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.title}</span>
            </Link>
            
            {/* 서브메뉴 */}
            {item.subItems && pathname.startsWith(item.href) && (
              <div className="ml-8 mt-2 space-y-1">
                {item.subItems.map((subItem) => (
                  <Link
                    key={subItem.href}
                    href={subItem.href}
                    className={`block px-3 py-1.5 text-sm rounded-md transition-colors ${
                      pathname === subItem.href
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                    }`}
                  >
                    {subItem.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* 하단 영역 */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            <div>
              <p className="text-sm font-medium text-gray-900">관리자</p>
              <p className="text-xs text-gray-500">admin@wizfore.com</p>
            </div>
          </div>
          <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-50">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}