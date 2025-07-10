'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { getAllProgramsFlattened, getProgramsGridConfig } from '@/lib/services/dataService'
import Marquee from '@/components/ui/marquee'
import { 
  Brain, 
  Heart, 
  Users, 
  Target, 
  Lightbulb, 
  Star,
  MessageCircle,
  Activity
} from 'lucide-react'

// 프로그램 아이콘 및 색상 매핑
const programIconsAndColors = [
  { icon: Brain, bgColor: 'bg-[rgb(254,243,239)]', hoverColor: 'bg-[rgb(254,243,239)]' },      // 인지/학습
  { icon: Heart, bgColor: 'bg-[rgb(254,243,239)]', hoverColor: 'bg-[rgb(254,243,239)]' },      // 정서/심리
  { icon: Users, bgColor: 'bg-[rgb(254,243,239)]', hoverColor: 'bg-[rgb(254,243,239)]' },    // 사회성
  { icon: Target, bgColor: 'bg-[rgb(254,243,239)]', hoverColor: 'bg-[rgb(254,243,239)]' }, // 목표달성
  { icon: Lightbulb, bgColor: 'bg-[rgb(254,243,239)]', hoverColor: 'bg-[rgb(254,243,239)]' }, // 창의성
  { icon: Star, bgColor: 'bg-[rgb(254,243,239)]', hoverColor: 'bg-[rgb(254,243,239)]' },   // 특성화
  { icon: MessageCircle, bgColor: 'bg-[rgb(254,243,239)]', hoverColor: 'bg-[rgb(254,243,239)]' }, // 상담
  { icon: Activity, bgColor: 'bg-[rgb(254,243,239)]', hoverColor: 'bg-[rgb(254,243,239)]' }      // 활동
]

interface Program {
  title: string
  description: string
  categoryTitle: string
  categoryId: string
  order: number
}

