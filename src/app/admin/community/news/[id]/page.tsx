'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Eye, Trash2, X } from 'lucide-react'
import { getArticleById, updateArticle, deleteArticle } from '@/lib/services/dataService'
import { getCategoryOptions } from '@/lib/utils/categoryUtils'
import TiptapEditor from '@/components/admin/community/TiptapEditor'
import NewsDetailMainSection from '@/components/community/news/NewsDetailMainSection'
import type { Article, CategoryItem } from '@/types'

interface EditNewsPageProps {
  params: {
    id: string
  }
}

export default function EditNewsPage({ params }: EditNewsPageProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [notFound, setNotFound] = useState(false)

  // 폼 상태
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState<Article['category']>('news')
  const [status, setStatus] = useState<Article['status']>('draft')
  const [date, setDate] = useState('')

  // 초기 데이터 저장 (변경 감지용)
  const [initialData, setInitialData] = useState({
    title: '',
    content: '',
    category: 'news' as Article['category'],
    status: 'draft' as Article['status'],
    date: ''
  })

  // 카테고리 데이터
  const [categories, setCategories] = useState<CategoryItem[]>([])
  
  // 카테고리 데이터 로딩
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoryOptions = await getCategoryOptions()
        setCategories(categoryOptions)
      } catch (error) {
        console.error('카테고리 로딩 실패:', error)
      }
    }
    loadCategories()
  }, [])

  // 미리보기용 Article 객체 생성
  const previewArticle: Article & { category: string } = {
    id: params.id,
    title: title || '제목을 입력하세요',
    contentHtml: content || '<p>내용을 입력하세요</p>',
    category,
    date,
    status,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  // 뉴스 데이터 로드
  useEffect(() => {
    if (params.id) {
      loadArticle()
    }
  }, [params.id])

  const loadArticle = async () => {
    try {
      setIsLoading(true)
      const article = await getArticleById(params.id)
      
      if (!article) {
        setNotFound(true)
        return
      }

      // 폼 데이터 설정
      setTitle(article.title)
      setContent(article.contentHtml || '')
      setCategory(article.category)
      setStatus(article.status)
      setDate(article.date)

      // 초기 데이터 저장
      setInitialData({
        title: article.title,
        content: article.contentHtml || '',
        category: article.category,
        status: article.status,
        date: article.date
      })
    } catch (error) {
      console.error('뉴스 로드 실패:', error)
      setNotFound(true)
    } finally {
      setIsLoading(false)
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

    setIsSubmitting(true)

    try {
      const updateData: Partial<Omit<Article, 'id' | 'createdAt'>> = {
        title: title.trim(),
        contentHtml: content.trim(),
        category,
        status,
        date: date,
      }

      await updateArticle(params.id, updateData)
      
      console.log('뉴스 업데이트 완료:', params.id)
      router.push('/admin/community')
    } catch (error) {
      console.error('뉴스 업데이트 실패:', error)
      alert('뉴스 업데이트에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // 변경 사항 확인 함수
  const hasChanges = () => {
    return title !== initialData.title ||
           content !== initialData.content ||
           category !== initialData.category ||
           status !== initialData.status ||
           date !== initialData.date
  }

  // 취소 핸들러
  const handleCancel = () => {
    if (hasChanges()) {
      if (confirm('변경 사항이 저장되지 않습니다. 정말 나가시겠습니까?')) {
        router.push('/admin/community')
      }
    } else {
      router.push('/admin/community')
    }
  }

  // 삭제 핸들러
  const handleDelete = async () => {
    if (!confirm('정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      return
    }

    setIsDeleting(true)

    try {
      await deleteArticle(params.id)
      router.push('/admin/community')
    } catch (error) {
      console.error('뉴스 삭제 실패:', error)
      alert('뉴스 삭제에 실패했습니다.')
    } finally {
      setIsDeleting(false)
    }
  }



  // 미리보기 모드 토글
  const togglePreview = () => {
    setPreviewMode(!previewMode)
  }

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">로딩 중...</div>
        </div>
      </div>
    )
  }

  // 404 상태
  if (notFound) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">뉴스를 찾을 수 없습니다</h1>
          <p className="text-gray-600 mb-6">요청하신 뉴스가 삭제되었거나 존재하지 않습니다.</p>
          <button
            onClick={() => router.push('/admin/community')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            뉴스 목록으로 돌아가기
          </button>
        </div>
      </div>
    )
  }

  // 미리보기 모드일 때
  if (previewMode) {
    return (
      <div>
        {/* 미리보기 모드 헤더 */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-gray-900">미리보기</h1>
            </div>
            
            <div className="flex items-center gap-3">
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
            <h1 className="text-xl font-bold text-gray-900">게시글 편집</h1>
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
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Save size={20} />
              {isSubmitting ? '저장 중...' : status === 'published' ? '게시' : '저장'}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              <Trash2 size={20} />
              {isDeleting ? '삭제 중...' : '삭제'}
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
                      {categories.map((cat) => (
                        <option key={cat.english} value={cat.english}>
                          {cat.korean}
                        </option>
                      ))}
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
                  articleId={params.id}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}