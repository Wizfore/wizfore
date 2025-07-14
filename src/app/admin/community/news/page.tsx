'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, Filter, Search } from 'lucide-react'
import { Article } from '@/types/community'
import { getCommunity, deleteArticle } from '@/lib/services/dataService'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const statusOptions = [
  { value: 'all', label: '전체' },
  { value: 'draft', label: '임시저장' },
  { value: 'published', label: '발행됨' }
]

const categoryOptions = [
  { value: 'all', label: '전체 카테고리' },
  { value: 'notices', label: '공지사항' },
  { value: 'partnership', label: '파트너십' },
  { value: 'news', label: '소식' },
  { value: 'events', label: '행사' },
  { value: 'awards', label: '수상' }
]

export default function NewsManagePage() {
  const router = useRouter()
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([])

  useEffect(() => {
    loadArticles()
  }, [])

  useEffect(() => {
    filterArticles()
  }, [articles, searchTerm, selectedStatus, selectedCategory])

  const loadArticles = async () => {
    try {
      setLoading(true)
      const communityData = await getCommunity()
      const allArticles = communityData?.news?.articles || []
      setArticles(allArticles)
    } catch (error) {
      console.error('게시글 목록 조회 실패:', error)
    } finally {
      setLoading(false)
    }
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

    // 최신순으로 정렬
    filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    
    setFilteredArticles(filtered)
  }

  const handleSearch = () => {
    filterArticles()
  }

  const handleDelete = async (id: string, category: string) => {
    if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      try {
        await deleteArticle(id)
        await loadArticles()
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

  const getCategoryBadge = (category: Article['category']) => {
    const categoryMap = {
      notices: { label: '공지사항', className: 'bg-red-100 text-red-800' },
      partnership: { label: '파트너십', className: 'bg-blue-100 text-blue-800' },
      news: { label: '소식', className: 'bg-green-100 text-green-800' },
      events: { label: '행사', className: 'bg-purple-100 text-purple-800' },
      awards: { label: '수상', className: 'bg-yellow-100 text-yellow-800' }
    }
    
    const config = categoryMap[category] || { label: category, className: 'bg-gray-100 text-gray-800' }
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">공지사항 관리</h1>
        </div>
        <Button onClick={() => router.push('/admin/community/news/create')}>
          <Plus className="h-4 w-4 mr-2" />
          새 게시글 작성
        </Button>
      </div>

      {/* 필터 및 검색 */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-900">필터 및 검색</h2>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="제목, 내용으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
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
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">게시글 목록</h2>
          <p className="text-sm text-gray-600">
            총 {filteredArticles.length}개의 게시글이 있습니다.
          </p>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-gray-600">게시글를 불러오는 중...</p>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {searchTerm || selectedStatus !== 'all' || selectedCategory !== 'all' 
                  ? '조건에 맞는 게시글이 없습니다.' 
                  : '게시글이 없습니다.'
                }
              </p>
              <Button 
                className="mt-4" 
                onClick={() => router.push('/admin/community/news/create')}
              >
                <Plus className="h-4 w-4 mr-2" />
                첫 번째 게시글 작성하기
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>제목</TableHead>
                    <TableHead>카테고리</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>발행일</TableHead>
                    <TableHead>작성일</TableHead>
                    <TableHead>수정일</TableHead>
                    <TableHead className="text-right">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredArticles.map((article) => (
                    <TableRow key={article.id}>
                      <TableCell className="max-w-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-medium truncate">{article.title}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getCategoryBadge(article.category)}</TableCell>
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
                            onClick={() => handleDelete(article.id, article.category)}
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