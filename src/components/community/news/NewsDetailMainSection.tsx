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
    <div className="relative bg-white">
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
        <div className="relative z-10 container-custom mx-auto px-4 md:px-6 lg:px-8 pt-4 md:pt-6 lg:pt-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <button
              onClick={() => router.push('/community/news')}
              className="group inline-flex items-center gap-2 px-4 py-2.5 md:px-5 md:py-3 bg-white hover:bg-wizfore-coral-primary text-wizfore-coral-primary hover:text-white border-2 border-wizfore-coral-primary rounded-lg md:rounded-xl font-medium text-sm md:text-base transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:-translate-x-1" />
              목록으로 돌아가기
            </button>
          </motion.div>
        </div>
      )}

      {/* 통합 메인 섹션 */}
      <div className="relative container-custom mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-12 z-10">
        <motion.div
          className="max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <MagicCard
            className="relative bg-white rounded-lg md:rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
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
            <div className="pt-4 md:pt-6 lg:pt-8 xl:pt-12 px-4 md:px-6 lg:px-8 xl:px-12">
              <div className="flex items-start justify-between mb-6 md:mb-8">
                {/* 카테고리 태그 */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <span className="inline-block px-3 py-1.5 md:px-4 md:py-2 bg-wizfore-coral-primary text-white text-xs md:text-sm font-medium rounded-full">
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
                  className="text-xs md:text-sm text-gray-500"
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
              <h1 className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-800 mb-4 md:mb-6">
                {article.title}
              </h1>
            </div>
            
            {/* 구분선 */}
            <div className="px-4 md:px-6 lg:px-8 xl:px-12">
              <hr className="border-gray-600 border-t-2 mb-8 md:mb-12 lg:mb-14" />
            </div>
            
            {/* 본문 영역 */}
            <div className="px-4 md:px-6 lg:px-8 xl:px-12 pb-4 md:pb-6 lg:pb-8 xl:pb-12 min-h-[300px] md:min-h-[400px]">
              <div className="prose max-w-none">
                {article.contentHtml ? (
                  <div 
                    className="markdown-content text-sm md:text-base lg:text-lg leading-relaxed md:leading-relaxed lg:leading-loose text-gray-700"
                    dangerouslySetInnerHTML={{ __html: article.contentHtml }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-48 md:h-64 text-gray-400">
                    <p className="text-base md:text-lg lg:text-xl">본문 내용이 준비 중입니다.</p>
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