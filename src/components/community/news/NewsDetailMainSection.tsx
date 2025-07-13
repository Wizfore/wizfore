'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Calendar, Tag } from 'lucide-react'
import { getCategoryByEnglish } from '@/lib/utils/newsUtils'
import { TextAnimate } from '@/components/magicui/text-animate'
import { MagicCard } from '@/components/magicui/magic-card'
import { ShimmerButton } from '@/components/magicui/shimmer-button'
import { BorderBeam } from '@/components/magicui/border-beam'
import { DotPattern } from '@/components/magicui/dot-pattern'
import { TextReveal } from '@/components/magicui/text-reveal'
import { cn } from '@/lib/utils'
import type { Article, CategoryItem } from '@/types'

interface NewsDetailMainSectionProps {
  article: Article & { category: string }
  categories: CategoryItem[]
  showBackButton?: boolean
}

const NewsDetailMainSection = ({ article, categories, showBackButton = true }: NewsDetailMainSectionProps) => {
  const router = useRouter()
  
  // 영어 카테고리를 한글로 변환
  const categoryKorean = getCategoryByEnglish(categories, article.category)?.korean || article.category


  return (
    <div className="relative bg-gray-50">
      {/* 배경 패턴 */}
      <DotPattern
        className={cn(
          "[mask-image:radial-gradient(400px_circle_at_center,white,transparent)]",
          "absolute inset-0 opacity-20"
        )}
        width={20}
        height={20}
        cx={1}
        cy={1}
        cr={1}
      />
      
      {/* 뒤로가기 버튼 */}
      {showBackButton && (
        <div className="relative z-10 container-custom mx-auto px-4 md:px-6 pt-6 md:pt-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <button
              onClick={() => router.push('/community/news')}
              className="inline-flex items-center px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              목록으로 돌아가기
            </button>
          </motion.div>
        </div>
      )}

      {/* 통합 메인 섹션 */}
      <div className="relative container-custom mx-auto px-4 md:px-6 py-8 md:py-12 z-10">
        <motion.div
          className="max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <MagicCard
            className="relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            gradientColor="#f1f5f9"
            gradientFrom="#f97316"
            gradientTo="#fb7185"
            gradientOpacity={0.1}
          >
            <BorderBeam 
              size={250}
              duration={12}
              borderWidth={1.5}
              colorFrom="#FF6B6B"
              colorTo="#FF8A80"
            />
            
            {/* 헤더 영역 */}
            <div className="pt-6 md:pt-10 lg:pt-12 px-6 md:px-10 lg:px-12">
              <div className="flex items-start justify-between mb-8">
                {/* 카테고리 태그 */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <span className="inline-block px-4 py-2 bg-wizfore-coral-primary text-white text-sm font-medium rounded-full">
                    <TextAnimate
                      animation="slideLeft"
                      by="character"
                      delay={0.4}
                      className="inline-block"
                      as="span"
                    >
                      {categoryKorean}
                    </TextAnimate>
                  </span>
                </motion.div>
                
                {/* 날짜 */}
                <motion.div
                  className="text-sm text-gray-500"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <TextAnimate
                    animation="slideRight"
                    by="character"
                    delay={0.5}
                    className="inline-block"
                    as="span"
                  >
                    {new Date(article.date).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit'
                    }).replace(/\./g, '.').replace(/\s/g, '')}
                  </TextAnimate>
                </motion.div>
              </div>
              
              {/* 제목 */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                {article.title}
              </h1>
            </div>
            
            {/* 구분선 */}
            <div className="px-6 md:px-10 lg:px-12">
              <hr className="border-gray-600 border-t-2 mb-14" />
            </div>
            
            {/* 본문 영역 */}
            <div className="px-6 md:px-10 lg:px-12 pb-6 md:pb-10 lg:pb-12 min-h-[400px]">
              {article.images && article.images.length > 0 && (
                <motion.div 
                  className="mb-10"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <img
                    src={article.images[0]}
                    alt={article.title}
                    className="w-full rounded-lg shadow-sm"
                  />
                </motion.div>
              )}
              
              <div className="prose max-w-none">
                {article.contentHtml ? (
                  <div 
                    className="markdown-content text-lg md:text-xl leading-relaxed md:leading-loose text-gray-700"
                    dangerouslySetInnerHTML={{ __html: article.contentHtml }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-64 text-gray-400">
                    <p className="text-lg md:text-xl">본문 내용이 준비 중입니다.</p>
                  </div>
                )}
              </div>
            </div>
          </MagicCard>
        </motion.div>
      </div>
    </div>
  )
}

export default NewsDetailMainSection