'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
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
  Upload,
  User,
  Loader2
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { logout } from '@/lib/services/authService'

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
      { title: '센터 소식(뉴스)', href: '/admin/community/news' },
      { title: 'SNS 관리', href: '/admin/community/sns' }
    ]
  },
  {
    title: '1:1 문의 관리',
    href: '/admin/contact/inquiries',
    icon: HelpCircle
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
  const router = useRouter()
  const { userProfile } = useAuth()
  const [logoutLoading, setLogoutLoading] = useState(false)

  const handleLogout = async () => {
    try {
      setLogoutLoading(true)
      await logout()
      router.push('/admin/login')
    } catch (error) {
      console.error('로그아웃 오류:', error)
      alert('로그아웃 중 오류가 발생했습니다.')
    } finally {
      setLogoutLoading(false)
    }
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin': return '관리자'
      case 'staff': return '직원'
      case 'viewer': return '조회자'
      default: return '사용자'
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800'
      case 'staff': return 'bg-blue-100 text-blue-800'
      case 'viewer': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

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

      {/* 하단 영역 - 사용자 정보 */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-white">
        <div className="p-4">
          {/* 사용자 정보 */}
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                {userProfile?.displayName || '사용자'}
                <span className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1 ${getRoleBadgeColor(userProfile?.role || '')}`}>
                  {getRoleText(userProfile?.role || '')}
                </span>
              </p>
              
              <p className="text-xs text-gray-500">{userProfile?.email}</p>
              
            </div>
          </div>
          
          {/* 로그아웃 버튼 */}
          <button
            onClick={handleLogout}
            disabled={logoutLoading}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-sm text-red-700 hover:bg-red-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {logoutLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <LogOut className="w-4 h-4" />
            )}
            <span>{logoutLoading ? '로그아웃 중...' : '로그아웃'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}