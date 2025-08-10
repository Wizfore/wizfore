'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { getPrograms, getHomeConfig } from '@/lib/services/dataService'
import { defaultSiteData } from '@/lib/data/defaultSiteData'
import { defaultHomeConfig } from '@/lib/data/defaultHomeConfig'
import type { ProgramCategory } from '@/types'

// CategoryCards에서 사용하는 확장된 타입 (fallback 데이터를 위해)
interface CategoryWithFallback extends ProgramCategory {
  title?: string
  description?: string
  imageUrl?: string
}

// 각 카테고리별 fallback 그라데이션 매핑 - Heart-Heart 따뜻한 오렌지 톤
const fallbackGradients = {
  'therapy': 'bg-gradient-to-br from-heart-primary to-heart-primary-hover',
  'counseling': 'bg-gradient-to-br from-heart-primary-hover to-heart-secondary',
  'afterschool': 'bg-gradient-to-br from-heart-secondary to-heart-accent',
  'adult-day': 'bg-gradient-to-br from-heart-accent to-heart-bright',
  'special-sports': 'bg-gradient-to-br from-heart-bright to-heart-warm'
}


// 이미지 fallback을 처리하는 컴포넌트
interface CategoryImageProps {
  categoryImageUrl?: string
  defaultImageUrl?: string
  alt: string
}

const CategoryImage = ({ categoryImageUrl, defaultImageUrl, alt }: CategoryImageProps) => {
  // 카테고리 이미지가 있고 빈 문자열이 아니면 사용, 그렇지 않으면 기본 이미지 사용
  const getInitialImageUrl = () => {
    if (categoryImageUrl && categoryImageUrl.trim() !== "") {
      return categoryImageUrl
    }
    return defaultImageUrl || ""
  }
  
  const [currentImageUrl, setCurrentImageUrl] = useState<string>(getInitialImageUrl())
  const [imageLoadFailed, setImageLoadFailed] = useState(false)

  const handleImageError = () => {
    if (currentImageUrl === categoryImageUrl && defaultImageUrl) {
      // 카테고리 이미지 실패 → 기본 이미지로 전환
      setCurrentImageUrl(defaultImageUrl)
    } else {
      // 기본 이미지도 실패하거나 없으면 → 이미지 숨김
      setImageLoadFailed(true)
    }
  }

  // 카테고리 이미지 URL이 변경되면 초기화
  useEffect(() => {
    const newImageUrl = getInitialImageUrl()
    setCurrentImageUrl(newImageUrl)
    setImageLoadFailed(false)
  }, [categoryImageUrl, defaultImageUrl])

  // 이미지 로드 실패하거나 이미지 URL이 없으면 숨김
  if (imageLoadFailed || !currentImageUrl) {
    return null // 그라데이션 배경만 표시
  }

  return (
    <div className="absolute inset-0 w-full h-full">
      <img 
        src={currentImageUrl}
        alt={alt}
        className="w-full h-full object-cover brightness-75 contrast-75 group-hover:brightness-100 group-hover:contrast-100 transition-all duration-300"
        onError={handleImageError}
      />
    </div>
  )
}

