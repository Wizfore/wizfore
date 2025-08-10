'use client'

import { motion } from 'framer-motion'

interface ProgramOverviewSectionProps {
  aboutMessage?: {
    title: string
    description: string
  }
  features?: Array<{
    icon: string
    title: string
    description: string
  }>
}

export default function ProgramOverviewSection({
  aboutMessage,
  features = []
}: ProgramOverviewSectionProps) {
  return (
    <section className="pt-8 md:pt-12 lg:pt-16 pb-8 md:pb-12 lg:pb-16 bg-white">
      <div className="container-custom mx-auto px-4 md:px-6 lg:px-8">
        {/* About Message */}
        {aboutMessage && (
          <motion.div 
            className="max-w-4xl mx-auto text-center mb-8 md:mb-12 lg:mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-wizfore-text-primary mb-4 md:mb-6">
              {aboutMessage.title}
            </h2>
            <p className="text-sm md:text-base lg:text-lg text-wizfore-text-secondary leading-relaxed">
              {aboutMessage.description}
            </p>
          </motion.div>
        )}

        {/* Features */}
        {features.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="text-center p-4 md:p-6 lg:p-8 bg-white rounded-lg"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-2xl md:text-3xl lg:text-4xl mb-3 md:mb-4">{feature.icon}</div>
                <h3 className="text-lg md:text-xl font-bold text-wizfore-text-primary mb-2 md:mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm md:text-base text-wizfore-text-secondary">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}