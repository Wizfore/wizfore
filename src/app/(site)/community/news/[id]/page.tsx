'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getCommunity } from '@/lib/services/dataService'
import { findNewsByGlobalId } from '@/lib/utils/newsUtils'
import NewsHeroSection from '@/components/community/news/NewsHeroSection'
import NewsDetailMainSection from '@/components/community/news/NewsDetailMainSection'
import NewsDetailNavigationSection from '@/components/community/news/NewsDetailNavigationSection'
import type { NewsItem, CategoryItem } from '@/types'

export default function NewsDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { id } = params
  
  const [newsItem, setNewsItem] = useState<(NewsItem & { category: string }) | null>(null)
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [newsMessages, setNewsMessages] = useState<{
    heroMessage?: { title?: string; description?: string }
    aboutMessage?: { title?: string; description?: string }
  }>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        setLoading(true)
        const communityData = await getCommunity()
        const foundNews = findNewsByGlobalId(communityData.news.articles, id as string)
        
        if (foundNews) {
          setNewsItem(foundNews)
          setCategories(communityData.news.categories || [])
          setNewsMessages({
            heroMessage: communityData.news.heroMessage,
            aboutMessage: communityData.news.aboutMessage
          })
        } else {
          setError('뉴스를 찾을 수 없습니다.')
        }
      } catch (err) {
        console.error('Error fetching news detail:', err)
        setError('뉴스를 불러오는데 실패했습니다.')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchNewsDetail()
    }
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wizfore-warm-brown mx-auto mb-4"></div>
          <p className="text-wizfore-text-secondary">뉴스를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (error || !newsItem) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || '뉴스를 찾을 수 없습니다.'}</p>
          <button 
            onClick={() => router.push('/community/news')} 
            className="px-4 py-2 bg-wizfore-warm-brown text-white rounded hover:bg-wizfore-warm-brown/90 transition-colors"
          >
            목록으로 돌아가기
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NewsHeroSection heroMessage={newsMessages.heroMessage} />
      <NewsDetailMainSection 
        newsItem={newsItem}
        categories={categories}
      />
      <NewsDetailNavigationSection />
    </div>
  )
}