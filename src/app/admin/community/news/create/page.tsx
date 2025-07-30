'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Eye, X } from 'lucide-react'
import { createArticleWithReservedId, reserveNextArticleId } from '@/lib/services/dataService'
import { cleanupReservedArticleId } from '@/lib/services/storageService'
import TiptapEditor from '@/components/admin/community/TiptapEditor'
import NewsDetailMainSection from '@/components/community/news/NewsDetailMainSection'
import toast from 'react-hot-toast'
import type { Article, CategoryItem } from '@/types'

export default function CreateNewsPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)

  // 게시글 ID 예약 (새 기사 작성용)
  const [reservedId, setReservedId] = useState<string>('')
  const [isIdReserved, setIsIdReserved] = useState(false)

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

  // 미리보기용 Article 객체 생성
  const previewArticle: Article & { category: string } = {
    id: 'preview',
    title: title || '제목을 입력하세요',
    contentHtml: content || '<p>내용을 입력하세요</p>',
    category,
    date,
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  // ID 예약 (컴포넌트 마운트 시)
  useEffect(() => {
    const reserveId = async () => {
      try {
        const id = await reserveNextArticleId()
        setReservedId(id)
        setIsIdReserved(true)
        console.log(`🎫 게시글 ID 예약 완료: ${id}`)
      } catch (error) {
        console.error('게시글 ID 예약 실패:', error)
        toast.error('게시글 ID 예약에 실패했습니다.')
      }
    }
    
    reserveId()
  }, [])

  // 페이지 이탈 시 Storage 정리
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges() && reservedId) {
        // 변경사항이 있으면 Storage 정리
        cleanupReservedArticleId(reservedId).catch(console.error)
      }
    }

    const handlePopState = () => {
      if (hasChanges() && reservedId) {
        cleanupReservedArticleId(reservedId).catch(console.error)
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('popstate', handlePopState)
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('popstate', handlePopState)
    }
  }, [reservedId])

  // 변경 사항 확인 함수 (빈 값에서 변경되었는지 확인)
  const hasChanges = () => {
    return title.trim() !== '' || 
           content.trim() !== '' || 
           category !== 'news' || 
           status !== 'draft' || 
           date !== new Date().toISOString().split('T')[0]
  }

  // 취소 핸들러
  const handleCancel = async () => {
    if (hasChanges()) {
      if (confirm('작성 중인 내용이 저장되지 않습니다. 정말 나가시겠습니까?')) {
        // Storage 정리 후 페이지 이동
        if (reservedId) {
          await cleanupReservedArticleId(reservedId)
        }
        router.push('/admin/community/news')
      }
    } else {
      // 변경사항이 없어도 예약된 ID 정리
      if (reservedId) {
        await cleanupReservedArticleId(reservedId)
      }
      router.push('/admin/community/news')
    }
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

    if (!reservedId) {
      toast.error('게시글 ID가 예약되지 않았습니다. 페이지를 새로고침해주세요.')
      return
    }

    setIsSubmitting(true)

    try {
      const articleData: Omit<Article, 'id' | 'createdAt' | 'updatedAt' | 'publishedAt'> = {
        title: title.trim(),
        contentHtml: content.trim(),
        category,
        status,
        date: date,
      }

      console.log(`📝 예약된 ID로 기사 생성 시작: ${reservedId}`)
      await createArticleWithReservedId(articleData, reservedId)
      
      console.log(`🎉 게시글 생성 완료: ${reservedId}`)
      toast.success('게시글이 성공적으로 생성되었습니다!')
      
      // 페이지 이동
      setTimeout(() => {
        router.push('/admin/community/news')
      }, 1000)
    } catch (error) {
      console.error('💥 게시글 생성 실패:', error)
      toast.error('게시글 생성에 실패했습니다.')
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
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              <X size={20} />
              취소
            </button>
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
          article={previewArticle} 
          categories={categories}
          showBackButton={false}
        />
      </div>
    )
  }

  // 편집 모드일 때
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* 상단 헤더 */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-50"
            >
              <ArrowLeft size={20} />
              돌아가기
            </button>
            <h1 className="text-xl font-bold text-gray-900">게시글 작성</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              <X size={20} />
              취소
            </button>
            <button
              type="button"
              onClick={togglePreview}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              <Eye size={20} />
              미리보기
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !isIdReserved}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Save size={20} />
              {!isIdReserved 
                ? `ID 예약 중... (${reservedId || '대기'})` 
                : isSubmitting 
                  ? `저장 중... (ID: ${reservedId})` 
                  : status === 'published' 
                    ? `게시 (ID: ${reservedId})` 
                    : `저장 (ID: ${reservedId})`
              }
            </button>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div className="flex-1">
        <form onSubmit={handleSubmit} className="flex flex-col">
          {/* 상단 메타데이터 영역 */}
          <div className="bg-white border-b border-gray-200 p-6 flex-shrink-0">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* 제목 입력 */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  제목 *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                  placeholder="제목을 입력하세요"
                  required
                />
              </div>

              {/* 발행 설정 */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  발행 설정
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as Article['status'])}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="draft">임시저장</option>
                      <option value="published">게시됨</option>
                    </select>
                  </div>
                  <div>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as Article['category'])}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tiptap 에디터 영역 */}
          <div className="bg-white p-6 max-w-full min-w-0">
            <div className="flex flex-col max-w-full min-w-0">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                내용 *
              </label>
              <div className="w-full max-w-full min-w-0 overflow-hidden">
                <TiptapEditor
                  value={content}
                  onChange={setContent}
                  category={category}
                  articleId={reservedId || undefined}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}