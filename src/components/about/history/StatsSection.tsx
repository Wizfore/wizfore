'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useMemo } from 'react'
import type { Milestone } from '@/types'

interface StatsSectionProps {
  milestones?: Milestone[]
}

const StatsSection: React.FC<StatsSectionProps> = ({ milestones = [] }) => {

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

  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-wizfore-text-primary mb-4">
            성장 통계
          </h2>
          <p className="text-wizfore-text-secondary">
            지난 {operatingYears}년간의 주요 성과를 숫자로 확인해보세요
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <motion.div
            className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition-all duration-300"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <div className="w-16 h-16 border-2 border-gray-300 rounded-xl flex items-center justify-center mx-auto mb-6">
              <Image 
                src="/icons/history/establishment.png" 
                alt="설립" 
                width={32} 
                height={32}
                className="opacity-70"
              />
            </div>
            <div className="text-4xl font-bold text-wizfore-text-primary mb-3">
              {milestones.filter(m => m.event.includes('설립') || m.event.includes('등록') || m.event.includes('지정')).length}
            </div>
            <h3 className="text-wizfore-coral-primary font-semibold text-lg mb-2">서비스 설립 및 지정</h3>
            <p className="text-wizfore-text-secondary text-sm leading-relaxed">
              다양한 사회서비스 분야의 설립과 지정을 통한 전문성 확보
            </p>
          </motion.div>

          <motion.div
            className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition-all duration-300"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="w-16 h-16 border-2 border-gray-300 rounded-xl flex items-center justify-center mx-auto mb-6">
              <Image 
                src="/icons/history/partnership.png" 
                alt="협력" 
                width={32} 
                height={32}
                className="opacity-70"
              />
            </div>
            <div className="text-4xl font-bold text-wizfore-text-primary mb-3">
              {milestones.filter(m => m.event.includes('업무협약') || m.event.includes('산학협력')).length}
            </div>
            <h3 className="text-wizfore-coral-primary font-semibold text-lg mb-2">협력 관계 구축</h3>
            <p className="text-wizfore-text-secondary text-sm leading-relaxed">
              전문기관과의 업무협약을 통한 서비스 품질 향상
            </p>
          </motion.div>

          <motion.div
            className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition-all duration-300"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="w-16 h-16 border-2 border-gray-300 rounded-xl flex items-center justify-center mx-auto mb-6">
              <Image 
                src="/icons/history/award.png" 
                alt="수상" 
                width={32} 
                height={32}
                className="opacity-70"
              />
            </div>
            <div className="text-4xl font-bold text-wizfore-text-primary mb-3">
              {milestones.filter(m => m.event.includes('수상') || m.event.includes('표창')).length}
            </div>
            <h3 className="text-wizfore-coral-primary font-semibold text-lg mb-2">수상 및 표창</h3>
            <p className="text-wizfore-text-secondary text-sm leading-relaxed">
              우수한 서비스 운영으로 받은 각종 수상과 표창
            </p>
          </motion.div>

          <motion.div
            className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition-all duration-300"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="w-16 h-16 border-2 border-gray-300 rounded-xl flex items-center justify-center mx-auto mb-6">
              <Image 
                src="/icons/history/duration.png" 
                alt="기간" 
                width={32} 
                height={32}
                className="opacity-70"
              />
            </div>
            <div className="text-4xl font-bold text-wizfore-text-primary mb-3">
              {operatingYears}<span className="text-2xl">년</span>
            </div>
            <h3 className="text-wizfore-coral-primary font-semibold text-lg mb-2">운영 연수</h3>
            <p className="text-wizfore-text-secondary text-sm leading-relaxed">
              {establishedYear}년부터 현재까지 지속적인 성장과 발전
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default StatsSection