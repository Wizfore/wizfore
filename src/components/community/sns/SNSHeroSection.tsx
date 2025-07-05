'use client'

import { motion } from 'framer-motion'

interface SNSHeroSectionProps {
  heroMessage?: {
    title?: string
    description?: string
  }
}

export default function SNSHeroSection({ heroMessage }: SNSHeroSectionProps) {
  return (
    <section 
      className="relative h-96 bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: `url('/images/hero/defaultHero.jpg')`
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
          {heroMessage?.title || "SNS"}
        </motion.h1>
        <motion.p 
          className="text-xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {heroMessage?.description || "위즈포레의 생생한 활동 모습을 영상으로 만나보세요"}
        </motion.p>
      </div>
    </section>
  )
}