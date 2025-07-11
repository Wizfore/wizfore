'use client'

import { motion } from 'framer-motion'

interface CommonHeroSectionProps {
  title: string
  description: string
  backgroundImage?: string
  className?: string
}

const CommonHeroSection: React.FC<CommonHeroSectionProps> = ({ 
  title, 
  description, 
  backgroundImage,
  className = ''
}) => {
  return (
    <section 
      className={`relative h-96 bg-cover bg-center flex items-center justify-center ${className}`}
      style={{
        backgroundImage: `url('${backgroundImage}')`
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
          {title}
        </motion.h1>
        <motion.p 
          className="text-xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {description}
        </motion.p>
      </div>
    </section>
  )
}

export default CommonHeroSection