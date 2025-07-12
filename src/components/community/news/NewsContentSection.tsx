'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Filter, Megaphone } from 'lucide-react'
import type { Article, CategoryItem } from '@/types'
import { separateNoticeAndNews, createGlobalId } from '@/lib/utils/newsUtils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface NewsContentSectionProps {
  aboutMessage?: {
    title?: string
    description?: string
  }
  articlesData: Article[]
  allNews: Article[]
  categories: CategoryItem[]
  selectedCategory: string
  onCategoryChange: (categoryEnglish: string) => void
  filteredNews: Article[]
  newsByYear: Record<string, Article[]>
  years: string[]
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  itemsPerPage: number
}

const NewsContentSection: React.FC<NewsContentSectionProps> = ({
  aboutMessage,
  articlesData,
  allNews,
  categories,
  selectedCategory,
  onCategoryChange,
  filteredNews,
  newsByYear,
  years,
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage
}) => {
  const router = useRouter()

  const handleNewsClick = (newsItem: Article) => {
    const globalId = createGlobalId(newsItem.category, newsItem.id)
    router.push(`/community/news/${globalId}`)
  }

  // published 상태인 게시글만 필터링
  const publishedArticles = articlesData.filter(article => article.status === 'published')
  
  // 공지사항과 일반 뉴스 분리
  const { noticeItems, regularNews } = separateNoticeAndNews(publishedArticles)
  
  // 전체 필터에서 공지사항을 제외한 페이지네이션 계산
  const isAllCategory = selectedCategory === 'all'
  const paginatedNews = isAllCategory 
    ? regularNews
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : filteredNews
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  
  // 표시할 뉴스 목록 (공지사항 + 페이지네이션된 일반 뉴스)
  const displayedNews = isAllCategory 
    ? [...noticeItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), ...paginatedNews]
    : paginatedNews
  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-wizfore-text-primary mb-4">
            {aboutMessage?.title || "전체 소식"}
          </h2>
          <p className="text-wizfore-text-secondary mb-8">
            {aboutMessage?.description || "위즈포레 사회서비스센터의 다양한 협력 활동, 수상 내역, 행사 참여 등 주요 소식들을 시간순으로 확인하실 수 있습니다."} 
          </p>

          {/* 카테고리 필터 */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <button
              onClick={() => onCategoryChange('all')}
              className={`inline-flex items-center px-4 py-2 rounded-full text-sm border transition-colors ${
                selectedCategory === 'all' 
                  ? 'bg-wizfore-coral-primary/20 text-wizfore-coral-primary border-wizfore-coral-primary' 
                  : 'bg-white text-wizfore-text-secondary border-gray-200 hover:border-wizfore-coral-primary'
              }`}
            >
              <Filter className="w-4 h-4 mr-2" />
              전체 ({allNews.filter(article => article.status === 'published').length})
            </button>
            {categories.map((category) => (
              <button
                key={category.english}
                onClick={() => onCategoryChange(category.english)}
                className={`inline-flex items-center px-4 py-2 rounded-full text-sm border transition-colors ${
                  selectedCategory === category.english 
                    ? 'bg-wizfore-coral-primary/20 text-wizfore-coral-primary border-wizfore-coral-primary' 
                    : 'bg-white text-wizfore-text-secondary border-gray-200 hover:border-wizfore-coral-primary'
                }`}
              >
                {category.korean} ({publishedArticles.filter(article => article.category === category.english).length})
              </button>
            ))}
          </div>
        </motion.div>

        {/* 뉴스 목록 테이블 */}
        <motion.div 
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="text-center font-bold text-wizfore-text-primary w-16">번호</TableHead>
                  <TableHead className="font-bold text-wizfore-text-primary">제목</TableHead>
                  <TableHead className="text-center font-bold text-wizfore-text-primary w-32">날짜</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedNews.map((item) => {
                    const isNotice = item.category === 'notices'
                    
                    // 번호 계산
                    let displayNumber: string | number | JSX.Element
                    if (isNotice) {
                      displayNumber = <Megaphone className="w-5 h-5 text-wizfore-coral-primary" />
                    } else {
                      // 일반 뉴스의 경우 전체 일반 뉴스에서의 순서 계산
                      const allRegularNews = selectedCategory === 'all' ? regularNews : filteredNews
                      const sortedByDateAsc = [...allRegularNews].sort((a, b) => {
                        const dateCompare = new Date(a.date).getTime() - new Date(b.date).getTime();
                        if (dateCompare === 0) {
                          return b.title.localeCompare(a.title);
                        }
                        return dateCompare;
                      });
                      const globalIndex = sortedByDateAsc.findIndex(sortedItem => 
                        sortedItem.title === item.title && sortedItem.date === item.date
                      ) + 1;
                      displayNumber = globalIndex
                    }
                    
                    return (
                    <TableRow 
                      key={item.title + item.date}
                      className={`hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-100 ${
                        isNotice ? 'bg-gray-100' : ''
                      }`}
                      onClick={() => handleNewsClick(item)}
                    >
                      <TableCell className="text-center text-sm font-medium text-wizfore-text-secondary">
                        <div className="flex justify-center items-center">
                          {displayNumber}
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <p className="text-sm font-semibold leading-tight hover:text-wizfore-coral-primary transition-colors text-wizfore-text-primary">
                          {item.title}
                        </p>
                      </TableCell>
                      <TableCell className="text-center text-sm text-wizfore-text-secondary">
                        {new Date(item.date).toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit'
                        }).replace(/\./g, '.').replace(/\s/g, '')}
                      </TableCell>
                    </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {/* 페이지 번호들 */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // 현재 페이지 주변 페이지만 표시 (최대 5개)
                    const shouldShow = 
                      page === 1 || 
                      page === totalPages || 
                      (page >= currentPage - 2 && page <= currentPage + 2);
                    
                    if (!shouldShow) {
                      if (page === currentPage - 3 || page === currentPage + 3) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }
                      return null;
                    }

                    return (
                      <PaginationItem key={page}>
                        <PaginationLink 
                          onClick={() => onPageChange(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}

export default NewsContentSection