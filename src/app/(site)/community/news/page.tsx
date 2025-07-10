'use client'

import { useState, useEffect } from 'react'
import { getCommunity } from '@/lib/services/dataService'
import CommonHeroSection from '@/components/layout/CommonHeroSection'
import NewsContentSection from '@/components/community/news/NewsContentSection'
import { getAllNewsWithCategory, getNewsByCategory, separateNoticeAndNews, getEnglishCategory } from '@/lib/utils/newsUtils'
import type { NewsItem, CategoryItem } from '@/types'

export default function NewsPage() {
  const [newsData, setNewsData] = useState<Record<string, NewsItem[]>>({})
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [newsMessages, setNewsMessages] = useState<{
    hero?: { title?: string; description?: string; imageUrl?: string }
    aboutMessage?: { title?: string; description?: string }
  }>({})
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const itemsPerPage = 10 // 페이지당 아이템 수

  useEffect(() => {
    const fetchCommunityData = async () => {
      try {
        setLoading(true)
        const communityData = await getCommunity()
        setNewsData(communityData.news.articles || {})
        setCategories(communityData.news.categories || [])
        setNewsMessages({
          hero: communityData.news.hero,
          aboutMessage: communityData.news.aboutMessage
        })
      } catch (err) {
        console.error('Error fetching community data:', err)
        setError('뉴스 데이터를 불러오는데 실패했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchCommunityData()
  }, [])
  
  // 필터링된 뉴스
  const filteredNews = selectedCategory === 'all' 
    ? getAllNewsWithCategory(newsData) 
    : getNewsByCategory(newsData, selectedCategory)

  // 페이지네이션 계산 (공지사항 제외)
  const { noticeItems, regularNews } = separateNoticeAndNews(newsData)
  const paginationTargetNews = selectedCategory === 'all' ? regularNews : filteredNews
  const totalPages = Math.ceil(paginationTargetNews.length / itemsPerPage)
  
  // 전체 뉴스 개수 (카테고리 필터 수치에 사용)
  const allNews = getAllNewsWithCategory(newsData)

  // 카테고리 변경 핸들러 (페이지를 1로 리셋)
  const handleCategoryChange = (categoryEnglish: string) => {
    setSelectedCategory(categoryEnglish)
    setCurrentPage(1)
  }

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // 연도별 그룹화 (기존 로직 유지)
  const newsByYear = filteredNews.reduce((acc, item) => {
    const year = item.date.substring(0, 4)
    if (!acc[year]) {
      acc[year] = []
    }
    acc[year].push(item)
    return acc
  }, {} as Record<string, typeof filteredNews>)

  const years = Object.keys(newsByYear).sort((a, b) => parseInt(b) - parseInt(a))

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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-wizfore-warm-brown text-white rounded hover:bg-wizfore-warm-brown/90"
          >
            다시 시도
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeroSection 
        title={newsMessages.hero?.title || "뉴스"}
        description={newsMessages.hero?.description || "상시와 사회서비스센터의 다양한 소식을 만나보세요"}
        backgroundImage={newsMessages.hero?.imageUrl}
      />
      <NewsContentSection 
        aboutMessage={newsMessages.aboutMessage}
        newsData={newsData}
        allNews={allNews}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        filteredNews={filteredNews}
        newsByYear={newsByYear}
        years={years}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        itemsPerPage={itemsPerPage}
      />
    </div>
  )
}