'use client'

import { useState, useEffect } from 'react'
import { 
  Users, 
  MessageSquare, 
  BookOpen, 
  TrendingUp,
  FileText,
  Calendar,
  Clock,
  CheckCircle,
  Plus,
  Edit,
  Eye,
  Loader2
} from 'lucide-react'
import { 
  getDashboardStats, 
  getRecentInquiries, 
  getRecentNews,
  type DashboardStats,
  type RecentInquiry,
  type RecentNews
} from '@/lib/services/dashboardService'

const quickActions = [
  {
    title: '새 프로그램 추가',
    icon: Plus,
    href: '/admin/programs/new',
    color: 'bg-blue-500 hover:bg-blue-600'
  },
  {
    title: '문의 관리',
    icon: MessageSquare,
    href: '/admin/contact/inquiries',
    color: 'bg-green-500 hover:bg-green-600'
  },
  {
    title: '소식 작성하기',
    icon: Edit,
    href: '/admin/content/news/new',
    color: 'bg-purple-500 hover:bg-purple-600'
  },
  {
    title: '사이트 보기',
    icon: Eye,
    href: '/',
    color: 'bg-gray-500 hover:bg-gray-600'
  }
]

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentInquiries, setRecentInquiries] = useState<RecentInquiry[]>([])
  const [recentNews, setRecentNews] = useState<RecentNews[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true)
        setError(null)

        // 병렬로 모든 데이터 로드
        const [statsData, inquiriesData, newsData] = await Promise.all([
          getDashboardStats(),
          getRecentInquiries(3),
          getRecentNews(2)
        ])

        setStats(statsData)
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

  const statsCards = [
    {
      title: '전체 프로그램',
      value: stats?.totalPrograms.toString() || '0',
      change: stats?.programsChange || '0',
      changeType: 'increase',
      icon: BookOpen,
      color: 'bg-blue-500'
    },
    {
      title: '등록된 전문가',
      value: stats?.totalTherapists.toString() || '0',
      change: stats?.therapistsChange || '0',
      changeType: 'increase',
      icon: Users,
      color: 'bg-green-500'
    },
    {
      title: '미답변 문의',
      value: stats?.unreadInquiries.toString() || '0',
      change: stats?.inquiriesChange || '0',
      changeType: 'decrease',
      icon: MessageSquare,
      color: 'bg-yellow-500'
    },
    {
      title: '이번 달 방문자',
      value: stats?.monthlyVisitors.toLocaleString() || '0',
      change: stats?.visitorsChange || '0%',
      changeType: 'increase',
      icon: TrendingUp,
      color: 'bg-purple-500'
    }
  ]

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
        <p className="text-gray-600">한눈에 확인하세요</p>
      </div>

      {/* 통계 카드들 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const IconComponent = stat.icon
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <span className={`text-sm font-medium ${
                      stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">지난달 대비</span>
                  </div>
                </div>
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          )
        })}
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

        {/* 최근 소식 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">최근 소식</h2>
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
                최근 소식이 없습니다.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 빠른 작업 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">빠른 작업</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const IconComponent = action.icon
            return (
              <button
                key={index}
                onClick={() => window.open(action.href, action.href.startsWith('/admin') ? '_self' : '_blank')}
                className={`flex flex-col items-center p-4 border border-gray-200 rounded-lg transition-colors ${action.color} text-white hover:shadow-md`}
              >
                <IconComponent className="w-6 h-6 mb-2" />
                <span className="text-sm font-medium">{action.title}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 오늘의 할일 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">오늘의 할일</h2>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-gray-900 line-through">김○○님 문의 답변 완료</span>
          </div>
          <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
            <Clock className="w-5 h-5 text-yellow-500" />
            <span className="text-gray-900">이○○님 상담 예약 확인</span>
          </div>
          <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
            <Calendar className="w-5 h-5 text-blue-500" />
            <span className="text-gray-900">7월 프로그램 일정 업데이트</span>
          </div>
        </div>
      </div>
    </div>
  )
}