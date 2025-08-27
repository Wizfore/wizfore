'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useMemo } from 'react'
import type { Milestone, HistoryStats } from '@/types'
import { getImageWithFallback } from '@/lib/utils/imageUtils'

interface StatsSectionProps {
  milestones?: Milestone[]
  stats?: HistoryStats | null
}

const StatsSection: React.FC<StatsSectionProps> = ({ milestones = [], stats }) => {

  // milestones에서 가장 이른 연도를 설립연도로 사용
  const establishedYear = useMemo(() => {
    if (milestones.length === 0) return 2016
    
    const years = milestones.map(milestone => {
      const yearMatch = milestone.year.match(/(\d{4})/)
      return yearMatch ? parseInt(yearMatch[1]) : 2016
    })
    
    return Math.min(...years)
  }, [milestones])

  // 설립연도에서 현재까지의 운영연수 계산
  const operatingYears = useMemo(() => {
    const currentYear = new Date().getFullYear()
    return currentYear - establishedYear + 1
  }, [establishedYear])

  // stats가 없으면 컴포넌트를 렌더링하지 않음
  if (!stats) {
    return null
  }

  // 활성화된 카드들만 순서대로 정렬
  const enabledCards = stats.cards
    .filter(card => card.enabled)
    .sort((a, b) => a.order - b.order)

  // 통계 값 계산 함수
  const getStatValue = (cardId: string): string => {
    switch (cardId) {
      case 'establishment':
        return String(milestones.filter(m => 
          m.event.includes('설립') || m.event.includes('등록') || m.event.includes('지정')
        ).length)
      case 'partnership':
        return String(milestones.filter(m => 
          m.event.includes('협약') || m.event.includes('협력')
        ).length)
      case 'award':
        return String(milestones.filter(m => 
          m.event.includes('수상') || m.event.includes('표창')
        ).length)
      case 'duration':
        return `${operatingYears}년`
      default:
        return '0'
    }
  }

  return (
    <section className="py-16 bg-white">
      <div className="container-custom mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-wizfore-text-primary mb-4">
            {stats.title}
          </h2>
          <p className="text-sm md:text-base text-wizfore-text-secondary">
            {stats.description}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
          {enabledCards.map((card) => (
            <motion.div
              key={card.id}
              className="group text-center p-4 md:p-6 lg:p-8 rounded-2xl bg-gradient-to-br from-white to-gray-50/50 border border-wizfore-coral-primary/10 shadow-sm transition-all duration-500 hover:shadow-lg hover:-translate-y-2 hover:border-wizfore-coral-primary/40 hover:ring-2 hover:ring-wizfore-coral-primary hover:ring-opacity-30 focus-within:ring-2 focus-within:ring-wizfore-coral-primary focus-within:ring-opacity-50 motion-reduce:transition-none motion-reduce:hover:transform-none motion-reduce:hover:scale-100"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              tabIndex={0}
              role="article"
            >
              <div className="w-12 h-12 md:w-14 lg:w-16 md:h-14 lg:h-16 border-2 border-gray-300 rounded-xl flex items-center justify-center mx-auto mb-4 md:mb-6">
                <Image 
                  src={getImageWithFallback(card.iconPath, card.defaultIconPath)}
                  alt={card.title}
                  width={24} 
                  height={24}
                  className="opacity-70 w-6 h-6 md:w-7 lg:w-8 md:h-7 lg:h-8"
                />
              </div>
              <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-wizfore-text-primary mb-2 md:mb-3">
                {getStatValue(card.id)}
              </div>
              <h3 className="text-wizfore-coral-primary font-semibold text-base md:text-lg mb-2">
                {card.title}
              </h3>
              <p className="text-wizfore-text-secondary text-xs md:text-sm leading-relaxed">
                {card.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default StatsSection