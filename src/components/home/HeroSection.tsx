'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play } from 'lucide-react'
import { getHomeConfig } from '@/lib/services/dataService'
import { defaultHomeConfig } from '@/lib/data/defaultHomeConfig'
import type { HeroSlide } from '@/types'

interface HeroSectionProps {
  heroData?: {
    slides: HeroSlide[]
    autoPlay: boolean
  }
}

const HeroSection: React.FC<HeroSectionProps> = ({ heroData }) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true)
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [loading, setLoading] = useState(!heroData)

  useEffect(() => {
    const initializeHero = async () => {
      if (heroData) {
        // Props로 받은 데이터 사용
        setSlides(heroData.slides)
        setIsAutoPlaying(heroData.autoPlay)
        setLoading(false)
      } else {
        // 클라이언트에서 데이터 가져오기 (폴백)
        try {
          const homeConfig = await getHomeConfig()
          // sections.hero 또는 기존 hero에서 데이터 가져오기
          const heroData = (homeConfig as any).sections?.hero || (homeConfig as any).hero
          const slides = heroData?.slides || []
          const enabledSlides = slides
            .filter((slide: any) => slide.enabled)
            .sort((a: any, b: any) => a.order - b.order)
          
          setSlides(enabledSlides)
          setIsAutoPlaying(heroData?.autoPlay ?? true)
        } catch (error) {
          console.error('Error fetching hero data, using fallback:', error)
          // DB 실패 시 기본 데이터 사용
          setSlides(defaultHomeConfig.hero?.slides || [])
          setIsAutoPlaying(defaultHomeConfig.hero?.autoPlay ?? true)
        } finally {
          setLoading(false)
        }
      }
    }

    initializeHero()
  }, [heroData])

  useEffect(() => {
    if (!isAutoPlaying || slides.length === 0) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, slides.length])

  const goToSlide = (index: number): void => {
    setCurrentSlide(index)
  }


  if (loading || slides.length === 0) {
    return (
      <section className="relative h-[60vh] md:h-[70vh] lg:h-[calc(100vh-5rem)] overflow-hidden px-4 md:px-8 lg:px-16 pb-24 md:pb-32 lg:pb-40">
        <div 
          className="relative h-full w-full bg-wizfore-light-beige rounded-[3rem]"
        >
          <div className="h-full flex items-center justify-center">
            <div className="text-center max-w-4xl mx-auto px-4">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-wizfore-text-primary">
                위즈포레 사회서비스센터
              </h1>
              <p className="text-lg md:text-xl text-wizfore-text-secondary leading-relaxed">
                함께 어우러지는 지혜의 숲에서 전문적인 사회서비스를 제공합니다.
              </p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  const currentSlideData = slides[currentSlide] || slides[0]
  const backgroundImageUrl = currentSlideData?.backgroundImage || '/images/hero/defaultHero.jpg'

  return (
    <section className="relative h-[60vh] md:h-[70vh] lg:h-[calc(100vh-5rem)] overflow-hidden px-4 md:px-8 lg:px-16 pb-24 md:pb-32 lg:pb-40">
      <div className="absolute inset-x-4 md:inset-x-8 lg:inset-x-16 top-0 bottom-4 md:bottom-8 lg:bottom-16 rounded-[3rem] overflow-hidden border-2 border-white">
            <div 
              className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out"
              style={{
                backgroundImage: `url('${backgroundImageUrl}')`
              }}
            />
            {/* 김포 스타일 부드러운 오버레이 */}
            <div className="absolute inset-0 bg-gradient-to-br from-gcf-primary/20 via-gcf-secondary/10 to-gcf-accent/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="relative z-10 h-full">
              
              {/* 메인 콘텐츠 텍스트 - 카테고리 박스 위 */}
              <div className="absolute bottom-24 sm:bottom-36 md:bottom-52 left-4 sm:left-6 md:left-8 lg:left-10 right-4 sm:right-6 md:right-12 lg:right-16 z-20 px-2 sm:px-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`text-${currentSlide}`}
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -30, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="text-left"
                  >
                  <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-3 sm:mb-4 text-white font-bold drop-shadow-lg leading-tight">
                    {currentSlideData.title}
                  </h1>
                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 leading-relaxed drop-shadow-lg">
                    {currentSlideData.description}
                  </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* 자동재생 버튼 - 사진 영역 내부 */}
              <button
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className="absolute bottom-4 md:bottom-6 lg:bottom-8 right-4 md:right-6 lg:right-8 z-30 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center text-wizfore-text-primary transition-all duration-300 shadow-lg"
                aria-label={isAutoPlaying ? '자동재생 정지' : '자동재생 시작'}
              >
                {isAutoPlaying ? (
                  <div className="flex space-x-1">
                    <div className="w-1 h-4 bg-wizfore-text-primary rounded-full" />
                    <div className="w-1 h-4 bg-wizfore-text-primary rounded-full" />
                  </div>
                ) : (
                  <Play size={16} className="ml-0.5" />
                )}
              </button>
            </div>
      </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-wizfore-warm-brown scale-125' 
                  : 'bg-wizfore-text-light hover:bg-wizfore-text-secondary'
              }`}
              aria-label={`슬라이드 ${index + 1}로 이동`}
            />
          ))}
        </div>


    </section>
  )
}

export default HeroSection