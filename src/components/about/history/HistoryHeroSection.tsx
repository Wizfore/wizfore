'use client'

import { motion } from 'framer-motion'

interface HistoryHeroSectionProps {
  heroMessage?: {
    title: string
    description: string
  }
}

const HistoryHeroSection: React.FC<HistoryHeroSectionProps> = ({ heroMessage }) => {
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
          {heroMessage?.title || "센터 발자취"}
        </motion.h1>
        <motion.p 
          className="text-xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {heroMessage?.description || "센터의 성장과 발전 과정을 시간순으로 소개합니다"}
        </motion.p>
      </div>
    </section>
  )
}

export default HistoryHeroSection