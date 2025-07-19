'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { Target, Award, Users } from 'lucide-react'

interface ProgramCardProps {
  program: {
    title: string
    goal?: string | string[]
    content?: string[]
    target?: string | string[]
    types?: string[]
  }
  icon: ReactNode
  colorClass: string
  index: number
  cardType?: 'therapy' | 'adult-day' | 'afterschool'
}

export default function ProgramCard({
  program,
  icon,
  colorClass,
  index,
  cardType = 'therapy'
}: ProgramCardProps) {
  return (
    <motion.div
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      {/* 카드 헤더 */}
      <div className="bg-gradient-to-r from-wizfore-warm-brown/10 to-wizfore-warm-brown/5 p-6">
        <div className="flex items-center mb-4">
          <div className={`inline-flex items-center p-3 rounded-full mr-4 ${colorClass}`}>
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-wizfore-text-primary">
              {program.title}
            </h3>
          </div>
        </div>
      </div>

      {/* 카드 본문 */}
      <div className="p-6">
        {/* 치료 대상 (therapy 타입만) */}
        {cardType === 'therapy' && program.target && (
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <Users className="w-4 h-4 text-wizfore-warm-brown mr-2" />
              <span className="text-sm font-medium text-wizfore-text-primary">치료 대상</span>
            </div>
            <div className="pl-6 space-y-1">
              {Array.isArray(program.target) ? (
                program.target.map((item, itemIndex) => (
                  <p key={itemIndex} className="text-wizfore-text-secondary text-sm leading-relaxed">
                    • {item}
                  </p>
                ))
              ) : (
                <p className="text-wizfore-text-secondary text-sm leading-relaxed">
                  {program.target}
                </p>
              )}
            </div>
          </div>
        )}

        {/* 목표 */}
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <Target className="w-4 h-4 text-wizfore-warm-brown mr-2" />
            <span className="text-sm font-medium text-wizfore-text-primary">
              {cardType === 'therapy' ? '치료 목표' : '프로그램 목표'}
            </span>
          </div>
          <div className="pl-6 space-y-1">
            {Array.isArray(program.goal) ? (
              program.goal.map((item, itemIndex) => (
                <p key={itemIndex} className="text-wizfore-text-secondary text-sm leading-relaxed">
                  • {item}
                </p>
              ))
            ) : (
              <p className="text-wizfore-text-secondary text-sm leading-relaxed">
                {program.goal}
              </p>
            )}
          </div>
        </div>

        {/* 내용 또는 유형 */}
        {(program.content || program.types) && (
          <div>
            <div className="flex items-center mb-2">
              <Award className="w-4 h-4 text-wizfore-warm-brown mr-2" />
              <span className="text-sm font-medium text-wizfore-text-primary">
                {program.content ? '주요 내용' : '치료 유형'}
              </span>
            </div>
            <div className="pl-6 space-y-1">
              {(program.content || program.types)?.map((item, itemIndex) => (
                <p key={itemIndex} className="text-wizfore-text-secondary text-sm leading-relaxed">
                  • {item}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}