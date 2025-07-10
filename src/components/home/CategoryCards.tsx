'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { getPrograms } from '@/lib/services/dataService'
import { defaultSiteData } from '@/lib/data/defaultSiteData'
import type { ProgramCategory } from '@/types'

// CategoryCards에서 사용하는 확장된 타입 (fallback 데이터를 위해)
interface CategoryWithFallback extends ProgramCategory {
  title?: string
  description?: string
}

// 각 카테고리별 fallback 그라데이션 매핑
const fallbackGradients = {
  'therapy': 'bg-gradient-to-br from-wizfore-coral-primary to-wizfore-coral-secondary',
  'counseling': 'bg-gradient-to-br from-wizfore-coral-secondary to-wizfore-coral-light',
  'afterschool': 'bg-gradient-to-br from-wizfore-coral-light to-wizfore-coral-accent',
  'adult-day': 'bg-gradient-to-br from-wizfore-coral-accent to-wizfore-soft-pink'
}

// 이미지 fallback을 처리하는 컴포넌트
interface CategoryImageProps {
  categoryImageUrl?: string
  defaultImageUrl: string
  alt: string
}

const CategoryImage = ({ categoryImageUrl, defaultImageUrl, alt }: CategoryImageProps) => {
  // 카테고리 이미지가 없으면 바로 기본 이미지 사용
  const initialImageUrl = categoryImageUrl && categoryImageUrl.trim() !== "" ? categoryImageUrl : defaultImageUrl
  const [currentImageUrl, setCurrentImageUrl] = useState<string>(initialImageUrl)
  const [imageLoadFailed, setImageLoadFailed] = useState(false)

  const handleImageError = () => {
    if (currentImageUrl === categoryImageUrl && defaultImageUrl) {
      // 카테고리 이미지 실패 → 기본 이미지로 전환
      setCurrentImageUrl(defaultImageUrl)
    } else {
      // 기본 이미지도 실패 → 이미지 숨김
      setImageLoadFailed(true)
    }
  }

  // 카테고리 이미지 URL이 변경되면 초기화
  useEffect(() => {
    const newImageUrl = categoryImageUrl && categoryImageUrl.trim() !== "" ? categoryImageUrl : defaultImageUrl
    setCurrentImageUrl(newImageUrl)
    setImageLoadFailed(false)
  }, [categoryImageUrl, defaultImageUrl])

  if (imageLoadFailed) {
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
  const [defaultImageUrl, setDefaultImageUrl] = useState<string>('/images/programs/defaultImage.jpg')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProgramCategories = async () => {
      try {
        const categories = await getPrograms()
        const defaultImg = '/images/programs/defaultImage.jpg'
        
        // 첫 4개 카테고리만 표시하고 순서대로 정렬
        const sortedCategories = categories
          .sort((a: ProgramCategory, b: ProgramCategory) => a.order - b.order)
          .slice(0, 4)
        
        setProgramCategories(sortedCategories)
        setDefaultImageUrl(defaultImg)
      } catch (error) {
        console.error('Error fetching program categories, using fallback:', error)
        // DB 실패 시 기본 데이터 사용
        const fallbackCategories = defaultSiteData.programs.slice(0, 4).map((program, index) => ({
          id: program.id,
          title: program.heroMessage?.title || '',
          description: program.heroMessage?.description || '',
          imageUrl: program.imageUrl || '',
          programs: program.programs || [],
          order: index + 1
        }))
        setProgramCategories(fallbackCategories)
        setDefaultImageUrl('/images/programs/defaultImage.jpg')
      } finally {
        setLoading(false)
      }
    }

    fetchProgramCategories()
  }, [])

  if (loading) {
    return (
      <section className="relative overflow-hidden pt-48 pb-56 md:pt-64 md:pb-72">
        {/* 메디모아 스타일 조약돌 모양 SVG 배경 (로딩 상태) */}
        <div className="absolute inset-0">
          <svg 
            className="absolute inset-0 w-full h-full" 
            preserveAspectRatio="none" 
            viewBox="0 0 100 100"
          >
            <defs>
              <linearGradient id="stoneGradientLoading" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgb(255, 224, 224)" />
                <stop offset="40%" stopColor="rgb(248, 215, 218)" />
                <stop offset="80%" stopColor="rgb(245, 198, 203)" />
                <stop offset="100%" stopColor="rgb(240, 160, 168)" />
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
              opacity="0.75"
            />
          </svg>
        </div>
        
        <div className="w-full relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="relative h-64 w-full shadow-md overflow-hidden rounded-2xl bg-gray-300 animate-pulse">
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                  <div className="h-6 bg-white/30 rounded w-3/4 mb-2 ml-2"></div>
                  <div className="h-4 bg-white/20 rounded w-5/6 ml-2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative overflow-hidden pt-48 pb-56 md:pt-64 md:pb-72">
      {/* 메디모아 스타일 조약돌 모양 SVG 배경 */}
      <div className="absolute inset-0">
        <svg 
          className="absolute inset-0 w-full h-full" 
          preserveAspectRatio="none" 
          viewBox="0 0 100 100"
        >
          <defs>
            <linearGradient id="stoneGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgb(255, 224, 224)" />
              <stop offset="40%" stopColor="rgb(248, 215, 218)" />
              <stop offset="80%" stopColor="rgb(245, 198, 203)" />
              <stop offset="100%" stopColor="rgb(240, 160, 168)" />
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
            fill="url(#stoneGradient)" 
            opacity="0.75"
          />
        </svg>
      </div>
      
      <div className="w-full relative z-10">
        {/* 섹션 제목 */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">
            <span className="text-wizfore-text-primary">위즈포레</span> <span className="text-wizfore-coral-primary">프로그램</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {programCategories.map((category, index) => {
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
                  <div className={`relative h-64 w-full shadow-md hover:shadow-xl transition-all duration-300 group-hover:scale-105 overflow-hidden rounded-2xl ${fallbackGradient}`}>
                    {/* 배경 이미지 */}
                    <CategoryImage 
                      categoryImageUrl={category.imageUrl}
                      defaultImageUrl={defaultImageUrl}
                      alt={`${category.title || category.heroMessage?.title} 프로그램`}
                    />
                    {/* 어두운 필터 오버레이 */}
                    <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-all duration-300 z-5"></div>
                    
                    {/* 왼쪽 하단 텍스트 오버레이 */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 z-10">
                      <h2 className="text-white text-lg font-bold mb-2 drop-shadow-lg ml-2">
                        {category.title || category.heroMessage?.title}
                      </h2>
                      <p className="text-white/90 text-sm drop-shadow-md line-clamp-2 ml-2">
                        {category.description || category.heroMessage?.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default CategoryCards