const CategoryCards = () => {
  const [programCategories, setProgramCategories] = useState<CategoryWithFallback[]>([])
  const [sectionConfig, setSectionConfig] = useState<{
    title?: string
    description?: string
    enabled?: boolean
  }>({
    title: "위즈포레 프로그램",
    description: "다양한 영역의 전문 프로그램을 제공합니다",
    enabled: true
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProgramCategories = async () => {
      try {
        const [categories, homeConfigData] = await Promise.all([
          getPrograms(),
          getHomeConfig().catch(() => null)
        ])
        
        // 섹션 설정 업데이트 (DB에서 가져오거나 기본값 사용)
        const categoryCardsConfig = homeConfigData?.sections?.categoryCards || 
                                   defaultHomeConfig.sections?.categoryCards ||
                                   {
                                     title: "위즈포레 프로그램",
                                     description: "다양한 영역의 전문 프로그램을 제공합니다",
                                     enabled: true
                                   }
        setSectionConfig(categoryCardsConfig)
        
        // 모든 카테고리를 순서대로 정렬
        const sortedCategories = categories
          .sort((a: ProgramCategory, b: ProgramCategory) => a.order - b.order)
        
        setProgramCategories(sortedCategories)
      } catch (error) {
        console.error('Error fetching program categories, using fallback:', error)
        // DB 실패 시 기본 데이터 사용
        const fallbackCategories = defaultSiteData.programs.map((program, index) => ({
          id: program.id,
          title: program.hero?.title || '',
          description: program.hero?.description || '',
          imageUrl: program.hero?.imageUrl || '',
          programs: program.programs || [],
          order: index + 1
        }))
        setProgramCategories(fallbackCategories)
        
        // 기본 섹션 설정
        const fallbackSectionConfig = defaultHomeConfig.sections?.categoryCards || {
          title: "위즈포레 프로그램",
          description: "다양한 영역의 전문 프로그램을 제공합니다",
          enabled: true
        }
        setSectionConfig(fallbackSectionConfig)
      } finally {
        setLoading(false)
      }
    }

    fetchProgramCategories()
  }, [])

  // enabled가 false면 섹션을 렌더링하지 않음
  if (!sectionConfig.enabled) {
    return null
  }

  if (loading) {
    return (
      <section className="relative overflow-hidden pt-32 pb-40 md:pt-48 md:pb-56 lg:pt-64 lg:pb-72 bg-gradient-to-b from-transparent to-white">
        {/* Heart-Heart 스타일 조약돌 모양 SVG 배경 (로딩 상태) */}
        <div className="absolute inset-0">
          <svg 
            className="absolute inset-0 w-full h-full" 
            preserveAspectRatio="xMidYMid slice" 
            viewBox="0 0 100 100"
          >
            <defs>
              <linearGradient id="stoneGradientLoading" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF7F0" stopOpacity="1.0" />
                <stop offset="40%" stopColor="#FFEDE4" stopOpacity="1.0" />
                <stop offset="80%" stopColor="#F38B5E" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#ED7B41" stopOpacity="0.9" />
              </linearGradient>
            </defs>
            <path 
              d="M -15,16
                  C 0,8 12,0 25,1.5
                  C 25,1.5 30,2 35,3 
                  C 40,4 50,8 60,10 
                  C 70,11 80,10 90,9 
                  C 100,8 110,8 115,8 
                  C 118,18 115,35 112,50 
                  C 115,65 108,80 95,85 
                  C 80,92 60,95 35,92 
                  C 15,89 -8,78 -12,65 
                  C -15,52 -12,35 -10,20 
                  C -15,15 -12,16 -15,16 Z"  
              fill="url(#stoneGradientLoading)" 
              opacity="0.9"
            />
          </svg>
        </div>
        
        <div className="w-full relative z-10 px-4 lg:px-8 xl:px-0">
          <div className="grid grid-cols-2 gap-3 md:gap-12 max-w-sm md:max-w-6xl mx-auto">
            {[...Array(5)].map((_, index) => (
                <div key={index}>
                  <div className="relative h-28 sm:h-32 md:h-48 lg:h-56 shadow-heart-card overflow-hidden rounded-heart-lg bg-heart-primary/30 animate-pulse w-full">
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 md:p-6">
                      <div className="h-4 md:h-6 bg-white/30 rounded-heart-md w-3/4 mb-1 md:mb-2 ml-1 md:ml-2"></div>
                      <div className="h-3 md:h-4 bg-white/20 rounded-heart-sm w-5/6 ml-1 md:ml-2"></div>
                    </div>
                  </div>
                </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative overflow-hidden pt-40 pb-56 md:pt-56 md:pb-72 lg:pt-64 lg:pb-88 xl:pt-72 xl:pb-104 bg-gradient-to-b from-transparent to-white">
      {/* Heart-Heart 스타일 조약돌 모양 SVG 배경 */}
      <div className="absolute inset-0 overflow-hidden">
        <svg 
          className="absolute inset-0 w-full h-full" 
          preserveAspectRatio="xMidYMid slice" 
          viewBox="-100 -80 400 320"
        >
          <defs>
            <linearGradient id="stoneGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFF7F0" stopOpacity="1.0" />
              <stop offset="20%" stopColor="#FFEDE4" stopOpacity="1.0" />
              <stop offset="80%" stopColor="#F38B5E" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ED7B41" stopOpacity="0.9" />
            </linearGradient>
          </defs>
          <path 
            d="M -88,35 
               C -90,10 -80,-30 -55,-45 
               C -30,-60 25,-50 75,-45 
               C 125,-40 175,-50 225,-45 
               C 275,-40 290,-25 285,15 
               C 290,55 285,95 275,135 
               C 265,175 245,195 195,205 
               C 145,215 95,210 65,207 
               C 35,205 5,210 -20,200 
               C -55,190 -70,160 -77,120 
               C -87,80 -86,60 -88,35 Z" 
            fill="url(#stoneGradient)" 
            opacity="0.9"
          />
        </svg>
      </div>
      
      <div className="w-full relative z-10 px-4 lg:px-8 xl:px-0">
        {/* 섹션 제목 */}
        <div className="text-center mb-16">
          <h2 
            className="text-2xl md:text-3xl lg:text-4xl font-bold"
            style={{
              animation: 'heart-pulse 2s ease-in-out infinite'
            }}
          >
            <span className="text-heart-body">{sectionConfig.title?.split(' ')[0] || "위즈포레"}</span>{' '}
            <span className="text-heart-primary">{sectionConfig.title?.split(' ').slice(1).join(' ') || "프로그램"}</span>
          </h2>
          {sectionConfig.description && (
            <p className="text-heart-gray mt-4 text-sm md:text-base lg:text-lg max-w-2xl mx-auto">
              {sectionConfig.description}
            </p>
          )}
        </div>
        
        {/* 홀수 카드 처리를 위한 조건부 로직 */}
        {(() => {
          const isOdd = programCategories.length % 2 !== 0
          const gridCards = isOdd ? programCategories.slice(0, -1) : programCategories
          const centerCard = isOdd ? programCategories[programCategories.length - 1] : null

          return (
            <>
              {/* 기존 2열 그리드 (홀수인 경우 마지막 카드 제외) */}
              <div className="grid grid-cols-2 gap-3 md:gap-12 max-w-sm md:max-w-6xl mx-auto">
                {gridCards.map((category, index) => {
            const fallbackGradient = fallbackGradients[category.id as keyof typeof fallbackGradients] || fallbackGradients['therapy']
            
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Link href={`/programs/${category.id}`}>
                  <div className={`relative h-28 sm:h-32 md:h-48 lg:h-56 shadow-heart-card hover:shadow-heart-elevated transition-all duration-300 group-hover:scale-105 overflow-hidden rounded-heart-xl ${fallbackGradient} w-full`}>
                    {/* 배경 이미지 */}
                    <CategoryImage 
                      categoryImageUrl={category.hero?.imageUrl}
                      defaultImageUrl={category.hero?.defaultImageUrl}
                      alt={`${category.hero?.title} 프로그램`}
                    />
                    {/* 어두운 필터 오버레이 */}
                    <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-all duration-300 z-5"></div>
                    
                    {/* 왼쪽 하단 텍스트 오버레이 */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 md:p-6 z-10">
                      <h2 className="text-white text-xs sm:text-sm md:text-base lg:text-lg font-bold mb-1 md:mb-2 drop-shadow-lg ml-1 md:ml-2">
                        {category.hero?.title}
                      </h2>
                      <p className="text-white/90 text-xs md:text-sm drop-shadow-md line-clamp-2 ml-1 md:ml-2">
                        {category.hero?.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
              
            )
                })}
              </div>

              {/* 홀수일 때 마지막 카드를 중앙에 배치 */}
              {centerCard && (
                <div className="flex justify-center mt-3 md:mt-12 max-w-sm md:max-w-6xl mx-auto">
                  <div className="w-[calc(50%-0.375rem)] md:w-[calc(50%-1.5rem)]">
                    {(() => {
                      const category = centerCard
                      const index = programCategories.length - 1
                      const fallbackGradient = fallbackGradients[category.id as keyof typeof fallbackGradients] || fallbackGradients['therapy']
                      
                      return (
                        <motion.div
                          key={category.id}
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: index * 0.1 }}
                          viewport={{ once: true }}
                          whileHover={{ y: -5 }}
                          className="group"
                        >
                          <Link href={`/programs/${category.id}`}>
                            <div className={`relative h-28 sm:h-32 md:h-48 lg:h-56 shadow-heart-card hover:shadow-heart-elevated transition-all duration-300 group-hover:scale-105 overflow-hidden rounded-heart-xl ${fallbackGradient} w-full`}>
                              {/* 배경 이미지 */}
                              <CategoryImage 
                                categoryImageUrl={category.hero?.imageUrl}
                                defaultImageUrl={category.hero?.defaultImageUrl}
                                alt={`${category.hero?.title} 프로그램`}
                              />
                              {/* 어두운 필터 오버레이 */}
                              <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-all duration-300 z-5"></div>
                              
                              {/* 왼쪽 하단 텍스트 오버레이 */}
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 md:p-6 z-10">
                                <h2 className="text-white text-sm md:text-lg font-bold mb-1 md:mb-2 drop-shadow-lg ml-1 md:ml-2">
                                  {category.hero?.title}
                                </h2>
                                <p className="text-white/90 text-xs md:text-sm drop-shadow-md line-clamp-2 ml-1 md:ml-2">
                                  {category.hero?.description}
                                </p>
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      )
                    })()}
                  </div>
                </div>
              )}
            </>
          )
        })()}
      </div>
    </section>
  )
}

export default CategoryCards
