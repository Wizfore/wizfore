'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, Filter, Search, Tag, ChevronDown, ChevronUp, Info } from 'lucide-react'
import { Article, NewsInfo } from '@/types/community'
import { CategoryItem } from '@/types/common'
import { deleteArticle, updateCommunity } from '@/lib/services/dataService'
import { getCategoryFilterOptions, getCategoryBadgeStyle, getCategoryOptions, getCategoryLabelSync } from '@/lib/utils/categoryUtils'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const statusOptions = [
  { value: 'all', label: '전체' },
  { value: 'draft', label: '임시저장' },
  { value: 'published', label: '발행됨' }
]


interface NewsManagementTabProps {
  data: NewsInfo
  onUpdate: (data: NewsInfo) => void // 설정 변경용 (카테고리 관리)
  onArticleChange?: (data: NewsInfo) => void // 게시글 CRUD용 (실시간 변경)
}

export default function NewsManagementTab({ data, onUpdate, onArticleChange }: NewsManagementTabProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([])
  const [categoryOptions, setCategoryOptions] = useState<Array<{value: string, label: string}>>([])
  
  // 정렬 상태
  const [sortField, setSortField] = useState<'id' | 'title' | 'category' | 'status' | 'date' | 'createdAt' | 'updatedAt' | null>('updatedAt')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  
  // 카테고리 관리 상태
  const [showCategoryManagement, setShowCategoryManagement] = useState(false)
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [originalCategories, setOriginalCategories] = useState<CategoryItem[]>([])
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [newCategory, setNewCategory] = useState({ english: '', korean: '' })

  // 카테고리 옵션 로딩
  useEffect(() => {
    const loadCategoryOptions = async () => {
      try {
        const options = await getCategoryFilterOptions()
        setCategoryOptions(options)
      } catch (error) {
        console.error('카테고리 옵션 로딩 실패:', error)
        setCategoryOptions([{ value: 'all', label: '전체 카테고리' }])
      }
    }
    loadCategoryOptions()
  }, [])

  // 카테고리 데이터 로딩
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoryData = await getCategoryOptions()
        setCategories(categoryData)
        setOriginalCategories(JSON.parse(JSON.stringify(categoryData))) // 깊은 복사로 원본 보관
      } catch (error) {
        console.error('카테고리 데이터 로딩 실패:', error)
      }
    }
    loadCategories()
  }, [data])

  const articles = data.articles || []

  useEffect(() => {
    filterArticles()
  }, [articles, searchTerm, selectedStatus, selectedCategory, sortField, sortDirection])

  // 정렬 함수
  const handleSort = (field: 'id' | 'title' | 'category' | 'status' | 'date' | 'createdAt' | 'updatedAt') => {
    if (sortField === field) {
      // 같은 컬럼 클릭 시 방향 토글
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      // 다른 컬럼 클릭 시 새 컬럼으로 변경하고 오름차순으로 시작
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const applySorting = (articlesToSort: Article[]) => {
    if (!sortField) return articlesToSort

    return [...articlesToSort].sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (sortField) {
        case 'id':
          aValue = parseInt(a.id)
          bValue = parseInt(b.id)
          break
        case 'title':
          aValue = a.title.toLowerCase()
          bValue = b.title.toLowerCase()
          break
        case 'category':
          aValue = getCategoryLabelSync(a.category)
          bValue = getCategoryLabelSync(b.category)
          break
        case 'status':
          // published를 draft보다 우선순위로 두기
          aValue = a.status === 'published' ? 0 : 1
          bValue = b.status === 'published' ? 0 : 1
          break
        case 'date':
          aValue = new Date(a.date).getTime()
          bValue = new Date(b.date).getTime()
          break
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime()
          bValue = new Date(b.createdAt).getTime()
          break
        case 'updatedAt':
          aValue = new Date(a.updatedAt).getTime()
          bValue = new Date(b.updatedAt).getTime()
          break
        default:
          return 0
      }

      if (aValue < bValue) {
        return sortDirection === 'asc' ? -1 : 1
      }
      if (aValue > bValue) {
        return sortDirection === 'asc' ? 1 : -1
      }
      return 0
    })
  }

  const filterArticles = () => {
    let filtered = [...articles]

    // 카테고리 필터
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article => article.category === selectedCategory)
    }

    // 상태 필터
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(article => article.status === selectedStatus)
    }

    // 검색 필터
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(searchLower) ||
        article.contentHtml.toLowerCase().includes(searchLower)
      )
    }

    // 정렬 적용
    const sorted = applySorting(filtered)
    
    setFilteredArticles(sorted)
  }

  const handleSearch = () => {
    filterArticles()
  }

  // 정렬 아이콘 렌더링 함수
  const getSortIcon = (field: string) => {
    if (sortField !== field) return null
    return sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      try {
        await deleteArticle(id)
        // 상태에서 삭제된 게시글 제거
        const updatedArticles = articles.filter(article => article.id !== id)
        const updatedData = {
          ...data,
          articles: updatedArticles
        }
        
        // 게시글 실시간 변경은 onArticleChange 사용 (hasChanges에 영향 없음)
        if (onArticleChange) {
          onArticleChange(updatedData)
        } else {
          // fallback to onUpdate if onArticleChange is not provided
          onUpdate(updatedData)
        }
      } catch (error) {
        console.error('게시글 삭제 실패:', error)
        alert('게시글 삭제에 실패했습니다.')
      }
    }
  }

  const getStatusBadge = (status: Article['status']) => {
    const statusMap = {
      published: { label: '발행됨', className: 'bg-green-100 text-green-800' },
      draft: { label: '임시저장', className: 'bg-gray-100 text-gray-800' }
    }
    
    const config = statusMap[status] || { label: status, className: 'bg-gray-100 text-gray-800' }
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    )
  }

  const getCategoryBadgeLocal = (category: Article['category']) => {
    const { className, label } = getCategoryBadgeStyle(category)
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${className}`}>
        {label}
      </span>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // 카테고리 CRUD 함수들
  const handleAddCategory = async () => {
    try {
      // 유효성 검사
      const englishName = newCategory.english.trim().toLowerCase()
      const koreanName = newCategory.korean.trim()

      if (!englishName || !koreanName) {
        alert('영어명과 한국어명을 모두 입력해주세요.')
        return
      }

      // 영어명 형식 검사 (알파벳, 숫자, 하이픈만 허용)
      if (!/^[a-z0-9-]+$/.test(englishName)) {
        alert('영어명은 소문자, 숫자, 하이픈(-)만 사용할 수 있습니다.')
        return
      }

      // 중복 검사
      if (categories.some(cat => cat.english === englishName)) {
        alert('이미 존재하는 영어명입니다.')
        return
      }

      if (categories.some(cat => cat.korean === koreanName)) {
        alert('이미 존재하는 한국어명입니다.')
        return
      }

      const newCategoryItem: CategoryItem = {
        english: englishName,
        korean: koreanName
      }

      const updatedCategories = [...categories, newCategoryItem]
      await updateCategories(updatedCategories)
      
      // 입력 폼 리셋
      setNewCategory({ english: '', korean: '' })
      alert('카테고리가 성공적으로 추가되었습니다.')

    } catch (error) {
      console.error('카테고리 추가 실패:', error)
      alert('카테고리 추가에 실패했습니다.')
    }
  }

  const handleCancelCategoryEdit = () => {
    // 원본 데이터로 복원
    setCategories(JSON.parse(JSON.stringify(originalCategories)))
    setEditingCategory(null)
  }

  const handleStartCategoryEdit = (englishName: string) => {
    // 편집 시작 시 현재 상태를 원본으로 저장
    setOriginalCategories(JSON.parse(JSON.stringify(categories)))
    setEditingCategory(englishName)
  }

  const handleSaveCategory = async (originalEnglishName: string) => {
    try {
      const categoryToSave = categories.find(cat => cat.english === originalEnglishName)
      if (!categoryToSave) return

      const englishName = categoryToSave.english.trim().toLowerCase()
      const koreanName = categoryToSave.korean.trim()

      // 유효성 검사
      if (!englishName || !koreanName) {
        alert('영어명과 한국어명을 모두 입력해주세요.')
        return
      }

      // 영어명 형식 검사
      if (!/^[a-z0-9-]+$/.test(englishName)) {
        alert('영어명은 소문자, 숫자, 하이픈(-)만 사용할 수 있습니다.')
        return
      }

      // 중복 검사 (자기 자신 제외)
      if (categories.some(cat => cat.english !== originalEnglishName && cat.english === englishName)) {
        alert('이미 존재하는 영어명입니다.')
        return
      }

      if (categories.some(cat => cat.english !== originalEnglishName && cat.korean === koreanName)) {
        alert('이미 존재하는 한국어명입니다.')
        return
      }

      // 영어명이 변경된 경우 기존 게시글들의 카테고리도 업데이트
      let updatedArticles = [...articles]
      if (originalEnglishName !== englishName) {
        updatedArticles = articles.map(article => 
          article.category === originalEnglishName 
            ? { ...article, category: englishName as Article['category'] }
            : article
        )
      }

      const updatedCategories = categories.map(cat => 
        cat.english === originalEnglishName 
          ? { english: englishName, korean: koreanName }
          : cat
      )

      await updateCategories(updatedCategories, updatedArticles)
      setEditingCategory(null)
      setOriginalCategories(JSON.parse(JSON.stringify(updatedCategories))) // 저장 성공 시 원본 업데이트
      alert('카테고리가 성공적으로 수정되었습니다.')

    } catch (error) {
      console.error('카테고리 수정 실패:', error)
      alert('카테고리 수정에 실패했습니다.')
    }
  }

  const handleDeleteCategory = async (englishName: string) => {
    try {
      // 공지사항 카테고리는 삭제 불가
      if (englishName === 'notices') {
        alert('공지사항 카테고리는 삭제할 수 없습니다.')
        return
      }

      // 최소 1개 카테고리는 유지
      if (categories.length <= 1) {
        alert('최소 1개의 카테고리는 유지되어야 합니다.')
        return
      }

      // 해당 카테고리를 사용하는 게시글 수 확인
      const usageCount = articles.filter(article => article.category === englishName).length
      
      let confirmMessage = `'${categories.find(cat => cat.english === englishName)?.korean}' 카테고리를 삭제하시겠습니까?`
      
      if (usageCount > 0) {
        confirmMessage += `\n\n주의: 이 카테고리를 사용하는 ${usageCount}개의 게시글이 '소식' 카테고리로 이동됩니다.`
      }

      if (!window.confirm(confirmMessage)) {
        return
      }

      // 해당 카테고리 사용 중인 게시글들을 'news' 카테고리로 변경
      const updatedArticles = articles.map(article => 
        article.category === englishName 
          ? { ...article, category: 'news' as Article['category'] }
          : article
      )

      const updatedCategories = categories.filter(cat => cat.english !== englishName)
      
      await updateCategories(updatedCategories, updatedArticles)
      alert('카테고리가 성공적으로 삭제되었습니다.')

    } catch (error) {
      console.error('카테고리 삭제 실패:', error)
      alert('카테고리 삭제에 실패했습니다.')
    }
  }

  const updateCategories = async (updatedCategories: CategoryItem[], updatedArticles?: Article[]) => {
    try {
      const updatedData = {
        ...data,
        categories: updatedCategories,
        articles: updatedArticles || articles
      }

      await updateCommunity({ news: updatedData })
      
      // 상태 업데이트
      setCategories(updatedCategories)
      if (updatedArticles) {
        onUpdate(updatedData)
      }
      
      // 카테고리 옵션도 다시 로딩
      const options = await getCategoryFilterOptions()
      setCategoryOptions(options)

    } catch (error) {
      console.error('카테고리 업데이트 실패:', error)
      throw error
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">게시글 관리</h2>
        <p className="text-sm text-gray-600">공지사항, 협약, 소식 등을 관리할 수 있습니다.</p>
      </div>

      {/* 카테고리 관리 섹션 */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-900">카테고리 관리</h3>
            <span className="text-sm text-gray-500">
              ({categories.length}개 카테고리)
            </span>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowCategoryManagement(!showCategoryManagement)}
            className="flex items-center gap-2"
          >
            {showCategoryManagement ? (
              <>
                <ChevronUp className="h-4 w-4" />
                접기
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                펼치기
              </>
            )}
          </Button>
        </div>

        {showCategoryManagement && (
          <div className="space-y-4">
            {/* 카테고리 목록 테이블 */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>영어명</TableHead>
                    <TableHead>한국어명</TableHead>
                    <TableHead>게시글 수</TableHead>
                    <TableHead className="text-right">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.english}>
                      <TableCell className="font-mono text-sm">
                        {editingCategory === category.english ? (
                          <input
                            type="text"
                            value={category.english}
                            onChange={(e) => {
                              const updatedCategories = categories.map(cat =>
                                cat.english === category.english
                                  ? { ...cat, english: e.target.value }
                                  : cat
                              )
                              setCategories(updatedCategories)
                            }}
                            className={`px-2 py-1 border rounded text-sm w-full ${
                              category.english === 'notices' 
                                ? 'border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed' 
                                : 'border-gray-300'
                            }`}
                            disabled={category.english === 'notices'}
                            autoFocus
                          />
                        ) : (
                          <span 
                            className={`px-2 py-1 rounded ${
                              category.english === 'notices'
                                ? 'bg-gray-50 text-gray-600'
                                : 'cursor-pointer hover:bg-gray-100'
                            }`}
                            onDoubleClick={() => {
                              if (category.english !== 'notices') {
                                handleStartCategoryEdit(category.english)
                              }
                            }}
                          >
                            {category.english}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {editingCategory === category.english ? (
                          <input
                            type="text"
                            value={category.korean}
                            onChange={(e) => {
                              const updatedCategories = categories.map(cat =>
                                cat.english === category.english
                                  ? { ...cat, korean: e.target.value }
                                  : cat
                              )
                              setCategories(updatedCategories)
                            }}
                            className="px-2 py-1 border border-gray-300 rounded text-sm w-full"
                          />
                        ) : (
                          <span 
                            className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
                            onDoubleClick={() => handleStartCategoryEdit(category.english)}
                          >
                            {category.korean}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {articles.filter(article => article.category === category.english).length}개
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {editingCategory === category.english ? (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleSaveCategory(category.english)}
                                className="text-green-600 hover:text-green-700"
                              >
                                저장
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handleCancelCategoryEdit}
                                className="text-gray-600 hover:text-gray-700"
                              >
                                취소
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStartCategoryEdit(category.english)}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteCategory(category.english)}
                                disabled={category.english === 'notices'}
                                className={category.english === 'notices' 
                                  ? "text-gray-400 cursor-not-allowed" 
                                  : "text-red-600 hover:text-red-700"
                                }
                                title={category.english === 'notices' ? '공지사항 카테고리는 삭제할 수 없습니다.' : ''}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  {/* 새 카테고리 추가 행 */}
                  <TableRow className="bg-gray-50">
                    <TableCell>
                      <input
                        type="text"
                        placeholder="영어명 (예: events)"
                        value={newCategory.english}
                        onChange={(e) => setNewCategory(prev => ({ ...prev, english: e.target.value }))}
                        className="px-2 py-1 border border-gray-300 rounded text-sm w-full"
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        type="text"
                        placeholder="한국어명 (예: 행사)"
                        value={newCategory.korean}
                        onChange={(e) => setNewCategory(prev => ({ ...prev, korean: e.target.value }))}
                        className="px-2 py-1 border border-gray-300 rounded text-sm w-full"
                      />
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-500 text-sm">-</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleAddCategory}
                        disabled={!newCategory.english.trim() || !newCategory.korean.trim()}
                        className="text-green-600 hover:text-green-700"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        추가
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div className="text-sm text-gray-500 pt-2 border-t space-y-1">
              <div>💡 팁: 카테고리명을 더블클릭하면 바로 편집할 수 있습니다.</div>
              <div>📌 notices(영어명) 카테고리의 게시글은 목록 상단에 고정됩니다.</div>
            </div>
          </div>
        )}
      </div>

      {/* 필터 및 검색 */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900">필터 및 검색</h3>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="제목, 내용으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button onClick={handleSearch} variant="outline">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex gap-2">
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categoryOptions.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            <select 
              value={selectedStatus} 
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {statusOptions.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 게시글 목록 */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">게시글 목록</h3>
            <p className="text-sm text-gray-600">
              총 {filteredArticles.length}개의 게시글이 있습니다.
            </p>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <Info className="h-3 w-3" />
              표 제목을 클릭하여 정렬할 수 있습니다 (기본: 수정일 최신순)
            </p>
            <p className="text-xs text-gray-400 mt-1">
              ※ 일반 사용자 페이지에서는 발행일 최신순으로 정렬됩니다
            </p>
          </div>
          <Button onClick={() => router.push('/admin/community/news/create')}>
            <Plus className="h-4 w-4 mr-2" />
            새 게시글 작성
          </Button>
        </div>
        <div className="p-6">
          {filteredArticles.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {searchTerm || selectedStatus !== 'all' || selectedCategory !== 'all' 
                  ? '조건에 맞는 게시글이 없습니다.' 
                  : '게시글이 없습니다.'
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50 select-none"
                      onClick={() => handleSort('id')}
                    >
                      <div className="flex items-center gap-1">
                        ID
                        {getSortIcon('id')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50 select-none"
                      onClick={() => handleSort('title')}
                    >
                      <div className="flex items-center gap-1">
                        제목
                        {getSortIcon('title')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50 select-none"
                      onClick={() => handleSort('category')}
                    >
                      <div className="flex items-center gap-1">
                        카테고리
                        {getSortIcon('category')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50 select-none"
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center gap-1">
                        상태
                        {getSortIcon('status')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50 select-none"
                      onClick={() => handleSort('date')}
                    >
                      <div className="flex items-center gap-1">
                        발행일
                        {getSortIcon('date')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50 select-none"
                      onClick={() => handleSort('createdAt')}
                    >
                      <div className="flex items-center gap-1">
                        작성일
                        {getSortIcon('createdAt')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50 select-none"
                      onClick={() => handleSort('updatedAt')}
                    >
                      <div className="flex items-center gap-1">
                        수정일
                        {getSortIcon('updatedAt')}
                      </div>
                    </TableHead>
                    <TableHead className="text-right">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredArticles.map((article) => (
                    <TableRow key={article.id}>
                      <TableCell className="text-sm text-gray-600 font-mono">{article.id}</TableCell>
                      <TableCell className="max-w-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-medium truncate">{article.title}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getCategoryBadgeLocal(article.category)}</TableCell>
                      <TableCell>{getStatusBadge(article.status)}</TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {article.date}
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {formatDate(article.createdAt)}
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {formatDate(article.updatedAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/admin/community/news/${article.id}`)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDelete(article.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}