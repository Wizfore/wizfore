'use client'

import { motion } from 'framer-motion'
import type { DirectorInfo } from '@/types'

interface DirectorMessageSectionProps {
  director: DirectorInfo
}

const DirectorMessageSection: React.FC<DirectorMessageSectionProps> = ({ director }) => {
  if (!director.aboutMessage) return null

  return (
    <section className="relative py-24 bg-gradient-to-br from-wizfore-light-beige to-white overflow-hidden">
      {/* 배경 패턴 */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <defs>
            <pattern id="message-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="2" fill="currentColor"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#message-pattern)" className="text-wizfore-coral-primary" />
        </svg>
      </div>

      <div className="container-custom mx-auto px-4 relative z-10">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-black text-wizfore-text-primary mb-8">
            {director.aboutMessage.title}
          </h2>
          
          <div className="space-y-6">
            {director.aboutMessage.description.split('\n\n').map((message, index) => (
              <motion.p
                key={index}
                className="text-lg md:text-xl text-wizfore-text-secondary leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                {message}
              </motion.p>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default DirectorMessageSection