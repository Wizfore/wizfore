'use client'

import { motion } from 'framer-motion'

interface AdvisorsHeroSectionProps {
  heroMessage?: {
    title: string
    description: string
  }
}

const AdvisorsHeroSection: React.FC<AdvisorsHeroSectionProps> = ({ heroMessage }) => {
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
          {heroMessage?.title || "자문위원"}
        </motion.h1>
        <motion.p 
          className="text-xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {heroMessage?.description || "위즈포레의 전문성 향상을 위해 도움을 주시는 분들을 소개합니다"}
        </motion.p>
      </div>
    </section>
  )
}

export default AdvisorsHeroSection