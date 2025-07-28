'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useMemo } from 'react'
import type { Milestone, HistoryStats } from '@/types'

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
          m.event.includes('업무협약') || m.event.includes('산학협력')
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

  // 아이콘 경로 결정 함수
  const getIconPath = (card: any): string => {
    return (card.iconPath && card.iconPath.trim() !== '') ? card.iconPath : card.defaultIconPath
  }

  return (
    <section className="py-16 bg-gradient-to-b from-wizfore-light-beige to-wizfore-soft-pink/30">
      <div className="container-custom mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-wizfore-text-primary mb-4">
            {stats.title}
          </h2>
          <p className="text-wizfore-text-secondary">
            {stats.description}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {enabledCards.map((card, index) => (
            <motion.div
              key={card.id}
              className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 border-2 border-gray-300 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Image 
                  src={getIconPath(card)}
                  alt={card.title}
                  width={32} 
                  height={32}
                  className="opacity-70"
                />
              </div>
              <div className="text-4xl font-bold text-wizfore-text-primary mb-3">
                {getStatValue(card.id)}
              </div>
              <h3 className="text-wizfore-coral-primary font-semibold text-lg mb-2">
                {card.title}
              </h3>
              <p className="text-wizfore-text-secondary text-sm leading-relaxed">
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