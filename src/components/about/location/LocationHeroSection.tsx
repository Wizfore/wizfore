'use client'

import { motion } from 'framer-motion'

interface LocationHeroSectionProps {
  heroMessage?: {
    title: string
    description: string
  }
}

const LocationHeroSection: React.FC<LocationHeroSectionProps> = ({ heroMessage }) => {
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
          {heroMessage?.title || "오시는길"}
        </motion.h1>
        <motion.p 
          className="text-xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {heroMessage?.description || "위즈포레 사회서비스센터 위치 및 교통 안내"}
        </motion.p>
      </div>
    </section>
  )
}

export default LocationHeroSection