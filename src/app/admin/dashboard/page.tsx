'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  FileText,
  Loader2,
  Settings,
  Home,
  Building,
  BookOpen,
  Users,
  MessageSquare,
  Mail
} from 'lucide-react'
import { 
  getRecentInquiries, 
  getRecentNews,
  type RecentInquiry,
  type RecentNews
} from '@/lib/services/dashboardService'

const adminMenus = [
  {
    title: '사이트 설정',
    description: '기본 설정 및 사이트 정보',
    icon: Settings,
    href: '/admin/settings',
    color: 'bg-gray-500 hover:bg-gray-600'
  },
  {
    title: '홈페이지 관리',
    description: '메인 페이지 콘텐츠 관리',
    icon: Home,
    href: '/admin/home',
    color: 'bg-blue-500 hover:bg-blue-600'
  },
  {
    title: '센터소개 관리',
    description: '센터 정보 및 소개 관리',
    icon: Building,
    href: '/admin/about',
    color: 'bg-green-500 hover:bg-green-600'
  },
  {
    title: '프로그램 관리',
    description: '치료 및 교육 프로그램',
    icon: BookOpen,
    href: '/admin/programs',
    color: 'bg-purple-500 hover:bg-purple-600'
  },
  {
    title: '전문가 소개 관리',
    description: '치료사 및 전문가 정보',
    icon: Users,
    href: '/admin/about', // 팀 관리 페이지로 수정 필요시
    color: 'bg-orange-500 hover:bg-orange-600'
  },
  {
    title: '커뮤니티 관리',
    description: '게시글 및 소식 관리',
    icon: MessageSquare,
    href: '/admin/community',
    color: 'bg-pink-500 hover:bg-pink-600'
  },
  {
    title: '1:1 문의 관리',
    description: '고객 문의 및 상담 관리',
    icon: Mail,
    href: '/admin/contact/inquiries',
    color: 'bg-indigo-500 hover:bg-indigo-600'
  }
]

export default function DashboardPage() {
  const [recentInquiries, setRecentInquiries] = useState<RecentInquiry[]>([])
  const [recentNews, setRecentNews] = useState<RecentNews[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true)
        setError(null)

        // 병렬로 데이터 로드
        const [inquiriesData, newsData] = await Promise.all([
          getRecentInquiries(3),
          getRecentNews(2)
        ])

        setRecentInquiries(inquiriesData)
        setRecentNews(newsData)
      } catch (err) {
        console.error('대시보드 데이터 로드 오류:', err)
        setError('데이터를 불러오는 중 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>데이터를 불러오는 중...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-500 rounded-full"></div>
          <span className="text-red-700">{error}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
        <p className="text-gray-600">한눈에 확인하세요</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 최근 문의 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">최근 문의</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              전체 보기
            </button>
          </div>
          <div className="space-y-4">
            {recentInquiries.length > 0 ? (
              recentInquiries.map((inquiry) => (
                <div key={inquiry.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      inquiry.status === 'resolved' ? 'bg-green-500' : 'bg-red-500' 
                    }`}></div>
                    <div>
                      <p className="font-medium text-gray-900">{inquiry.name}</p>
                      <p className="text-sm text-gray-600">{inquiry.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{inquiry.time}</p>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      inquiry.status === 'resolved' 
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700' 
                    }`}>
                      {inquiry.status === 'unread' ? '미답변' : inquiry.status === 'replied' ? '처리중' : '답변완료'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                최근 문의가 없습니다.
              </div>
            )}
          </div>
        </div>

        {/* 최근 게시글 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">최근 게시글</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              전체 보기
            </button>
          </div>
          <div className="space-y-4">
            {recentNews.length > 0 ? (
              recentNews.map((news) => (
                <div key={news.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">{news.title}</p>
                      <p className="text-sm text-gray-600">{news.publishDate}</p>
                    </div>
                  </div>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    news.status === 'published' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {news.status === 'published' ? '발행됨' : '임시저장'}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                최근 게시글이 없습니다.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 관리 메뉴 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">관리 메뉴</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {adminMenus.map((menu, index) => {
            const IconComponent = menu.icon
            return (
              <Link
                key={index}
                href={menu.href}
                className="group flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:shadow-md hover:border-gray-300 transition-all duration-200"
              >
                <div className={`${menu.color} w-12 h-12 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-medium text-gray-900 text-center text-sm">{menu.title}</h3>
                <p className="text-xs text-gray-500 text-center mt-1">{menu.description}</p>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}