const ProgramGrid = () => {
  const [programs, setPrograms] = useState<Program[]>([])
  const [gridConfig, setGridConfig] = useState<{
    title: string
    description: string
    enabled: boolean
  }>({
    title: "세부 전문 프로그램",
    description: "개별적 특성과 발달 단계에 맞춘 체계적이고 전문적인 치료 프로그램을 제공합니다",
    enabled: true
  })
  const [loading, setLoading] = useState(true)
  const [isDragging, setIsDragging] = useState({ row1: false, row2: false })
  const [startX, setStartX] = useState({ row1: 0, row2: 0 })
  const [startScrollLeft, setStartScrollLeft] = useState({ row1: 0, row2: 0 })
  const [dragStarted, setDragStarted] = useState({ row1: false, row2: false })
  const [isAnimationPaused, setIsAnimationPaused] = useState({ row1: false, row2: false })
  const [resumeTimer, setResumeTimer] = useState<{ row1: NodeJS.Timeout | null, row2: NodeJS.Timeout | null }>({ row1: null, row2: null })
  
  const row1Ref = useRef<HTMLDivElement>(null)
  const row2Ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [programData, configData] = await Promise.all([
          getAllProgramsFlattened(),
          getProgramsGridConfig()
        ])
        setPrograms(programData)
        setGridConfig(configData)
      } catch (error) {
        console.error('Error fetching programs data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // 타이머 정리 함수
  const clearResumeTimer = (row: 'row1' | 'row2') => {
    if (resumeTimer[row]) {
      clearTimeout(resumeTimer[row]!)
      setResumeTimer(prev => ({ ...prev, [row]: null }))
    }
  }

  // 애니메이션 재개 함수
  const scheduleAnimationResume = (row: 'row1' | 'row2') => {
    clearResumeTimer(row)
    const timer = setTimeout(() => {
      setIsAnimationPaused(prev => ({ ...prev, [row]: false }))
    }, 1000)
    setResumeTimer(prev => ({ ...prev, [row]: timer }))
  }

  // 드래그 이벤트 핸들러
  const handleMouseDown = (e: React.MouseEvent, row: 'row1' | 'row2') => {
    const containerRef = row === 'row1' ? row1Ref : row2Ref
    if (!containerRef.current) return

    setStartX(prev => ({ ...prev, [row]: e.clientX }))
    setStartScrollLeft(prev => ({ ...prev, [row]: containerRef.current!.scrollLeft }))
    setDragStarted(prev => ({ ...prev, [row]: false }))
  }

  const handleMouseMove = (e: React.MouseEvent, row: 'row1' | 'row2') => {
    if (!startX[row]) return
    
    const containerRef = row === 'row1' ? row1Ref : row2Ref
    if (!containerRef.current) return

    const deltaX = Math.abs(e.clientX - startX[row])
    
    // 5px 이상 움직였을 때만 드래그로 인식
    if (deltaX > 5 && !dragStarted[row]) {
      setDragStarted(prev => ({ ...prev, [row]: true }))
      setIsDragging(prev => ({ ...prev, [row]: true }))
      setIsAnimationPaused(prev => ({ ...prev, [row]: true }))
      clearResumeTimer(row)
    }

    if (dragStarted[row]) {
      const moveX = e.clientX - startX[row]
      let newScrollLeft = startScrollLeft[row] - moveX
      
      // 양방향 무한 스크롤을 위한 순환 처리
      const maxScroll = containerRef.current.scrollWidth - containerRef.current.clientWidth
      if (newScrollLeft < 0) {
        newScrollLeft = maxScroll + newScrollLeft
      } else if (newScrollLeft > maxScroll) {
        newScrollLeft = newScrollLeft - maxScroll
      }
      
      containerRef.current.scrollLeft = newScrollLeft
    }
  }

  const handleMouseUp = (row: 'row1' | 'row2') => {
    if (dragStarted[row]) {
      setIsDragging(prev => ({ ...prev, [row]: false }))
      scheduleAnimationResume(row)
    }
    setStartX(prev => ({ ...prev, [row]: 0 }))
    setDragStarted(prev => ({ ...prev, [row]: false }))
  }

  // 터치 이벤트 핸들러
  const handleTouchStart = (e: React.TouchEvent, row: 'row1' | 'row2') => {
    const containerRef = row === 'row1' ? row1Ref : row2Ref
    if (!containerRef.current) return

    setStartX(prev => ({ ...prev, [row]: e.touches[0].clientX }))
    setStartScrollLeft(prev => ({ ...prev, [row]: containerRef.current!.scrollLeft }))
    setDragStarted(prev => ({ ...prev, [row]: false }))
  }

  const handleTouchMove = (e: React.TouchEvent, row: 'row1' | 'row2') => {
    if (!startX[row]) return
    
    const containerRef = row === 'row1' ? row1Ref : row2Ref
    if (!containerRef.current) return

    const deltaX = Math.abs(e.touches[0].clientX - startX[row])
    
    // 5px 이상 움직였을 때만 드래그로 인식
    if (deltaX > 5 && !dragStarted[row]) {
      setDragStarted(prev => ({ ...prev, [row]: true }))
      setIsDragging(prev => ({ ...prev, [row]: true }))
      setIsAnimationPaused(prev => ({ ...prev, [row]: true }))
      clearResumeTimer(row)
    }

    if (dragStarted[row]) {
      const moveX = e.touches[0].clientX - startX[row]
      let newScrollLeft = startScrollLeft[row] - moveX
      
      // 양방향 무한 스크롤을 위한 순환 처리
      const maxScroll = containerRef.current.scrollWidth - containerRef.current.clientWidth
      if (newScrollLeft < 0) {
        newScrollLeft = maxScroll + newScrollLeft
      } else if (newScrollLeft > maxScroll) {
        newScrollLeft = newScrollLeft - maxScroll
      }
      
      containerRef.current.scrollLeft = newScrollLeft
    }
  }

  const handleTouchEnd = (row: 'row1' | 'row2') => {
    if (dragStarted[row]) {
      setIsDragging(prev => ({ ...prev, [row]: false }))
      scheduleAnimationResume(row)
    }
    setStartX(prev => ({ ...prev, [row]: 0 }))
    setDragStarted(prev => ({ ...prev, [row]: false }))
  }

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (resumeTimer.row1) clearTimeout(resumeTimer.row1)
      if (resumeTimer.row2) clearTimeout(resumeTimer.row2)
    }
  }, [resumeTimer.row1, resumeTimer.row2])

  if (loading) {
    return (
      <section className="py-24 bg-wizfore-light-beige">
        <div className="container-custom mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-10 bg-gray-300 rounded w-80 mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-[32rem] mx-auto animate-pulse"></div>
          </div>
          <div className="w-full max-w-6xl mx-auto">
            <Marquee pauseOnHover className="[--duration:30s]">
              {[...Array(8)].map((_, index) => (
                <div 
                  key={index} 
                  className="w-80 h-24 bg-white border border-gray-200 rounded-lg mx-3 animate-pulse"
                ></div>
              ))}
            </Marquee>
          </div>
        </div>
      </section>
    )
  }

  // enabled가 false면 섹션을 렌더링하지 않음
  if (!gridConfig.enabled) {
    return null
  }

  return (
    <section className="py-24 md:py-32 lg:py-40 bg-wizfore-light-beige">
      <div className="container-custom mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-wizfore-text-primary mb-4">
            {gridConfig.title}
          </h2>
          <p className="text-lg text-wizfore-text-secondary max-w-2xl mx-auto">
            {gridConfig.description}
          </p>
        </motion.div>

        {/* 프로그램 마키 레이아웃 */}
        <div className="relative w-full px-4 space-y-6 overflow-hidden">
          {/* 그라데이션 마스크 - 왼쪽과 오른쪽 가장자리 */}
          <div className="absolute left-0 top-4 w-20 h-full bg-gradient-to-r from-wizfore-light-beige to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-4 w-20 h-full bg-gradient-to-l from-wizfore-light-beige to-transparent z-10 pointer-events-none"></div>
          {/* 첫 번째 마키 - 정방향 */}
          <div 
            ref={row1Ref}
            className="cursor-grab active:cursor-grabbing select-none overflow-x-auto overflow-y-visible scrollbar-hide"
            style={{ 
              scrollBehavior: isDragging.row1 ? 'auto' : 'smooth',
              WebkitOverflowScrolling: 'touch'
            }}
            onMouseDown={(e) => handleMouseDown(e, 'row1')}
            onMouseMove={(e) => handleMouseMove(e, 'row1')}
            onMouseUp={() => handleMouseUp('row1')}
            onMouseLeave={() => handleMouseUp('row1')}
            onTouchStart={(e) => handleTouchStart(e, 'row1')}
            onTouchMove={(e) => handleTouchMove(e, 'row1')}
            onTouchEnd={() => handleTouchEnd('row1')}
          >
            <div 
              className={`flex gap-4 py-2 ${isAnimationPaused.row1 ? '' : 'animate-marquee-scroll'}`}
              style={{ 
                width: 'max-content',
                animationDuration: '60s',
                animationIterationCount: 'infinite',
                animationTimingFunction: 'linear'
              }}
            >
            {/* 카드들을 반복해서 렌더링 */}
            {[...Array(15)].flatMap((_, repeatIndex) => 
              programs.slice(0, Math.ceil(programs.length / 2)).map((program, index) => {
                const iconData = programIconsAndColors[index % programIconsAndColors.length]
                const IconComponent = iconData.icon
              
                // 설명 텍스트를 더 짧게 제한
                const truncatedDescription = program.description.length > 80 
                  ? program.description.substring(0, 80) + '...'
                  : program.description
                
                return (
                  <motion.div
                    key={`row1-${repeatIndex}-${program.title}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.5, 
                      delay: index * 0.1
                    }}
                    viewport={{ once: true }}
                    className="group cursor-pointer"
                    style={{ flexShrink: 0 }}
                  >
                    {/* 메인 카드 */}
                    <motion.div
                      whileHover={{ 
                        scale: 1.02,
                        y: -4
                      }}
                      transition={{ 
                        duration: 0.2, 
                        ease: "easeOut"
                      }}
                      className="bg-white border border-wizfore-coral-200 hover:border-wizfore-coral-300 rounded-lg p-6 w-80 h-24 flex items-center gap-4 shadow-sm hover:shadow-md transition-all duration-300 select-none"
                    >
                      {/* 왼쪽 아이콘 영역 */}
                      <div className={`flex-shrink-0 w-12 h-12 ${iconData.bgColor} group-hover:${iconData.hoverColor} rounded-lg flex items-center justify-center transition-colors duration-300`}>
                        <IconComponent className="w-6 h-6 text-black" />
                      </div>

                      {/* 오른쪽 텍스트 영역 */}
                      <div className="flex-1 min-w-0">
                        {/* 프로그램 제목 */}
                        <h3 className="text-base font-semibold text-wizfore-text-primary group-hover:text-wizfore-text-brand transition-colors duration-300 mb-1 truncate">
                          {program.title}
                        </h3>
                        
                        {/* 프로그램 설명 */}
                        <p className="text-sm text-wizfore-text-secondary group-hover:text-wizfore-text-primary transition-colors duration-300 line-clamp-1">
                          {truncatedDescription}
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>
                )
              })
            )}
            </div>
          </div>
          
          {/* 두 번째 마키 - 역방향 */}
          <div 
            ref={row2Ref}
            className="cursor-grab active:cursor-grabbing select-none overflow-x-auto overflow-y-visible scrollbar-hide"
            style={{ 
              scrollBehavior: isDragging.row2 ? 'auto' : 'smooth',
              WebkitOverflowScrolling: 'touch'
            }}
            onMouseDown={(e) => handleMouseDown(e, 'row2')}
            onMouseMove={(e) => handleMouseMove(e, 'row2')}
            onMouseUp={() => handleMouseUp('row2')}
            onMouseLeave={() => handleMouseUp('row2')}
            onTouchStart={(e) => handleTouchStart(e, 'row2')}
            onTouchMove={(e) => handleTouchMove(e, 'row2')}
            onTouchEnd={() => handleTouchEnd('row2')}
          >
            <div 
              className={`flex gap-4 py-2 ${isAnimationPaused.row2 ? '' : 'animate-marquee-scroll-reverse'}`}
              style={{ 
                width: 'max-content',
                animationDuration: '70s',
                animationIterationCount: 'infinite',
                animationTimingFunction: 'linear'
              }}
            >
            {/* 카드들을 반복해서 렌더링 */}
            {[...Array(15)].flatMap((_, repeatIndex) => 
              programs.slice(Math.ceil(programs.length / 2)).reverse().map((program, index) => {
                const iconData = programIconsAndColors[(index + Math.ceil(programs.length / 2)) % programIconsAndColors.length]
                const IconComponent = iconData.icon
              
                // 설명 텍스트를 더 짧게 제한
                const truncatedDescription = program.description.length > 80 
                  ? program.description.substring(0, 80) + '...'
                  : program.description
                
                return (
                  <motion.div
                    key={`row2-${repeatIndex}-${program.title}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.5, 
                      delay: index * 0.1
                    }}
                    viewport={{ once: true }}
                    className="group cursor-pointer"
                    style={{ flexShrink: 0 }}
                  >
                    {/* 메인 카드 */}
                    <motion.div
                      whileHover={{ 
                        scale: 1.02,
                        y: -4
                      }}
                      transition={{ 
                        duration: 0.2, 
                        ease: "easeOut"
                      }}
                      className="bg-white border border-wizfore-coral-200 hover:border-wizfore-coral-300 rounded-lg p-6 w-80 h-24 flex items-center gap-4 shadow-sm hover:shadow-md transition-all duration-300 select-none"
                    >
                      {/* 왼쪽 아이콘 영역 */}
                      <div className={`flex-shrink-0 w-12 h-12 ${iconData.bgColor} group-hover:${iconData.hoverColor} rounded-lg flex items-center justify-center transition-colors duration-300`}>
                        <IconComponent className="w-6 h-6 text-black" />
                      </div>

                      {/* 오른쪽 텍스트 영역 */}
                      <div className="flex-1 min-w-0">
                        {/* 프로그램 제목 */}
                        <h3 className="text-base font-semibold text-wizfore-text-primary group-hover:text-wizfore-text-brand transition-colors duration-300 mb-1 truncate">
                          {program.title}
                        </h3>
                        
                        {/* 프로그램 설명 */}
                        <p className="text-sm text-wizfore-text-secondary group-hover:text-wizfore-text-primary transition-colors duration-300 line-clamp-1">
                          {truncatedDescription}
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>
                )
              })
            )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProgramGrid