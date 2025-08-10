'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { FacilityCategory, FacilityImage } from '@/types'

interface FacilityGallerySectionProps {
  categories: FacilityCategory[]
  images: FacilityImage[]
}

const FacilityGallerySection = ({ categories, images }: FacilityGallerySectionProps) => {
  const [activeTab, setActiveTab] = useState('')
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  // props로 받은 데이터 사용
  const facilityCategories = categories
  const facilityImages = images

  // 첫 번째 카테고리를 기본 활성 탭으로 설정
  useEffect(() => {
    if (facilityCategories.length > 0 && !activeTab) {
      const firstCategory = facilityCategories.sort((a, b) => a.order - b.order)[0]
      setActiveTab(firstCategory.id)
    }
  }, [facilityCategories, activeTab])

  // 현재 활성 카테고리의 이미지들을 필터링하고 순서대로 정렬
  const currentImages = facilityImages
    .filter(image => image.categoryId === activeTab)
    .sort((a, b) => a.order - b.order)
  
  const currentImage = currentImages[activeImageIndex] || currentImages[0]

  // 탭 변경 시 이미지 인덱스 초기화
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    setActiveImageIndex(0)
  }

  // 이미지 네비게이션
  const goToImage = (index: number) => {
    setActiveImageIndex(index)
  }

  const nextImage = () => {
    const nextIndex = (activeImageIndex + 1) % currentImages.length
    setActiveImageIndex(nextIndex)
  }

  const prevImage = () => {
    const prevIndex = (activeImageIndex - 1 + currentImages.length) % currentImages.length
    setActiveImageIndex(prevIndex)
  }



  // 데이터가 없는 경우
  if (facilityCategories.length === 0 || facilityImages.length === 0) {
    return (
      <section className="pt-24 pb-16 bg-white">
        <div className="container-custom mx-auto px-4">
          <div className="flex items-center justify-center py-32">
            <div className="text-center">
              <p className="text-wizfore-text-secondary text-lg">시설 이미지가 없습니다.</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="pt-16 pb-16 bg-white">
      <div className="container-custom mx-auto px-4">
        {/* 탭 메뉴 */}
        <div className="flex justify-center mb-16" role="tablist" aria-label="시설 종류">
          <div className="flex bg-white rounded-xl p-1 md:p-2 shadow-lg border border-gray-200">
            {facilityCategories
              .sort((a, b) => a.order - b.order)
              .map((category) => (
              <button
                key={category.id}
                onClick={() => handleTabChange(category.id)}
                className={`px-3 py-2 md:px-6 lg:px-8 md:py-3 rounded-lg font-semibold text-sm md:text-base transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-wizfore-coral-primary focus:ring-offset-2 ${
                  activeTab === category.id
                    ? 'bg-wizfore-coral-primary text-white shadow-md'
                    : 'text-wizfore-text-secondary hover:text-wizfore-coral-primary hover:bg-gray-50'
                }`}
                role="tab"
                aria-selected={activeTab === category.id}
                aria-controls={`panel-${category.id}`}
                id={`tab-${category.id}`}
                tabIndex={activeTab === category.id ? 0 : -1}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* 메인 갤러리 */}
        <div 
          className="max-w-5xl mx-auto"
          role="tabpanel"
          aria-label="시설 이미지 갤러리"
          aria-labelledby={`tab-${activeTab}`}
          id={`panel-${activeTab}`}
        >
          
          {/* 메인 이미지 영역 */}
          <div className="relative mb-8">
            <div 
              className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-white shadow-lg"
              role="img"
              aria-label={currentImage?.description || ''}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeTab}-${activeImageIndex}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={currentImage?.imageUrl || ''}
                    alt={currentImage?.description || ''}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 1200px"
                    priority
                  />
                </motion.div>
              </AnimatePresence>
              
              {/* 화살표 컨트롤 */}
              {currentImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-1 top-1/2 -translate-y-1/2 text-white hover:text-gray-200 transition-all duration-200 focus:outline-none p-2 drop-shadow-lg"
                    aria-label={`이전 이미지로 이동 (현재 ${activeImageIndex + 1}/${currentImages.length})`}
                  >
                    <ChevronLeft className="w-8 h-8 md:w-10 lg:w-12 md:h-10 lg:h-12 filter drop-shadow-md" strokeWidth={3} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-1 top-1/2 -translate-y-1/2 text-white hover:text-gray-200 transition-all duration-200 focus:outline-none p-2 drop-shadow-lg"
                    aria-label={`다음 이미지로 이동 (현재 ${activeImageIndex + 1}/${currentImages.length})`}
                  >
                    <ChevronRight className="w-8 h-8 md:w-10 lg:w-12 md:h-10 lg:h-12 filter drop-shadow-md" strokeWidth={3} />
                  </button>
                </>
              )}
            </div>
            
            {/* 이미지 정보 */}
            <div className="mt-6 text-center">
              <motion.p 
                key={`desc-${activeTab}-${activeImageIndex}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-sm md:text-base lg:text-lg text-wizfore-text-secondary leading-relaxed max-w-2xl mx-auto min-h-[1.75rem]"
              >
                {currentImage?.description || ''}
              </motion.p>
            </div>
          </div>

          {/* 썸네일 네비게이션 */}
          <div className="relative" aria-label="이미지 썸네일 목록">
            <div className="flex justify-center gap-3 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {currentImages.map((image, index) => (
                <motion.button
                  key={image.id}
                  onClick={() => goToImage(index)}
                  className={`flex-shrink-0 relative rounded-lg overflow-hidden transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-wizfore-coral-primary focus:ring-offset-2 ${
                    index === activeImageIndex
                      ? 'ring-3 ring-wizfore-coral-primary ring-offset-2 shadow-lg'
                      : 'hover:shadow-md hover:scale-105'
                  }`}
                  whileHover={{ scale: index === activeImageIndex ? 1 : 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={`${image.description} 썸네일 (${index + 1}/${currentImages.length})`}
                >
                  <div className="w-16 h-12 md:w-20 lg:w-24 md:h-14 lg:h-16 relative">
                    <Image
                      src={image.imageUrl}
                      alt={image.description || ''}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 64px, (max-width: 1024px) 80px, 96px"
                    />
                    {index !== activeImageIndex && (
                      <div className="absolute inset-0 bg-black/20" />
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
            
            {/* 이미지 카운터 */}
            <div className="text-center mt-4" role="status" aria-live="polite">
              <span className="text-sm text-wizfore-text-light">
                {activeImageIndex + 1} / {currentImages.length}
              </span>
              <span className="sr-only">
                {currentImages.length}개 이미지 중 {activeImageIndex + 1}번째 이미지
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FacilityGallerySection