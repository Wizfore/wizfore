'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import ProgramCard from '@/components/programs/ProgramCard'

interface Program {
  title: string
  goal?: string | string[]
  content?: string[]
  target?: string | string[]
  types?: string[]
  order: number
}

interface ProgramListSectionProps {
  programs: Program[]
  programType: 'therapy' | 'adult-day' | 'afterschool' | 'counseling' | 'sports'
}

export default function ProgramListSection({ programs, programType }: ProgramListSectionProps) {
  return (
    <section className="py-20 bg-white">
      <div className="container-custom mx-auto px-6">
        {/* 프로그램 목록 */}
        <div className="space-y-12 max-w-5xl mx-auto">
          {programs
            .sort((a, b) => a.order - b.order)
            .map((program, index) => (
              <motion.div
                key={program.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <ProgramCard
                  program={program}
                  index={index}
                />
              </motion.div>
            ))}
        </div>
        
        {/* 추가 안내 */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-3xl mx-auto">
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <p className="text-wizfore-text-secondary mb-4 text-lg font-medium">
                더 자세한 정보나 상담이 필요하시나요?
              </p>
              <Link href="/contact/inquiry">
                <motion.button 
                  className="bg-wizfore-coral-primary text-white px-8 py-4 rounded-xl hover:bg-wizfore-coral-secondary transition-all duration-300 flex items-center gap-3 mx-auto shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-wizfore-coral-primary/30"
                  whileHover={{ 
                    scale: 1.05,
                    y: -2,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="상담 문의하러 가기"
                >
                  <span className="font-semibold">상담 문의하기</span>
                  <motion.div
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </motion.button>
              </Link>
            </motion.div>
            <motion.p 
              className="text-sm text-wizfore-text-secondary/80"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
            >
              저희는 언제나 여러분의 문의를 기다리고 있습니다.
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}