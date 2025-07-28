'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface ProgramPageLayoutProps {
  heroData: {
    title?: string
    description?: string
    backgroundImage?: string
    defaultImageUrl?: string
  }
  aboutData: {
    title?: string
    description?: string
  }
  children: ReactNode
}

export default function ProgramPageLayout({
  heroData,
  aboutData,
  children
}: ProgramPageLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 히어로 섹션 */}
      <section 
        className="relative h-96 bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: `url('${heroData.backgroundImage || heroData.defaultImageUrl}')`
        }}
      >
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 text-center text-white">
          <motion.h1 
            className="text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {heroData.title}
          </motion.h1>
          <motion.p 
            className="text-xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {heroData.description}
          </motion.p>
        </div>
      </section>

      {/* 프로그램 개요 섹션 */}
      <section className="py-16 bg-white">
        <div className="container-custom mx-auto px-4">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-wizfore-text-primary mb-6">
              {aboutData.title}
            </h2>
            <p className="text-lg text-wizfore-text-secondary leading-relaxed">
              {aboutData.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* 프로그램 목록 섹션 */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom mx-auto px-4">
          {children}
        </div>
      </section>
    </div>
  )
}