'use client'

import { useState, useEffect } from 'react'
import { 
  FileText,
  Plus,
  Edit,
  Eye,
  Loader2
} from 'lucide-react'
import { 
  getRecentInquiries, 
  getRecentNews,
  type RecentInquiry,
  type RecentNews
} from '@/lib/services/dashboardService'

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


    </div>
  )
}