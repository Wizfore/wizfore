'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import CommonHeroSection from '@/components/layout/CommonHeroSection'
import FacilityGallerySection from '@/components/about/center-tour/FacilityGallerySection'
import { facilityService } from '@/lib/services/facilityService'
import { getImageWithFallback } from '@/lib/utils/imageUtils'
import { FacilityCategory, FacilityImage } from '@/types'

interface HeroData {
  title: string
  description: string
  imageUrl: string
  defaultImageUrl: string
}

interface FacilityData {
  hero: HeroData
  categories: FacilityCategory[]
  images: FacilityImage[]
}

export default function CenterTourPage() {
  const [data, setData] = useState<FacilityData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFacilityData = async () => {
      try {
        setLoading(true)
        const facilityData = await facilityService.getFacilities()
        setData(facilityData)
        setError(null)
      } catch (err) {
        console.error('센터 둘러보기 데이터 로딩 실패:', err)
        setError('센터 둘러보기 정보를 불러오는데 실패했습니다.')
        
        // 에러 시 기본값 설정
        setData({
          hero: {
            title: "센터 둘러보기",
            description: "다양한 시설과 환경을 만나보세요",
            imageUrl: "",
            defaultImageUrl: "/images/hero/defaultHero.jpg"
          },
          categories: [],
          images: []
        })
      } finally {
        setLoading(false)
      }
    }

    fetchFacilityData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-wizfore-coral-primary via-wizfore-soft-pink to-wizfore-cream-pink flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-3 border-white border-t-transparent rounded-full"
            />
          </div>
          <p className="text-white text-xl font-semibold">센터 둘러보기를 불러오는 중...</p>
        </motion.div>
      </div>
    )
  }

  if (error && !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-lg mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-wizfore-coral-primary text-white rounded-lg hover:bg-wizfore-coral-primary/90 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-lg">센터 둘러보기 정보를 불러올 수 없습니다.</p>
        </div>
      </div>
    )
  }

  const { hero, categories, images } = data

  return (
    <div className="min-h-screen bg-white">
      {/* 히어로 섹션 */}
      <CommonHeroSection 
        title={hero?.title || "센터 둘러보기"}
        description={hero?.description || "다양한 시설과 환경을 만나보세요"}
        backgroundImage={getImageWithFallback(hero?.imageUrl, hero?.defaultImageUrl)}
      />
      
      {/* 시설 갤러리 섹션 */}
      <FacilityGallerySection 
        categories={categories}
        images={images}
      />
    </div>
  )
}