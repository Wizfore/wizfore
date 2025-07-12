'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Eye } from 'lucide-react'
import { Article } from '@/types/community'
import { createArticle } from '@/lib/services/dataService'
import NewsMarkdownEditor from '@/components/admin/community/NewsMarkdownEditor'
import NewsDetailMainSection from '@/components/community/news/NewsDetailMainSection'
import type { NewsItem, CategoryItem } from '@/types'

export default function CreateNewsPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)

  // 폼 상태
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState<Article['category']>('news')
  const [status, setStatus] = useState<Article['status']>('draft')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  // 카테고리 데이터
  const categories: CategoryItem[] = [
    { english: 'notices', korean: '공지사항' },
    { english: 'partnership', korean: '협약' },
    { english: 'news', korean: '소식' },
    { english: 'events', korean: '행사' },
    { english: 'awards', korean: '수상' }
  ]

  // 미리보기용 NewsItem 객체 생성
  const previewNewsItem: NewsItem & { category: string } = {
    id: 'preview',
    title: title || '제목을 입력하세요',
    contentMarkdown: content || '내용을 입력하세요',
    category,
    date,
    images: [],
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }



  // 폼 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.')
      return
    }

    if (!category) {
      alert('카테고리를 선택해주세요.')
      return
    }

    setIsSubmitting(true)

    try {
      const articleData: Omit<Article, 'id' | 'createdAt' | 'updatedAt' | 'publishedAt'> = {
        title: title.trim(),
        contentMarkdown: content.trim(),
        category,
        status,
        images: [],
        date: date,
      }

      const articleId = await createArticle(articleData)
      
      console.log('기사 생성 완료:', articleId)
      router.push('/admin/community/news')
    } catch (error) {
      console.error('기사 생성 실패:', error)
      alert('기사 생성에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  

  // 미리보기 모드 토글
  const togglePreview = () => {
    setPreviewMode(!previewMode)
  }

  // 미리보기 모드일 때
  if (previewMode) {
    return (
      <div>
        {/* 미리보기 모드 헤더 */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft size={20} />
                돌아가기
              </button>
              <h1 className="text-xl font-bold text-gray-900">미리보기</h1>
            </div>
            
            <button
              type="button"
              onClick={togglePreview}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Eye size={20} />
              편집 모드
            </button>
          </div>
        </div>
        
        {/* 미리보기 컨텐츠 */}
        <NewsDetailMainSection 
          newsItem={previewNewsItem} 
          categories={categories}
          showBackButton={false}
        />
      </div>
    )
  }

  // 편집 모드일 때
  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft size={20} />
            돌아가기
          </button>
          <h1 className="text-2xl font-bold text-gray-900">뉴스 작성</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={togglePreview}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            <Eye size={20} />
            미리보기
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 기본 정보 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 메인 콘텐츠 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 제목 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                제목 *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="제목을 입력하세요"
                required
              />
            </div>

            {/* 마크다운 에디터 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                내용 *
              </label>
              <NewsMarkdownEditor
                value={content}
                onChange={setContent}
                placeholder="내용을 마크다운 형식으로 작성하세요..."
                height={500}
              />
            </div>
          </div>

          {/* 사이드바 */}
          <div className="space-y-6">
            {/* 발행 설정 */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">발행 설정</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    상태
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as Article['status'])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="draft">초안</option>
                    <option value="published">게시됨</option>
                    <option value="archived">보관됨</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    카테고리 *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Article['category'])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="notices">공지사항</option>
                    <option value="partnership">협약</option>
                    <option value="news">소식</option>
                    <option value="events">행사</option>
                    <option value="awards">수상</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    발행일 *
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

              </div>
            </div>


          </div>
        </div>

        {/* 제출 버튼 */}
        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? '저장 중...' : status === 'published' ? '게시' : '저장'}
          </button>
        </div>
      </form>
    </div>
  )
}