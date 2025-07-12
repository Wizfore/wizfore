'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Eye, X, Trash2 } from 'lucide-react'
import { Article } from '@/types/community'
import { getArticleById, updateArticle, deleteArticle } from '@/lib/services/dataService'
import { useImageUpload } from '@/lib/services/storageService'
import NewsMarkdownEditor from '@/components/admin/community/NewsMarkdownEditor'

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
  const { upload: uploadImage, uploading: imageUploading } = useImageUpload('news')

  // 폼 상태
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState<Article['category']>('news')
  const [status, setStatus] = useState<Article['status']>('draft')
  const [featured, setFeatured] = useState(false)
  const [images, setImages] = useState<string[]>([])

  // 뉴스 데이터 로드
  useEffect(() => {
    if (params.id) {
      loadNewsItem()
    }
  }, [params.id])

  const loadNewsItem = async () => {
    try {
      setIsLoading(true)
      const newsItem = await getArticleById(params.id)
      
      if (!newsItem) {
        setNotFound(true)
        return
      }

      // 폼 데이터 설정
      setTitle(newsItem.title)
      setContent(newsItem.contentMarkdown)
      setCategory(newsItem.category)
      setStatus(newsItem.status)
      setFeatured(newsItem.featured)
      setImages(newsItem.images || [])
    } catch (error) {
      console.error('뉴스 로드 실패:', error)
      setNotFound(true)
    } finally {
      setIsLoading(false)
    }
  }

  // 이미지 업로드 핸들러
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const url = await uploadImage(file)
      setImages([...images, url])
    } catch (error) {
      console.error('이미지 업로드 실패:', error)
      alert('이미지 업로드에 실패했습니다.')
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
        contentMarkdown: content.trim(),
        category,
        status,
        featured,
        images: images.length > 0 ? images : [],
      }

      await updateArticle(params.id, updateData)
      
      console.log('뉴스 업데이트 완료:', params.id)
      router.push('/admin/community/news')
    } catch (error) {
      console.error('뉴스 업데이트 실패:', error)
      alert('뉴스 업데이트에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
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
      router.push('/admin/community/news')
    } catch (error) {
      console.error('뉴스 삭제 실패:', error)
      alert('뉴스 삭제에 실패했습니다.')
    } finally {
      setIsDeleting(false)
    }
  }

  // 임시 저장
  const handleSaveDraft = async () => {
    if (!title.trim()) {
      alert('제목을 입력해주세요.')
      return
    }

    const originalStatus = status
    setStatus('draft')
    
    try {
      await handleSubmit(new Event('submit') as any)
    } catch (error) {
      setStatus(originalStatus)
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
            onClick={() => router.push('/admin/community/news')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            뉴스 목록으로 돌아가기
          </button>
        </div>
      </div>
    )
  }

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
          <h1 className="text-2xl font-bold text-gray-900">뉴스 편집</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={togglePreview}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            <Eye size={20} />
            {previewMode ? '편집 모드' : '미리보기'}
          </button>
          
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
          >
            <Save size={20} />
            임시 저장
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
                placeholder="뉴스 제목을 입력하세요"
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
                placeholder="뉴스 내용을 마크다운으로 작성하세요..."
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

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                    중요 뉴스로 표시
                  </label>
                </div>
              </div>
            </div>

            {/* 이미지 업로드 */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">대표 이미지</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    이미지 업로드
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={imageUploading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {imageUploading && (
                    <div className="mt-2 text-sm text-blue-600">
                      이미지 업로드 중...
                    </div>
                  )}
                </div>

                {images.length > 0 && (
                  <div className="space-y-2">
                    {images.map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url}
                          alt={`이미지 ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => setImages(images.filter((_, i) => i !== index))}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
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