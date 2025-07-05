'use client'

import { motion } from 'framer-motion'
import type { DirectorInfo } from '@/types'

interface DirectorHeroSectionProps {
  director: DirectorInfo
}

const DirectorHeroSection: React.FC<DirectorHeroSectionProps> = ({ director }) => {
  return (
    <section 
      className="relative h-96 bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: `url('${director.heroImageUrl || '/images/hero/defaultHero.jpg'}')`
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
          {director.heroMessage?.title || "센터장 소개"}
        </motion.h1>
        <motion.p 
          className="text-xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {director.heroMessage?.description || "위즈포레를 이끌어가는 센터장을 소개합니다"}
        </motion.p>
      </div>
    </section>
  )
}

export default DirectorHeroSection